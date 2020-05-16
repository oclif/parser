import {IArgsList} from './parse'

export type ParseFn<T> = (input: string) => T

export type NameOf<T> =
    T extends {name: string} ? T['name'] :
    T extends Arg<infer N, infer _> ? N :
    never;

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
export interface IArg<N extends string, T = string> {
  name: N;
  description?: string;
  required?: boolean;
  hidden?: boolean;
  parse?: ParseFn<T>;
  default?: T | (() => T);
  options?: string[];
}

export interface ArgBase<N extends string, T> {
  name?: N;
  description?: string;
  hidden?: boolean;
  parse: ParseFn<T>;
  default?: T | (() => T);
  input?: string;
  options?: string[];
}

export type RequiredArg<N extends string, T> = ArgBase<N, T> & {
  required: true;
  value: T;
}

export type OptionalArg<N extends string, T> = ArgBase<N, T> & {
  required: false;
  value?: T;
}

export type Arg<N extends string, T> = RequiredArg<N, T> | OptionalArg<N, T>

export function newArg<N extends string, T>(arg: IArg<N, T> & { Parse: ParseFn<T> }): Arg<NameOf<typeof arg>, T>
export function newArg<N extends string>(arg: IArg<N>): Arg<NameOf<typeof arg>, string>
export function newArg(arg: IArg<any, any>): Arg<NameOf<typeof arg>, any> {
  return {
    parse: (i: string) => i,
    ...arg,
    required: Boolean(arg.required),
  } as any
}

export type Input = IArgsList;
