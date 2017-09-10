import { RequiredArgsError } from './errors/required_args'
import { RequiredFlagError } from './errors/required_flag'
import { UnexpectedArgsError } from './errors/unexpected_args'
import { Flag, ValueFlag } from './flags'
import { InputOptions, IOutputArg, IOutputFlag, OutputArray } from './parse'

function validateArgs(expected: InputOptions, input: IOutputArg[]) {
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

function validateFlags(expected: InputOptions, input: IOutputFlag[]) {
  const requiredFlags = Object.keys(expected.flags)
    .map(k => [k, expected.flags[k]] as [string, Flag])
    .filter(([name, flag]) => flag.required)
  for (const [name, flag] of requiredFlags) {
    if (!!input.find(f => f.flag.name === name)) {
      return
    }
    throw new RequiredFlagError(flag)
  }
}

export function validate(expected: InputOptions, input: OutputArray) {
  const args = input.filter(a => a.type === 'arg') as IOutputArg[]
  const flags = input.filter(a => a.type === 'flag') as IOutputFlag[]
  validateArgs(expected, args)
  validateFlags(expected, flags)
}
