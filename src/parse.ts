import _ from 'ts-lodash'

import { IArg, Arg, newArg } from './args'
import { defaultFlags, IBooleanFlag, IFlag } from './flags'
import { validate } from './validate'

export interface InputFlags {
  [name: string]: IFlag<any>
}
export type InputArgs = IArg<any>[]

export type parserInput<T extends InputFlags> = {
  argv: string[]
  flags: T
  args: Arg<any>[]
  strict: boolean
}

export type ParserInput<T extends InputFlags> = {
  argv?: string[]
  flags?: T
  args?: InputArgs
  strict?: boolean
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
  raw: ParsingToken[]
}

export type ArgToken = { type: 'arg'; input: string }
export type FlagToken = { type: 'flag'; flag: string; input: string }
export type ParsingToken = ArgToken | FlagToken

export function parse<T extends InputFlags>(options: ParserInput<T>): ParserOutput<T> {
  const input = {
    args: (options.args || []).map(a => newArg(a)),
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

class Parser<T extends InputFlags> {
  private argv: string[]
  private raw: ParsingToken[] = []
  private booleanFlags: { [k: string]: IBooleanFlag }
  constructor(readonly input: parserInput<T>) {
    this.argv = input.argv.slice(0)
    this._setNames()
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
        if (flag && flag.allowNo) return flag.name
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
        let input
        if (long || arg.length < 3) {
          input = this.argv.shift()
        } else {
          input = arg.slice(arg[2] === '=' ? 3 : 2)
        }
        if (!input) {
          throw new Error(`Flag --${name} expects a value`)
        }
        this.raw.push({ type: 'flag', flag: flag.name!, input })
      } else {
        this.raw.push({ type: 'flag', flag: flag.name!, input: arg })
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
      this.raw.push({ type: 'arg', input })
    }
    const argv = this._argv()
    return {
      args: this._args(argv),
      argv,
      flags: this._flags(),
      raw: this.raw,
    }
  }

  private _args(argv: any[]): OutputArgs {
    const args: OutputArgs = {}
    for (let i = 0; i < this.input.args.length; i++) {
      const arg = this.input.args[i]
      args[arg.name!] = argv[i]
    }
    return args
  }

  private _flags(): OutputFlags<T> {
    const flags: OutputFlags<any> = {}
    for (const token of this._flagTokens) {
      const flag = this.input.flags[token.flag]
      if (!flag) throw new Error(`Unexpected flag ${token.flag}`)
      if (flag.type === 'boolean') {
        if (token.input === `--no-${flag.name}`) {
          flags[token.flag] = false
        } else {
          flags[token.flag] = true
        }
      } else {
        const value = flag.parse(token.input, {})
        if (flag.multiple) {
          flags[token.flag] = flags[token.flag] || []
          flags[token.flag].push(value)
        } else {
          flags[token.flag] = value
        }
      }
    }
    for (const [k, flag] of Object.entries(this.input.flags)) {
      if (!flags[k]) {
        if (flag.type === 'option' && flag.default) {
          flags[k] = flag.default
        }
      }
    }
    return flags
  }

  private _argv(): any[] {
    const args: any[] = []
    const tokens = this._argTokens
    for (let i = 0; i < Math.max(this.input.args.length, tokens.length); i++) {
      const token = tokens[i]
      const arg = this.input.args[i]
      if (token) {
        args[i] = arg ? arg.parse(token.input) : token.input
      } else {
        if (arg.default) args[i] = arg.default
      }
    }
    return args
  }

  private get _argTokens(): ArgToken[] {
    return this.raw.filter(o => o.type === 'arg') as ArgToken[]
  }
  private get _flagTokens(): FlagToken[] {
    return this.raw.filter(o => o.type === 'flag') as FlagToken[]
  }

  private _setNames() {
    for (const [name, flag] of Object.entries(this.input.flags)) {
      flag.name = name
    }
  }
}
