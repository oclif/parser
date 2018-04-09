import {CLIError} from '@oclif/errors'

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
    for (let [name, flag] of Object.entries(parse.input.flags)) {
      if (flag.required && !parse.output.flags[name]) {
        throw new RequiredFlagError({parse, flag})
      }
      for (let also of flag.alsoRequire || []) {
        if (!parse.output.flags[also]) {
          throw new CLIError(`--${also}= must also be provided when using --${name}=`)
        }
      }
    }
  }

  validateArgs()
  validateFlags()
}
