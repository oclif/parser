import args = require('./args')
import flags = require('./flags')
import parse = require('./parse')
import validate = require('./validate')

import chalk = require('chalk')
import list = require('cli-ux/lib/list')

export const deps = {
  // local
  get args(): typeof args { return fetch('./args') },
  get flags(): typeof flags { return fetch('./flags') },
  get parse(): typeof parse { return fetch('./parse') },
  get validate(): typeof validate { return fetch('./validate') },

  // remote
  get renderList(): typeof list.renderList { return fetch('cli-ux/lib/list').renderList },
  get chalk(): typeof chalk.default | undefined {
    try {
      return fetch('chalk').default
      // tslint:disable-next-line
    } catch (err) {}
  },
}

const cache: any = {}

function fetch(s: string) {
  if (!cache[s]) {
    cache[s] = require(s)
  }
  return cache[s]
}
