import { InputArgs } from './parse'
import { Flag, ValueFlag } from './flags'
import { Arg } from './args'
import { stdtermwidth } from './screen'

class ParseError extends Error {}
class RequiredArgsParseError extends Error {
  constructor(args: Arg<any>[]) {
    let msg = `Missing ${args.length} required arg${args.length === 1 ? '' : 's'}`
    let namedArgs = args.filter(a => a.name)
    if (namedArgs.length) {
      msg += `:\n${namedArgs.map(a => a.name).join('\n')}`
    }
    super(msg)
  }
}

function validateArgs(expected: InputArgs, input: OutputArg[]) {
  let maxArgs = expected.length
  if (input.length > maxArgs) {
    throw new Error('whoa')
  }
  let requiredArgs = expected.filter(a => a.required)
  let missingRequiredArgs = requiredArgs.slice(input.length)
  if (missingRequiredArgs.length) {
    throw new RequiredArgsParseError(missingRequiredArgs)
  }
}

export function validate(expectedArgs: InputArgs, input: OutputArray) {
  let args: OutputArg[] = input.filter(a => a.type === 'arg') as any
  validateArgs(expectedArgs, args)
}
