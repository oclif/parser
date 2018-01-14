import {AlphabetLowercase, AlphabetUppercase} from './alphabet'

export interface DefaultContext<T> { options: IOptionFlag<T>; flags: { [k: string]: string } }

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

export interface IOptionFlag<T = string> extends IFlagBase {
  type: 'option'
  default?: T | ((context: DefaultContext<T>) => T | undefined)
  multiple: boolean
  parse(input: string): T
}

export type Definition<T> = (options?: Partial<IOptionFlag<T>>) => IOptionFlag<T>

export function option<T = string>(defaults: Partial<IOptionFlag<T>> = {}): Definition<T> {
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

export function boolean(options: Partial<IBooleanFlag> = {}): IBooleanFlag {
  return {
    ...options,
    allowNo: !!options.allowNo,
    type: 'boolean',
  } as IBooleanFlag
}

export const integer = option<number>({
  parse: input => {
    if (!/^[0-9]+$/.test(input)) throw new Error(`Expected an integer but received: ${input}`)
    return parseInt(input, 10)
  },
})

const stringFlag = option()
export {stringFlag as string}

export const defaultFlags = {
  color: boolean({allowNo: true}),
}

export interface Input { [name: string]: IFlag<any> }
