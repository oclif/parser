import _ from 'ts-lodash'
import { Arg } from './args'
import { defaultFlags, IBooleanFlag, IFlag } from './flags'
import { InputFlags } from '.'

export type DefaultFlags = { [P in keyof typeof defaultFlags]: typeof defaultFlags[P]['value'] }
export type OutputArgs = { [k: string]: any }
export type OutputFlags<T extends InputFlags | undefined> = { [P in keyof T]: T[P]['value'] } & DefaultFlags
export type ParserOutput<T extends InputFlags | undefined> = {
  flags: OutputFlags<T>
  args: { [k: string]: any }
  argv: string[]
  raw: ParsingToken[]
}

export type ArgToken = { type: 'arg'; input: string }
export type FlagToken = { type: 'flag'; flag: string; input: string }
export type ParsingToken = ArgToken | FlagToken

export type ParserInput = {
  argv: string[]
  flags: InputFlags
  args: Arg<any>[]
  strict: boolean
  parseContext: { [k: string]: any }
}

export class Parser {
  private argv: string[]
  private raw: ParsingToken[] = []
  private booleanFlags: { [k: string]: IBooleanFlag }
  constructor(readonly input: ParserInput) {
    this.argv = input.argv.slice(0)
    this._setNames()
    this.booleanFlags = _.pickBy(input.flags, (f: IFlag<any>) => f.type === 'boolean')
  }

  public parse() {
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
        flag.input.push(input)
        this.raw.push({ type: 'flag', flag: flag.name!, input })
      } else {
        flag.input = arg
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
      const arg = this.input.args[this._argTokens.length]
      if (arg) arg.input = input
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

  private _flags(): OutputFlags<any> {
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
        const value = flag.parse(token.input, {
          flag,
          ...this.input.parseContext,
        })
        if (flag.multiple) {
          flags[token.flag] = flags[token.flag] || []
          flags[token.flag].push(value)
        } else {
          flags[token.flag] = value
        }
        flag.value = flags[token.flag]
      }
    }
    for (const [k, flag] of Object.entries(this.input.flags)) {
      if (!flags[k]) {
        if (flag.type === 'option' && flag.default) {
          if (typeof flag.default === 'function') {
            flags[k] = flag.default({ flag, input: this.input })
          } else {
            flags[k] = flag.default
          }
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
        if (arg) {
          args[i] = arg.parse(token.input, {
            arg,
            ...this.input.parseContext,
          })
        } else {
          args[i] = token.input
        }
      } else {
        if (arg.default) {
          if (typeof arg.default === 'function') {
            args[i] = arg.default()
          } else {
            args[i] = arg.default
          }
        }
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
