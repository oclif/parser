import { Flag, IFlagOptions } from './base'

export interface IValueFlagOptions extends IFlagOptions {
  multiple?: boolean
}

export abstract class ValueFlag<T> extends Flag<T> {
  public type: 'value' = 'value'
  public multiple: boolean

  constructor(options: IValueFlagOptions) {
    super(options)
    this.multiple = !!options.multiple
  }

  public abstract parse(input: string): T
}
