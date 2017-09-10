import MaxBy = require('lodash.maxby')
import PadEnd = require('lodash.padend')
import { stdtermwidth } from './screen'

function linewrap(length: number, s: string): string {
  const lw = require('@heroku/linewrap')
  return lw(length, stdtermwidth, {
    skipScheme: 'ansi-color',
  })(s).trim()
}

export type IListItem = [string, string | undefined]
export type IList = IListItem[]
export function renderList(items: IListItem[]): string {
  const padEnd: typeof PadEnd = require('lodash.padend')
  const maxBy: typeof MaxBy = require('lodash.maxby')

  if (items.length === 0) {
    return ''
  }
  const maxLength = (maxBy(items, '[0].length') as any)[0].length
  const lines = items.map(i => {
    let left = i[0]
    let right = i[1]
    if (!right) {
      return left
    }
    left = `${padEnd(left, maxLength)}`
    right = linewrap(maxLength + 2, right)
    return `${left}  ${right}`
  })
  return lines.join('\n')
}
