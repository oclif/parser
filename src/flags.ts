import {AlphabetLowercase, AlphabetUppercase} from './alphabet'

export interface DefaultContext<T> { options: IOptionFlag<T>; flags: { [k: string]: string } }

export interface IFlagBase<T, I> {
  name: string
  char?: AlphabetLowercase | AlphabetUppercase
  description?: string
  hidden?: boolean
  required?: boolean
  parse(input: I): T
}

export interface IBooleanFlag<T> extends IFlagBase<T, boolean> {
  type: 'boolean'
  allowNo: boolean
}

export interface IOptionFlag<T> extends IFlagBase<T, string> {
  type: 'option'
  default?: T | ((context: DefaultContext<T>) => T | undefined)
  multiple: boolean
  input: string[]
}

export interface Definition<T> {
  (options: {multiple: true} & Partial<IOptionFlag<T>>): IOptionFlag<T[]>
  (options: {required: true} & Partial<IOptionFlag<T>>): IOptionFlag<T>
  (options?: Partial<IOptionFlag<T>>): IOptionFlag<T | undefined>
}

export function build<T>(defaults: {parse: IOptionFlag<T>['parse']} & Partial<IOptionFlag<T>>): Definition<T>
export function build(defaults: Partial<IOptionFlag<string>>): Definition<string>
export function build<T>(defaults: Partial<IOptionFlag<T>>): Definition<T> {
  return (options: any = {}): any => {
    return {
      parse: (i: string) => i,
      ...defaults,
      ...options,
      input: [] as string[],
      multiple: !!options.multiple,
      type: 'option',
    } as any
  }
}

export type IFlag<T> = IBooleanFlag<T> | IOptionFlag<T>

export function boolean<T = boolean>(options: Partial<IBooleanFlag<T>> = {}): IBooleanFlag<T> {
  return {
    parse: b => b,
    ...options,
    allowNo: !!options.allowNo,
    type: 'boolean',
  } as IBooleanFlag<T>
}

export const integer = build({
  parse: input => {
    if (!/^[0-9]+$/.test(input)) throw new Error(`Expected an integer but received: ${input}`)
    return parseInt(input, 10)
  },
})

export interface EnumFlagOptions<T> extends Partial<IOptionFlag<T>> {
  options: string[]
}

const _enum = <T = string>(opts: EnumFlagOptions<T>) => build<T>({
  parse(input) {
    if (!opts.options.includes(input)) throw new Error(`Expected --${this.name}=${input} to be one of: ${opts.options.join(', ')}`)
    return input
  },
  ...opts as any,
})
export {_enum as enum}

export function option<T>(options: {parse: IOptionFlag<T>['parse']} & Partial<IOptionFlag<T>>) {
  return build<T>(options)()
}

const stringFlag = build({})
export {stringFlag as string}

export const defaultFlags = {
  color: boolean({allowNo: true}),
}

export interface Output {[name: string]: any}
export type Input<T extends Output> = { [P in keyof T]: IFlag<T[P]> }
