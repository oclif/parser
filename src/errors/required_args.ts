import { renderList } from 'cli-ux/lib/list'
import { IArg } from '../args'
import { CLIFlagsError } from './base'

export class RequiredArgsError extends CLIFlagsError {
  constructor(args: Array<IArg>) {
    let msg = `Missing ${args.length} required arg${args.length === 1 ? '' : 's'}`
    const namedArgs = args.filter(a => a.name)
    if (namedArgs.length) {
      const list = renderList(namedArgs.map(a => [a.name, a.description] as [string, string]))
      msg += `:\n${list}`
    }
    super(msg)
  }
}
