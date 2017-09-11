import { Arg, args } from './args'
import { BooleanFlag, ValueFlag } from './flags'
import { validate } from './validate'

export interface IFlags {
  [name: string]: BooleanFlag | ValueFlag<any>
}

export type ParserInput <T extends IFlags> = {
  argv: string[]
  flags: T
  args: Array<Arg<any>>
  strict: boolean
}

export type ParserOutput <T extends IFlags> = {
  flags: {[P in keyof T]?: T[P]['value']}
  args: {[name: string]: any}
  argv: string[]
  raw: RawParseArray
}

export type RawParseArray = Array<Arg<any> | BooleanFlag | ValueFlag<any>>

function parseArray<T extends IFlags>(input: ParserInput<T>): RawParseArray {
  const output: RawParseArray = []
  const argv = input.argv.slice(0)
  let parsingFlags = true

  const findLongFlag = (arg: string) => {
    const name = arg.slice(2)
    if (input.flags[name]) {
      return name
    }
  }

  const findShortFlag = (arg: string) => {
    return Object.keys(input.flags).find(k => input.flags[k].char === arg[1])
  }

  const parseFlag = (arg: string): boolean => {
    const long = arg.startsWith('--')
    const name = long ? findLongFlag(arg) : findShortFlag(arg)
    if (!name) {
      const i = arg.indexOf('=')
      if (i !== -1) {
        const sliced = arg.slice(i + 1)
        argv.unshift(sliced)

        const equalsParsed = parseFlag(arg.slice(0, i))
        if (!equalsParsed) {
          argv.shift()
        }
        return equalsParsed
      }
      return false
    }
    const flag = input.flags[name]
    if (flag.type === 'value') {
      let value
      if (long || arg.length < 3) {
        value = argv.shift()
      } else {
        value = arg.slice(arg[2] === '=' ? 3 : 2)
      }
      if (!value) {
        throw new Error(`Flag --${name} expects a value`)
      }
      if (flag.multiple) {
        flag.input = flag.input || []
        arr.push(value)
      } else {
        flag.input = value
      }
      output.push(flag)
    } else {
      output.push(flag)
      // push the rest of the short characters back on the stack
      if (!long && arg.length > 2) {
        argv.unshift(`-${arg.slice(2)}`)
      }
    }
    return true
  }

  while (argv.length) {
    const arg = argv.shift() as string
    if (parsingFlags && arg.startsWith('-')) {
      // attempt to parse as arg
      if (arg === '--') {
        parsingFlags = false
        continue
      }
      if (parseFlag(arg)) {
        continue
      }
      // not actually a flag if it reaches here so parse as an arg
    }
    // not a flag, parse as arg
    const outputArgs = output.filter(o => o.type === 'arg') as Array<Arg<any>>
    const numArgs = outputArgs.length
    let nextArg: Arg<any> = input.args[numArgs]
    if (!nextArg) {
      nextArg = args.string()
    }
    nextArg.input = arg
    output.push(nextArg)
  }
  return output
}

function setNames<T extends IFlags>(flags: ParserInput<T>['flags']) {
  for (const name of Object.keys(flags)) {
    flags[name].name = name
  }
}

function buildOutputFromArray<T extends IFlags>(raw: RawParseArray): ParserOutput <T> {
  return raw.reduce(
    (obj, flag) => {
      switch (flag.type) {
        case 'value':
          if (!flag.input) { throw new Error('null input not expected') }
          flag.value = flag.parse(flag.input)
          if (flag.multiple) {
            obj.flags[flag.name] = obj.flags[flag.name] || []
            obj.flags[flag.name].push(flag.parse(flag.value))
          } else {
            obj.flags[flag.name] = flag.value
          }
          break
        case 'boolean':
          obj.flags[flag.name] = true
          break
        case 'arg':
          const arg: Arg<any> = flag
          const value = arg.parse(arg.input as string)
          obj.argv.push(value)
          if (arg.name) {
            obj.args[arg.name] = value
          }
          break
        default:
          throw new Error(`Unexpected: ${flag}`)
      }
      return obj
    },
    {
      args: {},
      argv: [],
      flags: {} as {[P in keyof T]?: T[P]['value']},
      raw,
    } as ParserOutput<T>,
  )
}

export function parse<T extends IFlags>(options: Partial<ParserInput<T>>): ParserOutput<T> {
  const input: ParserInput<T> = {
    args: options.args || [],
    argv: options.argv || process.argv.slice(2),
    flags: options.flags || {} as T,
    strict: options.strict !== false,
  }
  setNames(input.flags)
  const arr = parseArray(input)
  const output = buildOutputFromArray<T>(arr)
  validate(input, output)
  return output
}
