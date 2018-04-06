import chalk = require('chalk')

import args = require('./args')
import errors = require('./errors')
import flags = require('./flags')
import list = require('./list')
import parse = require('./parse')
import validate = require('./validate')

export const deps = {
  // local
  get args(): typeof args { return args },
  get flags(): typeof flags { return flags },
  get parse(): typeof parse { return parse },
  get validate(): typeof validate { return validate },
  get renderList(): typeof list.renderList { return list.renderList },
  get errors(): typeof errors { return errors },

  // remote
  get chalk(): typeof chalk.default | undefined {
    try {
      return chalk.default
      // tslint:disable-next-line no-unused
    } catch (err) {}
  },
}
