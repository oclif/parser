import Chalk from 'chalk'

import Deps from './deps'
import {IFlag} from './flags'
import * as Util from './util'

const m = Deps()
.add('chalk', () => require('chalk') as typeof Chalk)
.add('util', () => require('./util') as typeof Util)

export interface FlagUsageOptions { displayRequired?: boolean }
export function flagUsage(flag: IFlag<any>, options: FlagUsageOptions = {}): [string, string | undefined] {
  const label = []
  if (flag.char) label.push(`-${flag.char}`)
  if (flag.name && !flag.charOnly) label.push(` --${flag.name}`)

  const usage = flag.type === 'option' ? ` ${flag.name.toUpperCase()}` : ''

  let description: string | undefined = flag.description || ''
  if (options.displayRequired && flag.required) description = `(required) ${description}`
  description = description ? m.chalk.dim(description) : undefined

  return [` ${label.join(',').trim()}${usage}`, description] as [string, string | undefined]
}

export function flagUsages(flags: IFlag<any>[], options: FlagUsageOptions = {}): [string, string | undefined][] {
  if (!flags.length) return []
  const {sortBy} = m.util
  return sortBy(flags, f => [f.char ? -1 : 1, f.char, f.name])
    .map(f => flagUsage(f, options))
}
