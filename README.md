@dxcli/parser
=============

arg and flag parser for dxcli

[![Version](https://img.shields.io/npm/v/@dxcli/parser.svg)](https://npmjs.org/package/@dxcli/parser)
[![CircleCI](https://circleci.com/gh/dxcli/parser/tree/master.svg?style=svg)](https://circleci.com/gh/dxcli/parser/tree/master)
[![Appveyor CI](https://ci.appveyor.com/api/projects/status/github/dxcli/parser?branch=master&svg=true)](https://ci.appveyor.com/project/heroku/parser/branch/master)
[![Codecov](https://codecov.io/gh/dxcli/parser/branch/master/graph/badge.svg)](https://codecov.io/gh/dxcli/parser)
[![Greenkeeper](https://badges.greenkeeper.io/dxcli/parser.svg)](https://greenkeeper.io/)
[![Known Vulnerabilities](https://snyk.io/test/npm/@dxcli/parser/badge.svg)](https://snyk.io/test/npm/@dxcli/parser)
[![Downloads/week](https://img.shields.io/npm/dw/@dxcli/parser.svg)](https://npmjs.org/package/@dxcli/parser)
[![License](https://img.shields.io/npm/l/@dxcli/parser.svg)](https://github.com/dxcli/parser/blob/master/package.json)

CLI flag parser.

Usage:

```js
const CLI = require('cli-flags')

const {flags, args} = CLI.parse({
  flags: {
    'output-file': CLI.flags.string({char: 'o'}),
    force: CLI.flags.boolean({char: 'f'})
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
