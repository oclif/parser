// tslint:disable interface-over-type-literal

import * as args from './args'
import {OutputArgs, OutputFlags, ParserOutput} from './parse'
export {args}
import * as flags from './flags'
export {flags}
export {flagUsages} from './help'
import {deps} from './deps'

export type ParserInput<TFlags extends flags.Output> = {
  flags?: flags.Input<TFlags>
  args?: args.Input
  argv?: string[]
  strict?: boolean
}

export function parse<TFlags, TArgs>(options: ParserInput<TFlags>): ParserOutput<TFlags, TArgs> {
  const input = {
    args: (options.args || []).map((a: any) => deps.args.newArg(a as any)),
    argv: options.argv || process.argv.slice(2),
    flags: {
      color: deps.flags.defaultFlags.color,
      ...((options.flags || {})) as any,
    },
    strict: options.strict !== false,
  }
  const parser = new deps.parse.Parser(input)
  const output = parser.parse()
  deps.validate.validate({input, output})
  return output as any
}

export {OutputFlags, OutputArgs, ParserOutput}
