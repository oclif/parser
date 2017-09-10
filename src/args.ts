export interface IArgOptions {
  name?: string
  description?: string
  required?: boolean
  optional?: boolean
  hidden?: boolean
}

export class Arg<T> {
  name?: string
  description?: string
  hidden: boolean
  required: boolean

  constructor(options: IArgOptions) {
    this.name = options.name
    this.description = options.description
    this.hidden = !!options.hidden
    this.required = options.required || options.optional === false
  }
}

export const args = {
  string: (options: IArgOptions = {}) => {
    return new Arg<string>(options)
  },
}
