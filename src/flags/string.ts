import {Flag, IFlagOptions} from './base'
import { MultipleValueFlag, ValueFlag } from './value'

export class StringFlag extends ValueFlag<string> {
  get value() { return this.inputs[0] }
}
export class MultipleStringFlag extends MultipleValueFlag<string> {
  get value() { return this.inputs }
}

export function string (options: IFlagOptions & {multiple: true}): Flag<string[]>
export function string (options: IFlagOptions): Flag<string>
export function string (options: IFlagOptions): any {
  if (options.multiple) {
    return new StringFlag(options)
  } else {
    return new MultipleStringFlag(options)
  }
}
