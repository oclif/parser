// tslint:disable interface-over-type-literal

import * as args from './args'
import {OutputArgs, OutputFlags, Parser, ParserOutput as Output} from './parse'
export {args}
import * as flags from './flags'
import {validate} from './validate'
export {flags}
export {flagUsages} from './help'

export type Input<TFlags extends flags.Output> = {
  flags?: flags.Input<TFlags>
  args?: args.Input
  strict?: boolean
  context?: any
  '--'?: boolean
}

export function parse<TFlags, TArgs extends {[name: string]: string}>(argv: string[], options: Input<TFlags>): Output<TFlags, TArgs> {
  const input = {
    argv,
    context: options.context,
    args: (options.args || []).map((a: any) => args.newArg(a as any)),
    '--': options['--'],
    flags: {
      color: flags.defaultFlags.color,
      ...((options.flags || {})) as any,
    },
    strict: options.strict !== false,
  }
  const parser = new Parser(input)
  const output = parser.parse()
  validate({input, output})
  return output as any
}

export {OutputFlags, OutputArgs, Output}
