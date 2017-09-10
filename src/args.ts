export interface IArgOptions {
  name: string
  description?: string
  required?: boolean
  optional?: boolean
  hidden?: boolean
}

export interface IArg {
  name: string
  description?: string
  required?: boolean
  optional?: boolean
  hidden?: boolean
}

export class Arg<T> {
  public name: string
  public description?: string
  public hidden: boolean
  public required: boolean

  constructor(options: IArgOptions) {
    this.name = options.name
    this.description = options.description
    this.hidden = !!options.hidden
    this.required = options.required || options.optional === false
  }
}

export const args = {
  string: (options: IArgOptions) => {
    return new Arg<string>(options)
  },
}
