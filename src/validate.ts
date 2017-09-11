import { Arg } from './args'
import { RequiredArgsError } from './errors/required_args'
import { RequiredFlagError } from './errors/required_flag'
import { UnexpectedArgsError } from './errors/unexpected_args'
import { ValueFlag } from './flags'
import { IFlags, ParserInput, ParserOutput } from './parse'

function validateArgs<T extends IFlags>(expected: ParserInput<T>, input: Array<Arg<any>>) {
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

function validateFlags<T extends IFlags>(expected: ParserInput<T>, input: Array<ValueFlag<any>>) {
  const requiredFlags = Object.keys(expected.flags)
    .map(k => [k, expected.flags[k]] as [string, ValueFlag<any>])
    .filter(([, flag]) => flag.required)
  for (const [name, flag] of requiredFlags) {
    if (!!input.find(f => f.name === name)) {
      return
    }
    throw new RequiredFlagError(flag)
  }
}

export function validate <T extends IFlags> (expected: ParserInput<T>, input: ParserOutput<T>) {
  const args = input.raw.filter(a => a.type === 'arg') as Array<Arg<any>>
  const flags = input.raw.filter(a => a.type === 'value') as Array<ValueFlag<any>>
  validateArgs(expected, args)
  validateFlags(expected, flags)
}
