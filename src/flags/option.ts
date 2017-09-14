import { Flag, IFlagOptions } from './base'

export interface IOptionFlagOptions<T> extends IFlagOptions {
  multiple?: boolean
  default?: T
  parse?: (input: string, options: { [k: string]: any }) => T
}

export interface IOptionFlagBase<T> extends Flag {
  input: string[]
  options: IOptionFlagOptions<T>
}

export interface IOptionFlag<T> extends IOptionFlagBase<T> {
  type: 'option'
  readonly value: T
}

export interface IMultiOptionFlag<T> extends IOptionFlagBase<T> {
  type: 'multi'
  readonly value: T[]
}

export interface IOptionFlagConcreteClass<T> extends OptionFlag<T> {
  parse(input: string): T
}
export type OptionFlagClass<T> = {
  new (options: IFlagOptions): IOptionFlagConcreteClass<T>
}

export type Singular<T> = (options?: IOptionFlagOptions<T> & { multiple?: false }) => IOptionFlag<T>
export type multiple<T> = (options: IOptionFlagOptions<T> & { multiple: true }) => IMultiOptionFlag<T>
export type Multiple<T> = Singular<T> & multiple<T>

export abstract class OptionFlag<T> extends Flag {
  public static singular<T>(flag: OptionFlagClass<T>): Singular<T> {
    return (options?: IOptionFlagOptions<T>): IOptionFlag<T> => {
      const klass = class extends flag implements IOptionFlag<T> {
        public readonly type: 'option' = 'option'
        public get value(): T {
          const input = this.input[0]
          if (!input && this.options.default) return this.options.default
          if (this.options.parse) return this.options.parse(input, {})
          return this.parse(input)
        }
      }
      return new klass(options || {})
    }
  }
  public static multiple<T>(flag: OptionFlagClass<T>): Multiple<T> {
    return (options?: IOptionFlagOptions<T>): any => {
      options = options || {}
      if (options.multiple) {
        const klass = class extends flag implements IMultiOptionFlag<T> {
          public readonly type: 'multi' = 'multi'
          public get value(): T[] {
            return this.input.map(i => this.parse(i))
          }
        }
        return new klass(options || {})
      } else {
        return OptionFlag.singular(flag)(options as any)
      }
    }
  }
  public input: string[] = []
  public readonly type: 'option' | 'multi'
  constructor(readonly options: IOptionFlagOptions<T> = {}) {
    super(options)
  }
  public abstract parse(input: string): T
}
