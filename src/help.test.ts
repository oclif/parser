import * as flags from './flags'
import { flagUsages } from './help'
import chalk from 'chalk'

chalk.enabled = false

describe('flagUsage', () => {
  test('shows usages', () => {
    const f = [
      flags.string({ name: 'bak' }),
      flags.string({ name: 'baz', description: 'baz' }),
      flags.string({ name: 'bar', char: 'b', description: 'bar' }),
      flags.string({ name: 'foo', char: 'f', description: 'desc' }),
    ]
    expect(flagUsages(f)).toEqual([
      [' -b, --bar BAR', 'bar'],
      [' -f, --foo FOO', 'desc'],
      [' --bak BAK', undefined],
      [' --baz BAZ', 'baz'],
    ])
  })
})
