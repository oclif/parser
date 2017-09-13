import { Flag, IFlagOptions } from './base'

export interface IOptionFlagOptions<T> extends IFlagOptions {
  multiple?: boolean
  default?: T
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
export type Multiple<T> = (options: IOptionFlagOptions<T> & { multiple: true }) => IMultiOptionFlag<T>
export type SingularOrMultiple<T> = Singular<T> & Multiple<T>

export abstract class OptionFlag<T> extends Flag {
  public static singularOrMultiple<T>(flag: OptionFlagClass<T>): SingularOrMultiple<T> {
    return (options?: any): any => {
      options = options || {}
      return options.multiple ? OptionFlag.multiple(flag)(options) : OptionFlag.singular(flag)(options)
    }
  }

  public static singular<T>(flag: OptionFlagClass<T>): Singular<T> {
    return (options?: IFlagOptions): IOptionFlag<T> => {
      const klass = class extends flag implements IOptionFlag<T> {
        public readonly type: 'option' = 'option'
        public get value(): T {
          if (this.options.default) return this.options.default
          return this.parse(this.input[0])
        }
      }
      return new klass(options || {})
    }
  }
  public static multiple<T>(flag: OptionFlagClass<T>): Multiple<T> {
    return (options?: IFlagOptions): IMultiOptionFlag<T> => {
      const klass = class extends flag implements IMultiOptionFlag<T> {
        public readonly type: 'multi' = 'multi'
        public get value(): T[] {
          return this.input.map(i => this.parse(i))
        }
      }
      return new klass(options || {})
    }
  }
  public input: string[] = []
  public readonly type: 'option' | 'multi'
  constructor(readonly options: IOptionFlagOptions<T> = {}) {
    super(options)
  }
  public abstract parse(input: string): T
}
