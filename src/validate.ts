import { IArg } from './args'
import { RequiredArgsError } from './errors/required_args'
import { RequiredFlagError } from './errors/required_flag'
import { UnexpectedArgsError } from './errors/unexpected_args'
import { OptionFlag } from './flags'
import { InputFlags, ParserInput, ParserOutput } from './parse'

function validateArgs<T extends InputFlags>(expected: ParserInput<T>, input: Array<IArg>) {
  const maxArgs = expected.args.length
  if (expected.strict && input.length > maxArgs) {
    const extras = input.slice(maxArgs)
    throw new UnexpectedArgsError(extras)
  }
  const requiredArgs = expected.args.filter(a => a.required)
  const missingRequiredArgs = requiredArgs.slice(input.length)
  if (missingRequiredArgs.length) {
    throw new RequiredArgsError(missingRequiredArgs)
  }
}

function validateFlags<T extends InputFlags>(expected: ParserInput<T>) {
  const requiredFlags = Object.keys(expected.flags)
    .map(k => [k, expected.flags[k]] as [string, OptionFlag<any>])
    .filter(([, flag]) => flag.required)
  for (const [, flag] of requiredFlags) {
    if (flag.value === undefined) {
      throw new RequiredFlagError(flag)
    }
  }
}

export function validate<T extends InputFlags>(expected: ParserInput<T>, input: ParserOutput<T>) {
  const args = input.raw.filter(a => a.type === 'arg') as IArg[]
  validateArgs(expected, args)
  validateFlags(expected)
}
