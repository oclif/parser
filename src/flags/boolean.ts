import { Flag } from './base'

export interface IBooleanFlag extends Flag {
  readonly type: 'boolean'
  value: boolean
}

export class BooleanFlag extends Flag implements IBooleanFlag {
  public readonly type: 'boolean' = 'boolean'
  public value: boolean
}
