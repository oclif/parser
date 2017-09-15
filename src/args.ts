export type ParseFn<T> = (input: string) => T
export interface IArg<T> {
  name: string
  description?: string
  required?: boolean
  hidden?: boolean
  parse?: (input: string) => T
  default?: T
}

export type Arg<T> = {
  name?: string
  description?: string
  required?: boolean
  optional?: boolean
  hidden?: boolean
  value: T
  parse: ParseFn<T>
  default?: T
}

export function newArg<T>(arg: IArg<T> & { Parse: ParseFn<T> }): Arg<T>
export function newArg<T>(arg: IArg<T>): Arg<string>
export function newArg<T>(arg: IArg<T>): any {
  return {
    parse: (i: string) => i,
    ...arg,
  }
}
