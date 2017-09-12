import { IFlagOptions } from './base'
import { BooleanFlag } from './boolean'
import { IntFlag } from './integer'
import { IValueFlagOptions, OptionFlag } from './option'
import { StringFlag } from './string'

export type IFlag<T> = BooleanFlag | OptionFlag<T>
export { BooleanFlag, OptionFlag }

export const flags = {
  boolean: (options: IFlagOptions = {}) => {
    return new BooleanFlag(options)
  },
  integer: (options: IValueFlagOptions = {}) => {
    return new IntFlag(options)
  },
  string: (options: IValueFlagOptions = {}) => {
    return new StringFlag(options)
  },
}
