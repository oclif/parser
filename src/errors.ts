import {Arg} from './args'
import {deps} from './deps'
import * as flags from './flags'
import {flagUsages} from './help'
import {ParserInput, ParserOutput} from './parse'

export interface ICLIParseErrorOptions {
  parse: {
    input?: ParserInput
    output?: ParserOutput<any, any>
  }
}

export class CLIParseError extends Error {
  public parse: ICLIParseErrorOptions['parse']

  constructor(options: ICLIParseErrorOptions & { message: string }) {
    options.message += '\nSee more help with --help'
    super(options.message)
    this.parse = options.parse
  }
}

export class RequiredArgsError extends CLIParseError {
  public args: Arg<any>[]

  constructor({args, parse}: ICLIParseErrorOptions & { args: Arg<any>[] }) {
    let message = `Missing ${args.length} required arg${args.length === 1 ? '' : 's'}`
    const namedArgs = args.filter(a => a.name)
    if (namedArgs.length) {
      const list = deps.renderList(namedArgs.map(a => [a.name, a.description] as [string, string]))
      message += `:\n${list}`
    }
    super({parse, message})
    this.args = args
  }
}

export class RequiredFlagError extends CLIParseError {
  public flags: flags.IFlag<any>[]

  constructor({flags, parse}: ICLIParseErrorOptions & { flags: flags.IFlag<any>[] }) {
    const usage = deps.renderList(flagUsages(flags, {displayRequired: false}))
    const message = `Missing required flag${flags.length === 1 ? '' : 's'}:\n${usage}`
    super({parse, message})
    this.flags = flags
  }
}

export class UnexpectedArgsError extends CLIParseError {
  public args: string[]

  constructor({parse, args}: ICLIParseErrorOptions & { args: string[] }) {
    const message = `Unexpected argument${args.length === 1 ? '' : 's'}: ${args.join(', ')}`
    super({parse, message})
    this.args = args
  }
}

export class FlagInvalidOptionError extends CLIParseError {
  constructor(flag: flags.IOptionFlag<any>, input: string) {
    const message = `Expected --${flag.name}=${input} to be one of: ${flag.options!.join(', ')}`
    super({parse: {}, message})
  }
}

export class ArgInvalidOptionError extends CLIParseError {
  constructor(arg: Arg<any>, input: string) {
    const message = `Expected ${input} to be one of: ${arg.options!.join(', ')}`
    super({parse: {}, message})
  }
}
