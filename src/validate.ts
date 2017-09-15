import { RequiredArgsError } from './errors/required_args'
import { RequiredFlagError } from './errors/required_flag'
import { UnexpectedArgsError } from './errors/unexpected_args'
import { IFlag } from './flags'
import { InputFlags, parserInput, ParserOutput, ArgToken } from './parse'

function validateArgs(expected: parserInput, input: ArgToken[]) {
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

function validateFlags(expected: parserInput) {
  const requiredFlags = Object.keys(expected.flags)
    .map(k => [k, expected.flags[k]] as [string, IFlag<any>])
    .filter(([, flag]) => flag.required)
  for (const [, flag] of requiredFlags) {
    if (flag.value === undefined) {
      throw new RequiredFlagError(flag)
    }
  }
}

export function validate<T extends InputFlags>(expected: parserInput, input: ParserOutput<T>) {
  const args = input.raw.filter(a => a.type === 'arg') as ArgToken[]
  validateArgs(expected, args)
  validateFlags(expected)
}
