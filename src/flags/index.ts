import { IFlagOptions } from './base'
import { BooleanFlag } from './boolean'
import { IntFlag } from './integer'
import { OptionFlag } from './option'
import { StringFlag } from './string'

export type IFlag<T> = BooleanFlag | OptionFlag<T>
export { BooleanFlag, OptionFlag }

export const flags = {
  boolean: (options: IFlagOptions = {}) => {
    return new BooleanFlag(options)
  },
  integer: (options: IFlagOptions = {}) => {
    return new IntFlag(options)
  },
  string: (options: IFlagOptions = {}) => {
    return new StringFlag(options)
  },
}
