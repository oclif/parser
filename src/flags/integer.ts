import { OptionFlag } from './option'

export class IntFlag extends OptionFlag<number> {
  public parse(input: string) {
    return parseInt(input, 10)
  }
}
