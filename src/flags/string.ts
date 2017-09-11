import { OptionFlag } from './option'

export class StringFlag extends OptionFlag<string> {
  public parse(input: string) {
    return input
  }
}
