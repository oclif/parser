import { Arg } from './args'
import { RequiredArgsError } from './errors/required_args'
import { RequiredFlagError } from './errors/required_flag'
import { Flag, ValueFlag } from './flags'
import { InputArgs, InputFlags, IOutputArg, IOutputFlag, OutputArray } from './parse'

function validateArgs(expected: InputArgs, input: IOutputArg[]) {
  const maxArgs = expected.length
  if (input.length > maxArgs) {
    throw new Error('whoa')
  }
  const requiredArgs = expected.filter(a => a.required)
  const missingRequiredArgs = requiredArgs.slice(input.length)
  if (missingRequiredArgs.length) {
    throw new RequiredArgsError(missingRequiredArgs)
  }
}

function validateFlags(expected: InputFlags, input: IOutputFlag[]) {
  const requiredFlags = Object.keys(expected)
    .map(k => [k, expected[k]] as [string, Flag])
    .filter(([name, flag]) => flag.required)
  for (const [name, flag] of requiredFlags) {
    if (!!input.find(f => f.flag.name === name)) {
      return
    }
    throw new RequiredFlagError(flag)
  }
}

export function validate(expectedArgs: InputArgs, expectedFlags: InputFlags, input: OutputArray) {
  const args = input.filter(a => a.type === 'arg') as IOutputArg[]
  const flags = input.filter(a => a.type === 'flag') as IOutputFlag[]
  validateArgs(expectedArgs, args)
  validateFlags(expectedFlags, flags)
}
