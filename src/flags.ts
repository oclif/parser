import { AlphabetLowercase, AlphabetUppercase } from './alphabet'

export type DefaultContext<T> = { options: IOptionFlag<T>; flags: { [k: string]: string } }

export interface IFlagBase {
  name: string
  char?: AlphabetLowercase | AlphabetUppercase
  description?: string
  hidden?: boolean
  required?: boolean
}

export interface IBooleanFlag extends IFlagBase {
  type: 'boolean'
  allowNo: boolean
}

export interface IOptionFlagBase<T> extends IFlagBase {
  type: 'option'
  parse: (input: string) => T
}

export interface IOptionalFlag<T> extends IOptionFlagBase<T> {
  multiple: false
  default?: T | ((context: DefaultContext<T>) => T | undefined)
}

export interface IRequiredFlag<T> extends IOptionFlagBase<T> {
  required: true
  multiple: false
  default?: undefined
}

export interface IMultiOptionFlag<T> extends IOptionFlagBase<T> {
  multiple: true
  default?: undefined
}

export type IOptionFlag<T> = IOptionalFlag<T> | IRequiredFlag<T> | IMultiOptionFlag<T>

export type FlagBuilder<T> = {
  (options: Partial<IMultiOptionFlag<T>> & { multiple: true }): IMultiOptionFlag<T>
  (options: Partial<IRequiredFlag<T>> & { required: true }): IRequiredFlag<T>
  (options?: Partial<IOptionalFlag<T>>): IOptionalFlag<T>
}
function option<T = string>(defaults: Partial<IOptionFlag<T>> = {}): FlagBuilder<T> {
  return (options?: any): any => {
    options = options || {}
    return {
      parse: (i: string) => i,
      ...defaults,
      ...options,
      input: [],
      multiple: !!options.multiple,
      type: 'option',
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
    } as IBooleanFlag
  },
  integer: option<number>({
    parse: input => {
      if (!/^[0-9]+$/.test(input)) throw new Error(`Expected an integer but received: ${input}`)
      return parseInt(input, 10)
    },
  }),
  option,
  string: option<string>(),
}

export const defaultFlags = {
  color: flags.boolean({ allowNo: true }),
}
