import { Flag, IFlagOptions } from './base'

export interface IBooleanFlagOptions extends IFlagOptions {
  allowNo?: boolean
}

export interface IBooleanFlag extends Flag {
  type: 'boolean'
  value: boolean
  options: IBooleanFlagOptions
}

export class BooleanFlag extends Flag {
  public readonly type: 'boolean' = 'boolean'
  public value: boolean

  constructor(readonly options: IBooleanFlagOptions) {
    super(options)
  }
}
