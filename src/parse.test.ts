import { args, flags, parse } from '.'

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
    args: [args.string({ name: 'foo' })],
    argv: ['arg1'],
  })
  expect(out.argv).toEqual(['arg1'])
  expect(out.args).toEqual({ foo: 'arg1' })
})

test('arg1 arg2', () => {
  const out = parse({
    args: [args.string({ name: 'foo' }), args.string({ name: 'bar' })],
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
      output: 'array',
    })
    expect((out[0] as any).flag.name).toEqual('bool')
  })

  test('arg1', () => {
    const out = parse({
      args: [args.string({ name: 'foo' })],
      argv: ['arg1'],
      output: 'array',
    })
    expect((out[0] as any).input).toEqual('arg1')
  })
})

test('parses args and flags', () => {
  const out = parse({
    args: [args.string({ name: 'myarg' }), args.string({ name: 'myarg2' })],
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

  test('requires required args', () => {
    expect.assertions(1)
    try {
      const out = parse({
        args: [args.string({ required: true }), args.string({ required: true }), args.string({ optional: false })],
        argv: ['arg1'],
      })
    } catch (err) {
      expect(err.message).toEqual('Missing 2 required args')
    }
  })

  test('requires required args with names', () => {
    expect.assertions(1)
    try {
      const out = parse({
        args: [
          args.string({ required: true }),
          args.string({ name: 'arg2', description: 'arg2 desc', required: true }),
          args.string({ name: 'arg3', description: 'arg3 desc', optional: false }),
        ],
        argv: ['arg1'],
      })
    } catch (err) {
      expect(err.message).toEqual(`Missing 2 required args:
arg2  arg2 desc
arg3  arg3 desc`)
    }
  })

  test('requires required flag', () => {
    expect.assertions(1)
    try {
      const out = parse({
        argv: [],
        flags: {
          myflag: flags.string({ required: true, description: 'flag description' }),
        },
      })
    } catch (err) {
      expect(err.message).toEqual('Missing required flag --myflag')
    }
  })

  test('requires nonoptional flag', () => {
    expect.assertions(1)
    try {
      parse({
        argv: [],
        flags: {
          myflag: flags.string({ optional: false }),
        },
      })
    } catch (err) {
      expect(err.message).toEqual('Missing required flag --myflag')
    }
  })

  test('removes flags from argv', () => {
    const out = parse({
      args: [args.string({ name: 'myarg' })],
      argv: ['--myflag', 'bar', 'foo'],
      flags: { myflag: flags.string() },
    })
    expect(out.flags).toEqual({ myflag: 'bar' })
    expect(out.argv).toEqual(['foo'])
  })
})

// describe('args', () => {
//   test('requires args by default', () => {
//     const out = parse({
//     expect.assertions(1)
//     const p = new Parser({args: [{name: 'myarg'}, {name: 'myarg2'}]})
//     try {
//       await p.parse()
//     } catch (err) {
//       expect(out.err.message).toEqual('Error: Missing required argument myarg')
//     }
//   })

//   test('parses args', () => {
//     const out = parse({
//     const p = new Parser({args: [{name: 'myarg'}, {name: 'myarg2'}]})
//     {argv: ['foo', 'bar']})
//     expect(out.argv).toEqual(['foo', 'bar'])
//   })

//   test('skips optional args', () => {
//     const out = parse({
//     const p = new Parser({args: [{name: 'myarg', optional: true}, {name: 'myarg2', optional: true}]})
//     {argv: ['foo']})
//     expect(out.argv).toEqual(['foo'])
//   })

//   test('skips non-required args', () => {
//     const out = parse({
//     const p = new Parser({args: [{name: 'myarg', required: false}, {name: 'myarg2', required: false}]})
//     {argv: ['foo']})
//     expect(out.argv).toEqual(['foo'])
//   })

//   test('parses something looking like a flag as an arg', () => {
//     const out = parse({
//     const p = new Parser({args: [{name: 'myarg'}]})
//     {argv: ['--foo']})
//     expect(out.argv).toEqual(['--foo'])
//   })
// })

// describe('variableArgs', () => {
//   test('skips flag parsing after "--"', () => {
//     const out = parse({
//       variableArgs: true,
//       flags: {myflag: flags.boolean()},
//       args: [{name: 'argOne'}]
//     })
//     {argv: ['foo', 'bar', '--', '--myflag']})
//     expect(out.argv).toEqual(['foo', 'bar', '--myflag'])
//     expect(out.args).toEqual({argOne: 'foo'})
//   })

//   test('does not repeat arguments', () => {
//     const out = parse({
//       variableArgs: true
//     })
//     {argv: ['foo', '--myflag=foo bar']})
//     expect(out.argv).toEqual(['foo', '--myflag=foo bar'])
//   })
// })
