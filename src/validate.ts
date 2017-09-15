import { RequiredArgsError } from './errors/required_args'
import { RequiredFlagError } from './errors/required_flag'
import { UnexpectedArgsError } from './errors/unexpected_args'
import { parserInput, ParserOutput, ArgToken } from './parse'

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
  for (const flag of Object.values(expected.flags)) {
    if (flag.required && flag.value === undefined) {
      throw new RequiredFlagError(flag)
    }
  }
}

export function validate(expected: parserInput, input: ParserOutput<any>) {
  const args = input.raw.filter(a => a.type === 'arg') as ArgToken[]
  validateArgs(expected, args)
  validateFlags(expected)
}
