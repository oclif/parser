import { BooleanFlag, IBooleanFlag, IBooleanFlagOptions } from './boolean'
import { integerFlag } from './integer'
import { IMultiOptionFlag, IOptionFlag, IOptionFlagOptions, Multiple, OptionFlag, Singular } from './option'
import { flag as stringFlag } from './string'

export type IFlag<T> = IBooleanFlag | IOptionFlag<T> | IMultiOptionFlag<T>
export { IBooleanFlag, IOptionFlag, IMultiOptionFlag, IOptionFlagOptions, OptionFlag, Singular, Multiple }

export const flags = {
  boolean: (options: IBooleanFlagOptions = {}) => {
    return new BooleanFlag(options)
  },
  integer: integerFlag,
  string: stringFlag,
}

export const defaultFlags = {
  color: flags.boolean({ allowNo: true }),
}
