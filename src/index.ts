// tslint:disable interface-over-type-literal

import * as args from './args'
import Deps from './deps'
import * as flags from './flags'
import {
  OutputArgs,
  OutputFlags,
  Parser,
  ParserRawInput as Input,
  ParserOutput as Output,
} from './parse'
import * as Validate from './validate'
export {args}
export {flags}
export {flagUsages} from './help'

// eslint-disable-next-line new-cap
const m = Deps()
// eslint-disable-next-line node/no-missing-require
.add('validate', () => require('./validate').validate as typeof Validate.validate)

export type FlagsOf<T extends Input<any>['flags'] | undefined> =
    T extends undefined ? undefined :
    T extends Input<infer TFlags> ? OutputFlags<TFlags> :
    never;

export function parse<TInput extends Input<any>>(argv: string[], options: TInput): Output<TInput> {
  const input = {
    argv,
    context: options.context,
    args: (options.args || []).map(a => args.newArg(a)),
    '--': options['--'],
    flags: {
      color: flags.defaultFlags.color,
      ...((options.flags || {})) as any,
    },
    strict: options.strict !== false,
  }
  const parser = new Parser(input)
  const output = parser.parse()
  m.validate({input, output})
  return output as any
}

export {OutputFlags, OutputArgs, Output}
