import { flags, parse } from '.'

test('--bool', () => {
  const out = parse({
    argv: ['--bool'],
    flags: {
      bool: flags.boolean(),
    },
  })
  expect(out).toMatchObject({ flags: { bool: true } })
})

test('arg1', () => {
  const out = parse({
    args: [{ name: 'foo' }],
    argv: ['arg1'],
  })
  expect(out.argv).toEqual(['arg1'])
  expect(out.args).toEqual({ foo: 'arg1' })
})

test('arg1 arg2', () => {
  const out = parse({
    args: [{ name: 'foo' }, { name: 'bar' }],
    argv: ['arg1', 'arg2'],
  })
  expect(out.argv).toEqual(['arg1', 'arg2'])
  expect(out.args).toEqual({ foo: 'arg1', bar: 'arg2' })
})

describe('output: array', () => {
  test('--bool', () => {
    const out = parse({
      argv: ['--bool'],
      flags: {
        bool: flags.boolean(),
      },
    })
    expect(out.raw[0]).toMatchObject({ flag: 'bool' })
  })

  test('arg1', () => {
    const out = parse({
      args: [{ name: 'foo' }],
      argv: ['arg1'],
    })
    expect(out.raw[0]).toHaveProperty('input', 'arg1')
  })

  test('parses args and flags', () => {
    const out = parse({
      args: [{ name: 'myarg' }, { name: 'myarg2' }],
      argv: ['foo', '--myflag', 'bar', 'baz'],
      flags: { myflag: flags.string() },
    })
    expect(out.argv[0]).toEqual('foo')
    expect(out.argv[1]).toEqual('baz')
    expect(out.flags.myflag).toEqual('bar')
  })

  describe('flags', () => {
    test('parses flags', () => {
      const out = parse({
        argv: ['--myflag', '--myflag2'],
        flags: { myflag: flags.boolean(), myflag2: flags.boolean() },
      })
      expect(out.flags.myflag).toBeTruthy()
      expect(out.flags.myflag2).toBeTruthy()
    })

    test('parses short flags', () => {
      const out = parse({
        argv: ['-mf'],
        flags: {
          force: flags.boolean({ char: 'f' }),
          myflag: flags.boolean({ char: 'm' }),
        },
      })
      expect(out.flags.myflag).toBeTruthy()
      expect(out.flags.force).toBeTruthy()
    })
  })
  test('parses flag value with "=" to separate', () => {
    const out = parse({
      argv: ['--myflag=foo'],
      flags: {
        myflag: flags.string({ char: 'm' }),
      },
    })
    expect(out.flags).toEqual({ myflag: 'foo' })
  })

  test('parses flag value with "=" in value', () => {
    const out = parse({
      argv: ['--myflag', '=foo'],
      flags: {
        myflag: flags.string({ char: 'm' }),
      },
    })
    expect(out.flags).toEqual({ myflag: '=foo' })
  })

  test('parses short flag value with "="', () => {
    const out = parse({
      argv: ['-m=foo'],
      flags: {
        myflag: flags.string({ char: 'm' }),
      },
    })
    expect(out.flags).toEqual({ myflag: 'foo' })
  })

  test('requires required flag', () => {
    expect.assertions(1)
    try {
      parse({
        argv: [],
        flags: {
          myflag: flags.string({
            description: 'flag description',
            required: true,
          }),
        },
      })
    } catch (err) {
      expect(err.message).toEqual(
        'Missing required flag:\n --myflag MYFLAG  flag description\nSee more help with --help',
      )
    }
  })

  test('removes flags from argv', () => {
    const out = parse({
      args: [{ name: 'myarg' }],
      argv: ['--myflag', 'bar', 'foo'],
      flags: { myflag: flags.string() },
    })
    expect(out.flags).toEqual({ myflag: 'bar' })
    expect(out.argv).toEqual(['foo'])
  })

  describe('args', () => {
    test('requires required args with names', () => {
      expect.assertions(1)
      try {
        parse({
          args: [
            { name: 'arg1', required: true },
            {
              description: 'arg2 desc',
              name: 'arg2',
              required: true,
            },
            {
              description: 'arg3 desc',
              name: 'arg3',
              required: true,
            },
          ],
          argv: ['arg1'],
        })
      } catch (err) {
        expect(err.message).toEqual(`Missing 2 required args:
arg2  arg2 desc
arg3  arg3 desc
See more help with --help`)
      }
    })
    test('too many args', () => {
      expect.assertions(1)
      try {
        parse({
          args: [{ name: 'arg1', required: true }],
          argv: ['arg1', 'arg2'],
        })
      } catch (err) {
        expect(err.message).toEqual(`Unexpected argument: arg2\nSee more help with --help`)
      }
    })

    test('parses args', () => {
      const out = parse({
        args: [{ name: 'myarg' }, { name: 'myarg2' }],
        argv: ['foo', 'bar'],
      })
      expect(out.argv).toEqual(['foo', 'bar'])
    })
    test('skips optional args', () => {
      const out = parse({
        args: [{ name: 'myarg' }, { name: 'myarg2' }],
        argv: ['foo'],
      })
      expect(out.argv).toEqual(['foo'])
    })

    test('skips non-required args', () => {
      const out = parse({
        args: [{ name: 'myarg', required: false }, { name: 'myarg2', required: false }],
        argv: ['foo'],
      })
      expect(out.argv).toEqual(['foo'])
    })

    test('parses something looking like a flag as an arg', () => {
      const out = parse({
        args: [{ name: 'myarg' }],
        argv: ['--foo'],
      })
      expect(out.argv).toEqual(['--foo'])
    })
  })

  describe('multiple flags', () => {
    test('parses multiple flags', () => {
      const out = parse({
        argv: ['--bar', 'a', '--bar=b', '--foo=c'],
        flags: {
          bar: flags.string({ multiple: true }),
          foo: flags.string(),
        },
      })
      expect(out.flags.foo!.toUpperCase()).toEqual('C')
      expect(out.flags.bar.join('|')).toEqual('a|b')
    })
  })

  describe('strict: false', () => {
    test('skips flag parsing after "--"', () => {
      const out = parse({
        args: [{ name: 'argOne' }],
        argv: ['foo', 'bar', '--', '--myflag'],
        flags: { myflag: flags.boolean() },
        strict: false,
      })
      expect(out.argv).toEqual(['foo', 'bar', '--myflag'])
      expect(out.args).toEqual({ argOne: 'foo' })
    })

    test('does not repeat arguments', () => {
      const out = parse({
        argv: ['foo', '--myflag=foo bar'],
        strict: false,
      })
      expect(out.argv).toEqual(['foo', '--myflag=foo bar'])
    })
  })

  describe('integer flag', () => {
    test('parses integers', () => {
      const out = parse({
        argv: ['--int', '100'],
        flags: { int: flags.integer(), s: flags.string() },
      })
      expect(out.flags).toMatchObject({ int: 100 })
    })

    test('does not parse strings', () => {
      expect.assertions(1)
      try {
        parse({
          argv: ['--int', 's10'],
          flags: { int: flags.integer() },
        })
      } catch (err) {
        expect(err.message).toEqual(`Expected an integer but received: s10`)
      }
    })
  })
})

test('--no-color', () => {
  const out = parse({
    argv: ['--no-color'],
  })
  expect(out.flags).toMatchObject({ color: false })
})

describe('parse', () => {
  test('parse', () => {
    const out = parse({
      args: [{ name: 'num', parse: i => parseInt(i, 10) }],
      argv: ['--foo=bar', '100'],
      flags: { foo: flags.string({ parse: input => input.toUpperCase() }) },
    })
    expect(out.flags).toMatchObject({ foo: 'BAR' })
    expect(out.args).toMatchObject({ num: 100 })
    expect(out.argv).toMatchObject([100])
  })

  test('gets arg/flag in context', () => {
    const out = parse({
      args: [{ name: 'num', parse: (_, ctx) => ctx.arg.name!.toUpperCase() }],
      argv: ['--foo=bar', '100'],
      flags: { foo: flags.string({ parse: (_, ctx) => ctx.flag.name.toUpperCase() }) },
    })
    expect(out.flags).toMatchObject({ foo: 'FOO' })
    expect(out.args).toMatchObject({ num: 'NUM' })
  })

  test('passes context through', () => {
    const flagfn = jest.fn()
    const argfn = jest.fn()
    parse({
      args: [{ name: 'num', parse: (_, ctx) => ctx.argfn() }],
      argv: ['--foo=bar', '100'],
      flags: { foo: flags.string({ parse: (_, ctx) => ctx.flagfn() }) },
      parseContext: {
        argfn,
        flagfn,
      },
    })
    expect(flagfn).toBeCalled()
    expect(argfn).toBeCalled()
  })
})

describe('defaults', () => {
  test('defaults', () => {
    const out = parse({
      args: [{ name: 'baz', default: 'BAZ' }],
      argv: [],
      flags: { foo: flags.string({ default: 'bar' }) },
    })
    expect(out.args).toMatchObject({ baz: 'BAZ' })
    expect(out.argv).toMatchObject(['BAZ'])
    expect(out.flags).toMatchObject({ foo: 'bar' })
  })

  test('default as function', () => {
    const out = parse({
      args: [{ name: 'baz', default: () => 'BAZ' }],
      argv: [],
      flags: { foo: flags.string({ default: () => 'bar' }) },
    })
    expect(out.args).toMatchObject({ baz: 'BAZ' })
    expect(out.argv).toMatchObject(['BAZ'])
    expect(out.flags).toMatchObject({ foo: 'bar' })
  })

  test('can default to a different flag', () => {
    const out = parse({
      argv: ['--foo=bar'],
      flags: {
        bar: flags.string({
          default: ({ input }) => {
            return input.flags.foo.input[0]
          },
        }),
        foo: flags.string(),
      },
    })
    expect(out.flags).toMatchObject({ foo: 'bar', bar: 'bar' })
  })
})

describe('custom option', () => {
  test('does not require parse fn', () => {
    const foo = flags.option({ char: 'f' })
    const out = parse({
      argv: ['-f', 'bar'],
      flags: { foo: foo() },
    })
    expect(out.flags).toMatchObject({ foo: 'bar' })
  })
})
