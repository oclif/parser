import _ from './lodash'

export interface IFlagBase <T> {
  name?: string
  description?: string
  value: T
  handleInput (argv: string[]): ParsingToken | undefined
}

export interface IOptionFlag <T> extends IFlagBase <T> {
  type: 'option'
}

export interface IMultiOptionFlag <T> extends IFlagBase <T[]> {
  type: 'multiple'
}

export type IFlag <T> = IOptionFlag<T> | IMultiOptionFlag<T>

type IFlagOptions = {
  type: 'option' | 'multiple'
  name?: string
  description?: string
}

abstract class Flag <T> {
  public type: 'option' | 'multiple'
  public name?: string
  public description?: string
  constructor (options: IFlagOptions) {
    this.type = options.type
    this.name = options.name
    this.description = options.description
  }
  public abstract handleInput (argv: string[]): ParsingToken | undefined
  public abstract get value(): T[] | T | undefined
}

abstract class OptionFlag <T> extends Flag <T> {
  public input: string[] = []
  public get value() {
    if (this.type === 'multiple') return this.input.map(i => this.parse(i))
    return this.input[0] ? this.parse(this.input[0]) : undefined
  }
  public abstract parse(input: string): T
  public handleInput (argv: string[]): ParsingToken | undefined {
    const argv0 = argv.shift()
    if (!argv0) { return }
    if (argv0 !== `--${this.name}`) { argv.unshift(argv0); return }
    const argv1 = argv.shift()
    if (!argv1) { throw new Error('no value error') }
    this.input.push(argv1)
    return {type: 'option', flag: this.name!, input: argv1} as OptionFlagToken
  }
}

class StringFlag extends OptionFlag <string> {
  public parse(input: string) { return input }
}
class IntFlag extends OptionFlag<number> {
  public parse(input: string) { return parseInt(input, 10) }
}

const flags = {
  integer: (options: Partial<IFlagOptions>={}) => {
    if (options.type === 'multiple') {
      return new IntFlag({...options, type: 'multiple'}) as IMultiOptionFlag<number>
    } else {
      return new IntFlag({...options, type: 'option'}) as IOptionFlag<number>
    }
  },
  string: (options: Partial<IFlagOptions>={}) => {
    if (options.type === 'multiple') {
      return new StringFlag({...options, type: 'multiple'}) as IMultiOptionFlag<string>
    } else {
      return new StringFlag({...options, type: 'option'}) as IOptionFlag<string>
    }
  },
}

export interface InputFlags {
  [name: string]: IFlag<any>
}

export type ParserInput <T extends InputFlags> = {
  argv: string[]
  flags: T
  // args: Array<Arg<any>>
  strict: boolean
}

export type ParserOutput <T extends InputFlags> = {
  flags: {[P in keyof T]?: T[P]['value']}
  // args: {[name: string]: any}
  argv: string[]
  raw: ParsingToken[]
}

export type OptionFlagToken = {type: 'option', flag: string, input: string}
export type ParsingToken = OptionFlagToken

export function parse <T extends InputFlags> (options: Partial<ParserInput<T>>): ParserOutput<T> {
  const input: ParserInput<T> = {
    // args: options.args || [],
    argv: options.argv || process.argv.slice(2),
    flags: options.flags || {} as T,
    strict: options.strict !== false
  }
  const parser = new Parser<T>(input)
  return parser.parse()
}

export class Parser <T extends InputFlags> {
  private argv: string[]
  private raw: ParsingToken[] = []
  constructor (readonly input: ParserInput<T>) {
    this.argv = input.argv.slice(0)
    this._setNames(input)
  }

  public parse(): ParserOutput<T> {
    while (this.argv.length) this._findNextToken(this.argv)
    return {
      argv: [],
      flags: _.mapValues(this.input.flags, 'value'),
      raw: this.raw
    }
  }

  private _findNextToken (argv: string[]): void {
    const elements: IFlag<any>[] = Object.values(this.input.flags)
    for (const element of elements) {
      const token = element.handleInput(argv)
      if (token) {
        this.raw.push(token)
        return
      }
    }
    throw new Error(`Unexpected argument: ${argv[0]}`)
  }


  private _setNames(input: ParserInput<T>) {
    for (const name of Object.keys(input.flags)) {
      input.flags[name].name = name
    }
  }
}
