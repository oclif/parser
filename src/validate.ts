import { UnexpectedArgsError, RequiredArgsError, RequiredFlagError } from './errors'
import { ParserInput, ParserOutput } from './parse'
import { InputFlags } from '.'

export function validate<T extends InputFlags>(parse: { input: ParserInput; output: ParserOutput<T> }) {
  function validateArgs() {
    const maxArgs = parse.input.args.length
    if (parse.input.strict && parse.output.argv.length > maxArgs) {
      const extras = parse.output.argv.slice(maxArgs)
      throw new UnexpectedArgsError({ parse, args: extras })
    }
    const requiredArgs = parse.input.args.filter(a => a.required)
    const missingRequiredArgs = requiredArgs.slice(parse.output.argv.length)
    if (missingRequiredArgs.length) {
      throw new RequiredArgsError({ parse, args: missingRequiredArgs })
    }
  }

  function validateFlags() {
    const flags = Object.values(parse.input.flags).filter(f => f.required && f.value === undefined)
    if (flags.length) throw new RequiredFlagError({ parse, flags })
  }

  validateArgs()
  validateFlags()
}
