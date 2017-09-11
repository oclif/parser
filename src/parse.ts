import _ from './lodash'

import { IArg } from './args'
import { IFlag } from './flags'

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

export type ArgToken = { type: 'arg'; arg: number; input: string }
export type BooleanFlagToken = { type: 'boolean'; flag: string; input: string }
export type OptionFlagToken = { type: 'option'; flag: string; input: string }
export type ParsingToken = ArgToken | BooleanFlagToken | OptionFlagToken

export function parse<T extends InputFlags>(options: Partial<ParserInput<T>>): ParserOutput<T> {
  const input: ParserInput<T> = {
    args: options.args || [],
    argv: options.argv || process.argv.slice(2),
    flags: options.flags || ({} as T),
    strict: options.strict !== false,
  }
  const parser = new Parser<T>(input)
  return parser.parse()
}

export class Parser<T extends InputFlags> {
  private argv: string[]
  private raw: ParsingToken[] = []
  constructor(readonly input: ParserInput<T>) {
    this.argv = input.argv.slice(0)
    this._setNames(input)
  }

  public parse(): ParserOutput<T> {
    let parsingFlags = true
    while (this.argv.length) {
      if (parsingFlags && this.argv[0].startsWith('-')) {
        // attempt to parse as arg
        if (this.argv[0] === '--') {
          this.argv.shift()
          parsingFlags = false
          continue
        }
        if (this._parseFlag(this.argv)) {
          continue
        }
        // not actually a flag if it reaches here so parse as an arg
      }
      // not a flag, parse as arg
      const input = this.argv.shift() as string
      const outputArgs = this.raw.filter(o => o.type === 'arg') as Array<IArg>
      const numArgs = outputArgs.length
      let nextArg: IArg = this.input.args[numArgs]
      if (!nextArg) {
        nextArg = {} as IArg
      }
      nextArg.input = input
      this.raw.push({ type: 'arg', arg: numArgs, input })
    }
    return {
      args: this.input.args.reduce(
        (args, a) => {
          if (a.name) args[a.name] = a.input
          return args
        },
        {} as ParserOutput<T>['args'],
      ),
      argv: this.raw.filter(o => o.type === 'arg').map(a => a.input),
      flags: _.mapValues(this.input.flags, 'value'),
      raw: this.raw,
    }
  }

  private _parseFlag(argv: string[]): boolean | undefined {
    const flags = Object.values(this.input.flags)
    for (const flag of flags) {
      const token = flag.handleInput(argv)
      if (token) {
        this.raw.push(token)
        return true
      }
    }
  }

  private _setNames(input: ParserInput<T>) {
    for (const name of Object.keys(input.flags)) {
      input.flags[name].name = name
    }
  }
}
