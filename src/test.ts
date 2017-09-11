import _ from './lodash'

export interface IFlagBase <T> {
  name?: string
  description?: string
  value: T
  handleInput (argv: string[]): boolean
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
  public abstract handleInput (argv: string[]): boolean
  public abstract get value(): T[] | T | undefined
}

abstract class OptionFlag <T> extends Flag <T> {
  public input: string[] = []
  public get value() {
    if (this.type === 'multiple') return this.input.map(i => this.parse(i))
    return this.input[0] ? this.parse(this.input[0]) : undefined
  }
  public abstract parse(input: string): T
  public handleInput (argv: string[]): boolean {
    const argv0 = argv.shift()
    if (!argv0) { return false }
    if (argv0 !== `--${this.name}`) { argv.unshift(argv0); return false }
    const argv1 = argv.shift()
    if (!argv1) { throw new Error('no value error') }
    this.input.push(argv1)
    return true
  }
}

class StringFlag extends OptionFlag <string> {
  public parse(input: string) { return input }
}
class IntFlag extends OptionFlag<number> {
  public parse(input: string) { return parseInt(input, 10) }
}

// type ParsedOutput <T extends Command> = {
//   flags: {[P in keyof T['flags']]: T['flags'][P]['value']}
// }

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
  raw: Array<IFlag<any>[]>
}

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
  constructor (readonly input: ParserInput<T>) {
    this.argv = input.argv.slice(0)
    this._setNames(input)
  }

  public parse(): ParserOutput<T> {
    while (this.argv.length) this._findNextToken(this.argv)
    return {
      argv: [],
      flags: _.mapValues(this.input.flags, 'value'),
      raw: []
    }
  }

  private _findNextToken (argv: string[]): void {
    const elements: IFlag<any>[] = Object.values(this.input.flags)
    for (const element of elements) {
      if (element.handleInput(argv)) return
    }
    throw new Error(`Unexpected argument: ${argv[0]}`)
  }


  private _setNames(input: ParserInput<T>) {
    for (const name of Object.keys(input.flags)) {
      input.flags[name].name = name
    }
  }
}

const out = parse({
  flags: {
    bar: flags.integer(),
    foo: flags.string(),
  }
})
console.dir(out)

// class Command {
//   public flags = {
//     bar: flags.integer(),
//     foo: flags.string(),
//   }

//   constructor () {
//     Object.entries(this.flags).map(([name, flag]) => { flag.name = name })
//   }

//   public run (argv: string[]) {
//     const {flags} = this._parse(argv)
//   }

// const cmd = new Command()
// cmd.run(['--foo', 'bar', '--foo', 'baz'])
