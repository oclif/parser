import { Flag, IFlagOptions } from './base'

export class BooleanFlag extends Flag<boolean> {
  public readonly type: 'boolean' = 'boolean'
  public input: string[] = []
  constructor(options: IFlagOptions = {}) {
    super(options)
  }
  public get value() {
    return this.input.length > 0
  }
}
