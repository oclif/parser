import { Flag } from './base'

export interface IBooleanFlag extends Flag {
  type: 'boolean'
  value: boolean
}

export class BooleanFlag extends Flag {
  public readonly type: 'boolean' = 'boolean'
  public value: boolean
}
