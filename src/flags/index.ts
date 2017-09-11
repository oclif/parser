import { IFlagOptions } from './base'
import { BooleanFlag } from './boolean'
import { IntegerFlag } from './integer'
import { StringFlag } from './string'
import { IValueFlagOptions } from './value'

export { ValueFlag } from './value'
export { Flag } from './base'
export { BooleanFlag } from './boolean'

export const flags = {
  boolean: (options: IFlagOptions = {}) => {
    return new BooleanFlag(options)
  },
  integer: (options: IValueFlagOptions = {}) => {
    return new IntegerFlag(options)
  },
  string: (options: IValueFlagOptions = {}) => {
    return new StringFlag(options)
  },
}
