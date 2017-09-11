import { IFlagOptions } from './base'
import { BooleanFlag, IBooleanFlag } from './boolean'
import { IntFlag } from './integer'
import { IMultiOptionFlag, IOptionFlag } from './option'
import { StringFlag } from './string'

export type IFlag<T> = IBooleanFlag | IOptionFlag<T> | IMultiOptionFlag<T>

export const flags = {
  boolean: (options: IFlagOptions = {}) => {
    return new BooleanFlag(options)
  },
  integer: (options: IFlagOptions = {}) => {
    return new IntFlag(options.type, options)
    // if (options.type === 'multiple') {
    //   return new IntFlag({ ...options, type: 'multiple' }) as IMultiOptionFlag<number>
    // } else {
    //   return new IntFlag({ ...options, type: 'option' }) as IOptionFlag<number>
    // }
  },
  string: (options: IFlagOptions = {}) => {
    return new StringFlag(options.type, options)
    // if (options.type === 'multiple') {
    //   return new StringFlag({ ...options, type: 'multiple' }) as IMultiOptionFlag<string>
    // } else {
    //   return new StringFlag({ ...options, type: 'option' }) as IOptionFlag<string>
  },
}
