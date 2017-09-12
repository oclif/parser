import { Flag, IFlagOptions } from './base'

export interface IOptionFlag<T> extends Flag {
  readonly type: 'option'
  readonly value: T
  input: string[]
}

export interface IMultiOptionFlag<T> extends Flag {
  readonly type: 'multi'
  readonly value: T[]
  input: string[]
}

export interface IValueFlagOptions extends IFlagOptions {
  multiple?: boolean
}

export interface IMultiOptionFlagOptions extends IFlagOptions {
  multiple: true
}

export abstract class OptionFlag<T> extends Flag {
  public input: string[] = []
  public readonly type: 'multi' | 'option'
  constructor(options: IValueFlagOptions = {}) {
    super(options)
    this.type = options.multiple ? 'multi' : 'option'
  }
  public get value() {
    if (this.type === 'multi') return this.input.map(i => this.parse(i))
    return this.input[0] ? this.parse(this.input[0]) : undefined
  }
  public abstract parse(input: string): T
}
