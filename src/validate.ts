import {CLIError} from '@oclif/errors'

import {Arg} from './args'
import {InvalidArgsSpecError, RequiredArgsError, RequiredFlagError, UnexpectedArgsError} from './errors'
import {ParserInput, ParserOutput} from './parse'

export function validate(parse: { input: ParserInput; output: ParserOutput<any, any> }) {
  function validateArgs() {
    const maxArgs = parse.input.args.length
    if (parse.input.strict && parse.output.argv.length > maxArgs) {
      const extras = parse.output.argv.slice(maxArgs)
      throw new UnexpectedArgsError({parse, args: extras})
    }

    const missingRequiredArgs: Arg<any>[] = []
    let hasOptional = false

    parse.input.args.forEach((arg, index) => {
      if (!arg.required) {
        hasOptional = true
      } else if (hasOptional) { // (required arg) check whether an optional has occured before
        // optionals should follow required, not before
        throw new InvalidArgsSpecError({parse, args: parse.input.args})
      }

      if (arg.required) {
        if (!parse.output.argv[index]) {
          missingRequiredArgs.push(arg)
        }
      }
    })

    if (missingRequiredArgs.length > 0) {
      throw new RequiredArgsError({parse, args: missingRequiredArgs})
    }
  }

  function validateFlags() {
    for (const [name, flag] of Object.entries(parse.input.flags)) {
      if (parse.output.flags[name] !== undefined) {
        for (const also of flag.dependsOn || []) {
          if (!parse.output.flags[also]) {
            throw new CLIError(`--${also}= must also be provided when using --${name}=`)
          }
        }
        for (const also of flag.exclusive || []) {
          // do not enforce exclusivity for flags that were defaulted
          if (parse.output.metadata.flags[also] && parse.output.metadata.flags[also].setFromDefault) continue
          if (parse.output.metadata.flags[name] && parse.output.metadata.flags[name].setFromDefault) continue
          if (parse.output.flags[also]) {
            throw new CLIError(`--${also}= cannot also be provided when using --${name}=`)
          }
        }
      } else if (flag.required) throw new RequiredFlagError({parse, flag})
    }
  }

  validateArgs()
  validateFlags()
}
