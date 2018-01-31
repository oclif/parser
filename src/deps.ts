import screen = require('@anycli/screen')
import chalk = require('chalk')

import args = require('./args')
import errors = require('./errors')
import flags = require('./flags')
import list = require('./list')
import parse = require('./parse')
import validate = require('./validate')

export const deps = {
  // local
  get args(): typeof args { return fetch('./args') },
  get flags(): typeof flags { return fetch('./flags') },
  get parse(): typeof parse { return fetch('./parse') },
  get validate(): typeof validate { return fetch('./validate') },
  get screen(): typeof screen { return fetch('@anycli/screen')},
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
