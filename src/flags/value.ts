import { Flag, IFlagOptions } from './base'

export abstract class ValueFlag<T> extends Flag <T> {
  public static multiple <T> (options: IFlagOptions) {
    class MultipleValueFlag extends this <T[]> {
      public parse (input: string) { super.parse(input) }
      public get value(): T[] { super.value }
    }
    return new MultipleValueFlag(options)
  }

  public type: 'value' = 'value'
  public abstract get value(): T
}
