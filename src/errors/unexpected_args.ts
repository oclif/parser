import { IListItem, renderList } from '../cli'
import { IOutputArg } from '../parse'
import { CLIFlagsError } from './base'

export class UnexpectedArgsError extends Error {
  constructor(extras: IOutputArg[]) {
    const msg = `Unexpected arg${extras.length === 1 ? '' : 's'}: ${extras.map(a => a.input).join(', ')}`
    super(msg)
  }
}
