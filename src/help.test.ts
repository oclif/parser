import { flags } from './flags'
import { flagUsage } from './help'

describe('flagUsage', () => {
  test('shows usage', () => {
    const flag = flags.string({ char: 'f', description: 'desc' })
    flag.name = 'foo'
    expect(flagUsage(flag)).toEqual(['-f, --foo FOO', 'desc'])
  })
})
