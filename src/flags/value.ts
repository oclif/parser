import { Flag } from './base'

export abstract class ValueFlag<T> extends Flag {
  public abstract parse(input: string): T
}
