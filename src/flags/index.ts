import { BooleanFlag } from './boolean'
import { StringFlag } from './string'
export { ValueFlag } from './value'
export { Flag, IFlagOptions } from './base'
import { IFlagOptions } from './base'

export const flags = {
  boolean: (options: IFlagOptions = {}) => {
    return new BooleanFlag(options)
  },
  string: (options: IFlagOptions = {}) => {
    return new StringFlag(options)
  },
}
