import mapValues = require('lodash/mapValues')
import set = require('lodash/set')

export default {
  get mapValues(): typeof mapValues {
    return fetch('lodash/mapValues')
  },
  get set(): typeof set {
    return fetch('lodash/set')
  },
}

const cache: any = {}

function fetch(s: string) {
  if (!cache[s]) {
    cache[s] = require(s)
  }
  return cache[s]
}
