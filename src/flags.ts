export type AlphabetUppercase =
  | 'A'
  | 'B'
  | 'C'
  | 'D'
  | 'E'
  | 'F'
  | 'G'
  | 'H'
  | 'I'
  | 'J'
  | 'K'
  | 'L'
  | 'M'
  | 'N'
  | 'O'
  | 'P'
  | 'Q'
  | 'R'
  | 'S'
  | 'T'
  | 'U'
  | 'V'
  | 'X'
  | 'Y'
  | 'Z'
export type AlphabetLowercase =
  | 'a'
  | 'b'
  | 'c'
  | 'd'
  | 'e'
  | 'f'
  | 'g'
  | 'h'
  | 'i'
  | 'j'
  | 'k'
  | 'l'
  | 'm'
  | 'n'
  | 'o'
  | 'p'
  | 'q'
  | 'r'
  | 's'
  | 't'
  | 'u'
  | 'v'
  | 'x'
  | 'y'
  | 'z'

export interface IFlagOptions {
  char?: AlphabetLowercase | AlphabetUppercase
  description?: string
  hidden?: boolean
  required?: boolean
  optional?: boolean
}

export abstract class Flag {
  char?: AlphabetLowercase | AlphabetUppercase
  description?: string
  hidden: boolean
  required: boolean

  constructor(options: IFlagOptions) {
    this.char = options.char
    this.description = options.description
    this.hidden = !!options.hidden
    this.required = options.required || options.optional === false
  }
}

export class BooleanFlag extends Flag {}

export abstract class ValueFlag<T> extends Flag {
  parse(input: string): T {
    throw new Error('not implemented')
  }
}

export class StringFlag extends ValueFlag<string> {
  parse(input: string) {
    return input
  }
}

export const flags = {
  boolean: (options: IFlagOptions = {}) => {
    return new BooleanFlag(options)
  },
  string: (options: IFlagOptions = {}) => {
    return new StringFlag(options)
  },
}
