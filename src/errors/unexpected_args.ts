import { Arg } from '../args'
import { CLIFlagsError } from './base'

export class UnexpectedArgsError extends CLIFlagsError {
  constructor(extras: Array<Arg<any>>) {
    const msg = `Unexpected arg${extras.length === 1 ? '' : 's'}: ${extras.map(a => a.input).join(', ')}`
    super(msg)
  }
}
