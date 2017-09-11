import { Flag } from './base'

export abstract class MultipleValueFlag<T> extends Flag <T[]> {
  public type: 'multiple' = 'multiple'
}
