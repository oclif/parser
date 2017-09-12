import { IFlagOptions } from './base'
import { BooleanFlag, IBooleanFlag } from './boolean'
import { IntFlag } from './integer'
import { IMultiOptionFlag, IMultiOptionFlagOptions, IOptionFlag, IValueFlagOptions } from './option'
import { StringFlag } from './string'

export type IFlag<T> = IBooleanFlag | IOptionFlag<T> | IMultiOptionFlag<T>
export { IBooleanFlag, IOptionFlag, IMultiOptionFlag }

function buildint(options: IMultiOptionFlagOptions): IMultiOptionFlag<string>
function buildint(options: IValueFlagOptions): IOptionFlag<string>
function buildint(options: IValueFlagOptions): any {
  return new IntFlag(options)
}

function buildstring(options: IMultiOptionFlagOptions): IMultiOptionFlag<string>
function buildstring(options: IValueFlagOptions): IOptionFlag<string>
function buildstring(options: IValueFlagOptions): any {
  return new StringFlag(options)
}

export const flags = {
  boolean: (options: IFlagOptions = {}) => {
    return new BooleanFlag(options)
  },
  integer: (options: IValueFlagOptions = {}) => {
    return buildint(options)
  },
  string: (options: IValueFlagOptions = {}) => {
    return buildstring(options)
  },
}
