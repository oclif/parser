import { Flag } from '../flags'
import { CLIFlagsError } from './base'

export class RequiredFlagError<T> extends CLIFlagsError {
  constructor(flag: Flag<T>) {
    const msg = `Missing required flag --${flag.name}`
    super(msg)
  }
}
