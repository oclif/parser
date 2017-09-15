import { AlphabetLowercase, AlphabetUppercase } from './alphabet'

export interface IFlagBase {
  name?: string
  char?: AlphabetLowercase | AlphabetUppercase
  description?: string
  hidden?: boolean
  required?: boolean
}

export interface IBooleanFlag extends IFlagBase {
  type: 'boolean'
  allowNo: boolean
  value: boolean
}

export type ParseFn<T> = (input: string, options: { [k: string]: any }) => T

export interface IOptionFlagBase<T> extends IFlagBase {
  type: 'option'
  parse: ParseFn<T>
  multiple: boolean
}

export interface ISingleOptionFlag<T> extends IOptionFlagBase<T> {
  multiple: false
  default?: T
  value: T
}

export interface IMultiOptionFlag<T> extends IOptionFlagBase<T> {
  multiple: true
  default?: undefined
  value: T[]
}

export type IOptionFlag<T> = ISingleOptionFlag<T> | IMultiOptionFlag<T>

export type FlagBuilder<T> = {
  (options: Partial<IMultiOptionFlag<T>>): IMultiOptionFlag<T>
  (options?: Partial<ISingleOptionFlag<T>>): ISingleOptionFlag<T>
}
export function option<T>(defaults: (Partial<IOptionFlag<T>>) & { parse: ParseFn<T> }): FlagBuilder<T> {
  return (options?: any): any => {
    options = options || {}
    return {
      ...defaults,
      ...options,
      multiple: !!options.multiple,
      type: 'option',
      value: options.multiple ? [] : undefined,
    }
  }
}

export type IFlag<T> = IBooleanFlag | IOptionFlag<T>

export const flags = {
  boolean: (options: Partial<IBooleanFlag> = {}): IBooleanFlag => {
    return {
      ...options,
      allowNo: !!options.allowNo,
      type: 'boolean',
      value: false,
    }
  },
  integer: option<number>({
    parse: input => {
      if (!/^[0-9]+$/.test(input)) throw new Error(`Expected an integer but received: ${input}`)
      return parseInt(input, 10)
    },
  }),
  option,
  string: option<string>({ parse: input => input }),
}

export const defaultFlags = {
  color: flags.boolean({ allowNo: true }),
}
