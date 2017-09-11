import { Flag } from '../flags'
import { CLIFlagsError } from './base'

export class RequiredFlagError extends Error {
  constructor(flag: Flag) {
    const msg = `Missing required flag --${flag.name}`
    super(msg)
  }
}
