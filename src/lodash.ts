import lodash = require('lodash')

export default {
  get mapValues(): typeof lodash.mapValues {
    return fetch('lodash/mapValues')
  },
  get pickBy(): typeof lodash.pickBy {
    return fetch('lodash/pickBy')
  },
  get set(): typeof lodash.set {
    return fetch('lodash/set')
  },
  get zipObject(): typeof lodash.zipObject {
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
