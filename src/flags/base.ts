import { AlphabetLowercase, AlphabetUppercase } from '../alphabet'
import { ParsingToken } from '../parse'

export type FlagTypes = 'boolean' | 'option' | 'multiple'

export interface IFlagBase<T> {
  name?: string
  description?: string
  value: T | T[] | undefined
  handleInput(argv: string[]): ParsingToken | undefined
}

export interface IFlagOptions {
  type?: FlagTypes
  char?: AlphabetLowercase | AlphabetUppercase
  description?: string
  hidden?: boolean
  required?: boolean
  optional?: boolean
  multiple?: boolean
}

export abstract class Flag<T> implements IFlagBase<T> {
  public name?: string
  public char?: AlphabetLowercase | AlphabetUppercase
  public description?: string
  public hidden: boolean
  public required: boolean
  public inputs: string[] = []

  constructor(options: IFlagOptions) {
    this.char = options.char
    this.description = options.description
    this.hidden = !!options.hidden
    this.required = options.required || options.optional === false
  }

  public abstract get value(): T | T[] | undefined
  public abstract handleInput(argv: string[]): ParsingToken | undefined
}
