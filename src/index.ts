export { IArg } from './args'
export { ParserOutput, OutputArgs, OutputFlags, DefaultFlags } from './parse'
export {
  flags,
  IFlag,
  IBooleanFlag,
  IRequiredFlag,
  IOptionalFlag,
  IOptionFlag,
  IMultiOptionFlag,
  FlagBuilder,
} from './flags'
export { flagUsages } from './help'

import { IArg } from './args'
import { IFlag } from './flags'
import { ParserOutput } from './parse'

export type InputArgs = IArg<any>[]
export type InputFlags = { [name: string]: IFlag<any> }

import { deps } from './deps'

export type ParserInput<T extends InputFlags | undefined> = {
  argv?: string[]
  flags?: T
  args?: InputArgs
  strict?: boolean
  parseContext?: { [k: string]: any }
}

export function parse<T extends InputFlags | undefined>(options: ParserInput<T>): ParserOutput<T> {
  const input = {
    args: (options.args || []).map(a => deps.args.newArg(a)),
    argv: options.argv || process.argv.slice(2),
    flags: {
      color: deps.flags.defaultFlags.color,
      ...((options.flags || {}) as InputFlags),
    },
    parseContext: options.parseContext || {},
    strict: options.strict !== false,
  }
  const parser = new deps.parse.Parser(input)
  const output = parser.parse()
  deps.validate.validate({ input, output })
  return output
}
