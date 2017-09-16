let chalk = require('chalk')

const enabled = chalk.enabled
beforeEach(() => {
  chalk.enabled = false
})

afterEach(() => {
  chalk.enabled = enabled
})
