import {inspect} from 'util'
import { ValueFlag } from './value'

export class IntegerFlag extends ValueFlag<number> {
  public parse(input: string): number {
    const isInt = /^\+?\d+$/.test(input)
    if (!isInt) {throw new Error(`expected integer but received: ${inspect(input)}`)}

    return parseInt(input, 10)
  }
}
