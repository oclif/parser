import _ from './lodash'

import { IArg } from './args'
import { BooleanFlag, IFlag, OptionFlag } from './flags'
import { validate } from './validate'

export interface InputFlags {
  [name: string]: IFlag<any>
}

export type ParserInput<T extends InputFlags> = {
  argv: string[]
  flags: T
  args: IArg[]
  strict: boolean
}

export type ParserOutput<T extends InputFlags> = {
  flags: { [P in keyof T]?: T[P]['value'] }
  args: { [name: string]: any }
  argv: string[]
  raw: ParsingToken[]
}

export type ArgToken = { type: 'arg'; arg: IArg; i: number; input: string }
export type BooleanFlagToken = { type: 'boolean'; flag: BooleanFlag }
export type OptionFlagToken = { type: 'option'; flag: OptionFlag<any>; input: string }
export type ParsingToken = ArgToken | BooleanFlagToken | OptionFlagToken

export function parse<T extends InputFlags>(options: Partial<ParserInput<T>>): ParserOutput<T> {
  const input: ParserInput<T> = {
    args: options.args || [],
    argv: options.argv || process.argv.slice(2),
    flags: options.flags || ({} as T),
    strict: options.strict !== false,
  }
  const parser = new Parser<T>(input)
  const output = parser.parse()
  validate(input, output)
  return output
}

export class Parser<T extends InputFlags> {
  private argv: string[]
  private raw: ParsingToken[] = []
  constructor(readonly input: ParserInput<T>) {
    this.argv = input.argv.slice(0)
    this._setNames(input)
  }

  public parse(): ParserOutput<T> {
    const findLongFlag = (arg: string) => {
      const name = arg.slice(2)
      if (this.input.flags[name]) {
        return name
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
      if (flag.type === 'option') {
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
        this.raw.push({ type: 'option', flag: flag as OptionFlag<any>, input: value })
      } else {
        flag.input.push(arg)
        this.raw.push({ type: 'boolean', flag: flag as BooleanFlag })
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
          if (a.name) args[a.name] = a.input
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
    for (const name of Object.keys(input.flags)) {
      input.flags[name].name = name
    }
  }
}
