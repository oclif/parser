cli-flags
=========

[![CircleCI](https://circleci.com/gh/jdxcode/cli-flags/tree/master.svg?style=svg)](https://circleci.com/gh/jdxcode/cli-flags/tree/master)

CLI flag parser.

Usage:

```js
const {flags: Flags, parse} = require('cli-flags')

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

// $ node example.js -f myinput --output-file=myexample.txt
// --force was set
// output file is: myexample.txt
// input arg: myinput
```
