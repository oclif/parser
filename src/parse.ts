import _ from 'ts-lodash'

import { IArg } from './args'
import { defaultFlags, IBooleanFlag, IFlag, IMultiOptionFlag, IOptionFlag } from './flags'
import { validate } from './validate'

export interface InputFlags {
  [name: string]: IFlag<any>
}
export type InputArgs = IArg[]

export type ParserInput<T extends InputFlags> = {
  argv: string[]
  flags: T
  args: InputArgs
  strict: boolean
}

export type DefaultFlags = {
  color: IBooleanFlag
}
export type outputFlags<T extends InputFlags> = { [P in keyof T]: T[P]['value'] }
export type OutputFlags<T extends InputFlags> = outputFlags<T> & DefaultFlags
export type OutputArgs = { [k: string]: string }
export type ParserOutput<T extends InputFlags> = {
  flags: OutputFlags<T>
  args: OutputArgs
  argv: string[]
  raw: ParsingToken<any>[]
}

export type ArgToken = { type: 'arg'; arg: IArg; i: number; input: string }
export type BooleanFlagToken = { type: 'boolean'; flag: IBooleanFlag }
export type OptionFlagToken<T> = { type: 'option'; flag: IMultiOptionFlag<T> | IOptionFlag<T>; input: string }
export type ParsingToken<T> = ArgToken | BooleanFlagToken | OptionFlagToken<T>

export function parse<T extends InputFlags>(options: Partial<ParserInput<T>>): ParserOutput<T> {
  const input = {
    args: options.args || [],
    argv: options.argv || process.argv.slice(2),
    flags: {
      color: defaultFlags.color,
      ...options.flags || {},
    } as T & DefaultFlags,
    strict: options.strict !== false,
  }
  const parser = new Parser(input)
  const output = parser.parse()
  validate(input, output)
  return output
}

export class Parser<T extends InputFlags> {
  private argv: string[]
  private raw: ParsingToken<any>[] = []
  private booleanFlags: { [k: string]: IBooleanFlag }
  constructor(readonly input: ParserInput<T>) {
    this.argv = input.argv.slice(0)
    this._setNames(input)
    this.booleanFlags = _.pickBy(input.flags, (f: IFlag<any>) => f.type === 'boolean')
  }

  public parse(): ParserOutput<T> {
    const findLongFlag = (arg: string) => {
      const name = arg.slice(2)
      if (this.input.flags[name]) {
        return name
      }
      if (arg.startsWith('--no-')) {
        const flag = this.booleanFlags[arg.slice(5)]
        if (flag && flag.options!.allowNo) return flag.name
      }
    }

    const findShortFlag = (arg: string) => {
      return Object.keys(this.input.flags).find(k => this.input.flags[k].char === arg[1])
    }

    const parseFlag = (arg: string): boolean => {
      const long = arg.startsWith('--')
      const name = long ? findLongFlag(arg) : findShortFlag(arg)
      if (!name) {
        const i = arg.indexOf('=')
        if (i !== -1) {
          const sliced = arg.slice(i + 1)
          this.argv.unshift(sliced)

          const equalsParsed = parseFlag(arg.slice(0, i))
          if (!equalsParsed) {
            this.argv.shift()
          }
          return equalsParsed
        }
        return false
      }
      const flag = this.input.flags[name]
      if (flag.type === 'option' || flag.type === 'multi') {
        let value
        if (long || arg.length < 3) {
          value = this.argv.shift()
        } else {
          value = arg.slice(arg[2] === '=' ? 3 : 2)
        }
        if (!value) {
          throw new Error(`Flag --${name} expects a value`)
        }
        flag.input.push(value)
        if (flag.type === 'option') {
          this.raw.push({ type: 'option', flag, input: value })
        } else {
          this.raw.push({ type: 'option', flag, input: value })
        }
      } else {
        flag.value = arg !== `--no-${name}`
        this.raw.push({ type: 'boolean', flag, input: arg })
        // push the rest of the short characters back on the stack
        if (!long && arg.length > 2) {
          this.argv.unshift(`-${arg.slice(2)}`)
        }
      }
      return true
    }
    let parsingFlags = true
    while (this.argv.length) {
      const input = this.argv.shift() as string
      if (parsingFlags && input.startsWith('-')) {
        // attempt to parse as arg
        if (input === '--') {
          parsingFlags = false
          continue
        }
        if (parseFlag(input)) {
          continue
        }
        // not actually a flag if it reaches here so parse as an arg
      }
      // not a flag, parse as arg
      const outputArgs = this.raw.filter(o => o.type === 'arg') as Array<IArg>
      const numArgs = outputArgs.length
      let nextArg: IArg = this.input.args[numArgs]
      if (!nextArg) {
        nextArg = {} as IArg
      }
      nextArg.input = input
      this.raw.push({ type: 'arg', arg: nextArg, i: numArgs, input })
    }
    return {
      args: this.input.args.reduce(
        (args, a) => {
          if (a.name && a.input) args[a.name] = a.input
          return args
        },
        {} as ParserOutput<T>['args'],
      ),
      argv: (this.raw.filter(o => o.type === 'arg') as ArgToken[]).map(a => a.input),
      flags: _.mapValues(this.input.flags, 'value'),
      raw: this.raw,
    }
  }

  private _setNames(input: ParserInput<T>) {
    for (const [name, flag] of Object.entries(input.flags)) {
      flag.name = name
      flag.options = flag.options || {}
    }
  }
}
