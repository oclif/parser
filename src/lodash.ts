import mapValues = require('lodash/mapValues')
import set = require('lodash/set')
import zipObject = require('lodash/zipObject')

export default {
  get mapValues(): typeof mapValues {
    return fetch('lodash/mapValues')
  },
  get set(): typeof set {
    return fetch('lodash/set')
  },
  get zipObject(): typeof zipObject {
    return fetch('lodash/zipObject')
  },
}

const cache: any = {}

function fetch(s: string) {
  if (!cache[s]) {
    cache[s] = require(s)
  }
  return cache[s]
}
