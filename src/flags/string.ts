import { Multiple, OptionFlag } from './option'

class StringFlag extends OptionFlag<string> {
  public parse(input: string) {
    return input
  }
}

export const flag: Multiple<string> = OptionFlag.multiple(StringFlag)
