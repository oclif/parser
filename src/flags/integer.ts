import { OptionFlag } from './option'

export class IntFlag extends OptionFlag<number> {
  public parse(input: string) {
    if (!/^[0-9]+$/.test(input)) throw new Error(`Expected an integer but received: ${input}`)
    return parseInt(input, 10)
  }
}
