import { Arg } from '../args'
import { IListItem, renderList } from '../cli'
import { CLIFlagsError } from './base'

export class RequiredArgsError extends Error {
  constructor(args: Array<Arg<any>>) {
    let msg = `Missing ${args.length} required arg${args.length === 1 ? '' : 's'}`
    const namedArgs = args.filter(a => a.name)
    if (namedArgs.length) {
      const list = renderList(namedArgs.map(a => [a.name, a.description] as IListItem))
      msg += `:\n${list}`
    }
    super(msg)
  }
}
