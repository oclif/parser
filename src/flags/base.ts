import { AlphabetLowercase, AlphabetUppercase } from '../alphabet'

export interface IFlagOptions {
  char?: AlphabetLowercase | AlphabetUppercase
  description?: string
  hidden?: boolean
  required?: boolean
  optional?: boolean
}

export abstract class Flag<T> {
  public type: 'boolean' | 'value'
  public name: string
  public char?: AlphabetLowercase | AlphabetUppercase
  public description?: string
  public hidden: boolean
  public required: boolean
  public input?: string
  public value: T

  constructor(options: IFlagOptions) {
    this.char = options.char
    this.description = options.description
    this.hidden = !!options.hidden
    this.required = options.required || options.optional === false
  }
}
