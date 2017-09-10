import { stdtermwidth } from './screen'

function linewrap(length: number, s: string): string {
  const linewrap = require('@heroku/linewrap')
  return linewrap(length, stdtermwidth, {
    skipScheme: 'ansi-color',
  })(s).trim()
}

export function renderList(items: [string, string | undefined][]): string {
  const S = require('string')
  const max = require('lodash.maxby')

  let maxLength = max(items, '[0].length')[0].length
  let lines = items.map(i => {
    let left = i[0]
    let right = i[1]
    if (!right) return left
    left = `${S(left).padRight(maxLength)}`
    right = linewrap(maxLength + 2, right)
    return `${left}  ${right}`
  })
  return lines.join('\n')
}
