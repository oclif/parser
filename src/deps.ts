import args = require('./args')
import flags = require('./flags')
import parse = require('./parse')
import validate = require('./validate')

import chalk = require('chalk')

export const deps = {
  // local
  get args(): typeof args { return fetch('./args') },
  get flags(): typeof flags { return fetch('./flags') },
  get parse(): typeof parse { return fetch('./parse') },
  get validate(): typeof validate { return fetch('./validate') },

  // remote
  get chalk(): typeof chalk { return fetch('chalk') },
}

const cache: any = {}

function fetch(s: string) {
  if (!cache[s]) {
    cache[s] = require(s)
  }
  return cache[s]
}
