export type ArgParseContext<T = string> = { arg: Arg<T> } & { [k: string]: any }
export type ParseFn<T> = (input: string, parseContext: ArgParseContext<T>) => T

export interface IArg<T = string> {
  name: string
  description?: string
  required?: boolean
  hidden?: boolean
  parse?: ParseFn<T>
  default?: T | (() => T)
}

export type ArgBase<T> = {
  name?: string
  description?: string
  hidden?: boolean
  parse: ParseFn<T>
  default?: T | (() => T)
}

export type RequiredArg<T> = ArgBase<T> & {
  required: true
  value: T
}

export type OptionalArg<T> = ArgBase<T> & {
  required: false
  value?: T
}

export type Arg<T> = RequiredArg<T> | OptionalArg<T>

export function newArg<T>(arg: IArg<T> & { Parse: ParseFn<T> }): Arg<T>
export function newArg<T = string>(arg: IArg<string>): Arg<string>
export function newArg(arg: IArg<any>): any {
  return {
    parse: (i: string) => i,
    ...arg,
    required: !!arg.required,
  }
}
