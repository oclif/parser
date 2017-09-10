import { IFlagOptions } from './base'
import { BooleanFlag } from './boolean'
import { StringFlag } from './string'
import { IValueFlagOptions } from './value'

export { Flag } from './base'
export { ValueFlag } from './value'

export const flags = {
  boolean: (options: IFlagOptions = {}) => {
    return new BooleanFlag(options)
  },
  string: (options: IValueFlagOptions = {}) => {
    return new StringFlag(options)
  },
}
