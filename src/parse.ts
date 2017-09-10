import { Flag, ValueFlag } from './flags'
import { Arg } from './args'
import { validate } from './validate'
export type InputArgs = Arg<string>[]
export type InputFlags = { [name: string]: Flag }
export interface IInputOptions {
  argv: string[]
  flags?: InputFlags
  args?: InputArgs
  output?: 'object' | 'array'
}
type InputOptions = IInputOptions & {
  flags: InputFlags
  args: InputArgs
}
export type OutputArg = { type: 'arg'; i: number; input: string; arg: Arg<string> }
export type OutputFlag = { type: 'flag'; name: string; flag: Flag }
export type OutputValueFlag = { type: 'valueflag'; name: string; input: string; flag: ValueFlag<any> }
export type OutputArray = (OutputArg | OutputFlag | OutputValueFlag)[]

function parseArray(input: InputOptions): OutputArray {
  let output: OutputArray = []
  let parsingFlags = true
  let argv = input.argv.slice(0)
  let argI = 0

  let findLongFlag = (arg: string) => {
    let name = arg.slice(2)
    if (input.flags[name]) return name
  }

  let findShortFlag = (arg: string) => {
    return Object.keys(input.flags).find(k => input.flags[k].char === arg[1])
  }

  let parseFlag = (arg: string): boolean => {
    let long = arg.startsWith('--')
    let name = long ? findLongFlag(arg) : findShortFlag(arg)
    if (!name) {
      const i = arg.indexOf('=')
      if (i !== -1) {
        let sliced = arg.slice(i + 1)
        argv.unshift(sliced)

        let equalsParsed = parseFlag(arg.slice(0, i))
        if (!equalsParsed) {
          argv.shift()
        }
        return equalsParsed
      }
      return false
    }
    let flag = input.flags[name]
    if (flag instanceof ValueFlag) {
      let input
      if (long || arg.length < 3) input = argv.shift()
      else input = arg.slice(arg[2] === '=' ? 3 : 2)
      if (!input) throw new Error(`Flag --${name} expects a value`)
      output.push({ type: 'valueflag', name, input, flag })
    } else {
      output.push({ type: 'flag', name, flag })
      // push the rest of the short characters back on the stack
      if (!long && arg.length > 2) argv.unshift(`-${arg.slice(2)}`)
    }
    return true
  }

  while (argv.length) {
    let arg = argv.shift() as string
    if (arg.startsWith('-')) {
      // attempt to parse as arg
      if (arg === '--') {
        parsingFlags = false
        continue
      }
      if (parseFlag(arg)) continue
      // not actually a flag if it reaches here so parse as an arg
    }
    // not a flag, parse as arg
    output.push({ type: 'arg', i: argI, input: arg, arg: input.args[argI] })
    argI++
  }
  return output
}

export type Output = {
  flags: { [name: string]: string | boolean }
  args: { [name: string]: string | boolean }
  argv: string[]
}

export function parse(options: IInputOptions & { output?: 'object' }): Output
export function parse(options: IInputOptions & { output: 'array' }): OutputArray
export function parse(options: IInputOptions): any {
  let input: InputOptions = {
    flags: {},
    args: [],
    ...options,
  }
  const arr = parseArray(input)
  validate(input.args, arr)
  if (input.output === 'array') return arr
  return arr.reduce(
    (obj, elem) => {
      switch (elem.type) {
        case 'valueflag':
          obj.flags[elem.name] = elem.flag.parse(elem.input)
          break
        case 'flag':
          obj.flags[elem.name] = true
          break
        case 'arg':
          obj.argv.push(elem.input)
          let { name } = input.args[elem.i]
          if (name) obj.args[name] = elem.input
          break
      }
      return obj
    },
    {
      flags: {},
      args: {},
      argv: [],
    } as Output,
  )
}
