import { AlphabetLowercase, AlphabetUppercase } from '../alphabet'

export interface IFlagOptions {
  char?: AlphabetLowercase | AlphabetUppercase
  description?: string
  hidden?: boolean
  required?: boolean
  optional?: boolean
  multiple?: boolean
}

export abstract class Flag <T> {
  public type: 'boolean' | 'value' | 'multiple'
  public name: string
  public char?: AlphabetLowercase | AlphabetUppercase
  public description?: string
  public hidden: boolean
  public required: boolean
  public inputs: string[] = []
  public abstract get value(): T

  constructor(options: IFlagOptions) {
    this.char = options.char
    this.description = options.description
    this.hidden = !!options.hidden
    this.required = options.required || options.optional === false
  }
}
