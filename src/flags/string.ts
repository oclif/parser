import { ValueFlag } from './value'
export class StringFlag extends ValueFlag<string> {
  public parse(input: string) {
    return input
  }
}
