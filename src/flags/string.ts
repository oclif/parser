import { OptionFlag, SingularOrMultiple } from './option'

class StringFlag extends OptionFlag<string> {
  public parse(input: string) {
    return input
  }
}

export const flag: SingularOrMultiple<string> = OptionFlag.singularOrMultiple(StringFlag)
