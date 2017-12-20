export { ParserOutput, OutputArgs, OutputFlags } from './parse'
import * as args from './args'
export { args }
import * as flags from './flags'
export { flags }
export { flagUsages } from './help'
import { ParserOutput } from './parse'
import { deps } from './deps'

export type ParserInput = {
  argv?: string[]
  flags?: flags.Input
  args?: args.Input
  strict?: boolean
}

export function parse(options: ParserInput): ParserOutput {
  const input = {
    args: (options.args || []).map(a => deps.args.newArg(a)),
    argv: options.argv || process.argv.slice(2),
    flags: {
      color: deps.flags.defaultFlags.color,
      ...((options.flags || {}) as flags.Input),
    },
    strict: options.strict !== false,
  }
  const parser = new deps.parse.Parser(input)
  const output = parser.parse()
  deps.validate.validate({ input, output })
  return output
}
