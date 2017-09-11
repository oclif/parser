import { Flag } from '../flags'
import { CLIFlagsError } from './base'

export class RequiredFlagError extends CLIFlagsError {
  constructor(flag: Flag<any>) {
    const msg = `Missing required flag --${flag.name}`
    super(msg)
  }
}
