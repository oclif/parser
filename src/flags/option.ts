import { OptionFlagToken, ParsingToken } from '../parse'
import { Flag, FlagTypes, IFlagBase, IFlagOptions } from './base'

export interface IOptionFlag<T> extends IFlagBase<T> {
  type: 'option'
}

export interface IMultiOptionFlag<T> extends IFlagBase<T[]> {
  type: 'multiple'
}

export abstract class OptionFlag<T> extends Flag<T> {
  public input: string[] = []
  public readonly type: string
  constructor(type: FlagTypes | undefined, options: IFlagOptions = {}) {
    super(options)
    this.type = type || 'option'
  }
  public get value() {
    if (this.type === 'multiple') return this.input.map(i => this.parse(i))
    return this.input[0] ? this.parse(this.input[0]) : undefined
  }
  public abstract parse(input: string): T
  public handleInput(argv: string[]): ParsingToken | undefined {
    const argv0 = argv.shift()
    if (!argv0) {
      return
    }
    if (argv0 !== `--${this.name}`) {
      argv.unshift(argv0)
      return
    }
    const argv1 = argv.shift()
    if (!argv1) {
      throw new Error('no value error')
    }
    this.input.push(argv1)
    return { type: 'option', flag: this.name!, input: argv1 } as OptionFlagToken
  }
}
