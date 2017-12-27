import args = require('./args')
import flags = require('./flags')
import parse = require('./parse')
import validate = require('./validate')
import errors = require('./errors')

import chalk = require('chalk')
import list = require('./list')
import screen = require('@cli-engine/screen')

export const deps = {
  // local
  get args(): typeof args { return fetch('./args') },
  get flags(): typeof flags { return fetch('./flags') },
  get parse(): typeof parse { return fetch('./parse') },
  get validate(): typeof validate { return fetch('./validate') },
  get screen(): typeof screen { return fetch('@cli-engine/screen')},
  get renderList(): typeof list.renderList { return fetch('./list').renderList },
  get errors(): typeof errors { return fetch('./errors') },

  // remote
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
