import {RequiredArgsError, RequiredFlagError, UnexpectedArgsError} from './errors'
import {ParserInput, ParserOutput} from './parse'

export function validate(parse: { input: ParserInput; output: ParserOutput<any, any> }) {
  function validateArgs() {
    const maxArgs = parse.input.args.length
    if (parse.input.strict && parse.output.argv.length > maxArgs) {
      const extras = parse.output.argv.slice(maxArgs)
      throw new UnexpectedArgsError({parse, args: extras})
    }
    const requiredArgs = parse.input.args.filter(a => a.required)
    const missingRequiredArgs = requiredArgs.slice(parse.output.argv.length)
    if (missingRequiredArgs.length) {
      throw new RequiredArgsError({parse, args: missingRequiredArgs})
    }
  }

  function validateFlags() {
    const flags = Object.keys(parse.input.flags)
      .map(f => parse.input.flags[f])
      .filter(f => f.required && !parse.output.flags[f.name])
    if (flags.length) throw new RequiredFlagError({parse, flags})
  }

  validateArgs()
  validateFlags()
}
