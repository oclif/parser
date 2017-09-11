import { IFlagOptions } from './base'
import { BooleanFlag } from './boolean'
import { IntegerFlag } from './integer'
import { StringFlag } from './string'

export { ValueFlag } from './value'
export { Flag } from './base'
export { BooleanFlag } from './boolean'

export const flags = {
  boolean: (options: IFlagOptions = {}) => {
    return new BooleanFlag(options)
  },
  integer: (options: IFlagOptions = {}) => {
    return new IntegerFlag(options)
  },
  string: (options: IFlagOptions = {}) => {
    if (options.multiple) {
      return new MultipleStringFlag(options)
    } else {
      return new StringFlag(options)
    }
  },
}
