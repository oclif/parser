import { Flag, IFlagOptions } from './base'

export interface IValueFlagOptions extends IFlagOptions {
  type?: 'option' | 'multiple'
}

export abstract class OptionFlag<T> extends Flag<T> {
  public input: string[] = []
  public readonly type: string
  public readonly multiple: boolean
  constructor(options: IValueFlagOptions = {}) {
    super(options)
    this.type = options.type || 'option'
    this.multiple = this.type === 'multiple'
  }
  public get value() {
    if (this.multiple) return this.input.map(i => this.parse(i))
    return this.input[0] ? this.parse(this.input[0]) : undefined
  }
  public abstract parse(input: string): T
}
