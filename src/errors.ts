import { renderList } from 'cli-ux/lib/list'
import { Arg } from './args'
import { IFlag } from './flags'
import { flagUsages } from './help'
import { ParserInput, ParserOutput } from './parse'
import { InputFlags } from '.'

export interface ICLIParseErrorOptions<T extends InputFlags> {
  parse: {
    input: ParserInput
    output: ParserOutput<T>
  }
}

export class CLIParseError<T extends InputFlags> extends Error {
  public parse: ICLIParseErrorOptions<T>['parse']

  constructor(options: ICLIParseErrorOptions<T> & { message: string }) {
    options.message += `\nSee more help with --help`
    super(options.message)
    this.parse = options.parse
  }
}

export class RequiredArgsError<T extends InputFlags> extends CLIParseError<T> {
  public args: Arg<any>[]

  constructor({ args, parse }: ICLIParseErrorOptions<T> & { args: Arg<any>[] }) {
    let message = `Missing ${args.length} required arg${args.length === 1 ? '' : 's'}`
    const namedArgs = args.filter(a => a.name)
    if (namedArgs.length) {
      const list = renderList(namedArgs.map(a => [a.name, a.description] as [string, string]))
      message += `:\n${list}`
    }
    super({ parse, message })
    this.args = args
  }
}

export class RequiredFlagError<T extends InputFlags> extends CLIParseError<T> {
  public flags: IFlag<any>[]

  constructor({ flags, parse }: ICLIParseErrorOptions<T> & { flags: IFlag<T>[] }) {
    const usage = renderList(flagUsages(flags, { displayRequired: false }))
    const message = `Missing required flag${flags.length === 1 ? '' : 's'}:\n${usage}`
    super({ parse, message })
    this.flags = flags
  }
}

export class UnexpectedArgsError<T extends InputFlags> extends CLIParseError<T> {
  public args: string[]

  constructor({ parse, args }: ICLIParseErrorOptions<T> & { args: string[] }) {
    const message = `Unexpected argument${args.length === 1 ? '' : 's'}: ${args.join(', ')}`
    super({ parse, message })
    this.args = args
  }
}
