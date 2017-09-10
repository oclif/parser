const {flags: Flags, parse} = require('.') // replace '.' with 'cli-flags'

const {flags, args} = parse({
  flags: {
    'output-file': Flags.string({char: 'o'}),
    force: Flags.boolean({char: 'f'})
  },
  args: [
    {name: 'input', required: true}
  ]
})

if (flags.force) {
  console.log('--force was set')
}

if (flags['output-file']) {
  console.log(`output file is: ${flags['output-file']}`)
}

console.log(`input arg: ${args.input}`)
