import { CLIFlagsError } from './base'
import { ArgToken } from '../parse'

export class UnexpectedArgsError extends CLIFlagsError {
  constructor(extras: ArgToken[]) {
    const msg = `Unexpected arg${extras.length === 1 ? '' : 's'}: ${extras.map(a => a.input).join(', ')}`
    super(msg)
  }
}
