import { parse, flags, args } from '.'

test('--bool', () => {
  let out = parse({
    argv: ['--bool'],
    flags: {
      bool: flags.boolean(),
    },
  })
  expect(out).toMatchObject({ flags: { bool: true } })
})

test('arg1', () => {
  let out = parse({
    argv: ['arg1'],
    args: [args.string({ name: 'foo' })],
  })
  expect(out.argv).toEqual(['arg1'])
  expect(out.args).toEqual({ foo: 'arg1' })
})

test('arg1 arg2', () => {
  let out = parse({
    argv: ['arg1', 'arg2'],
    args: [args.string({ name: 'foo' }), args.string({ name: 'bar' })],
  })
  expect(out.argv).toEqual(['arg1', 'arg2'])
  expect(out.args).toEqual({ foo: 'arg1', bar: 'arg2' })
})

describe('output: array', () => {
  test('--bool', () => {
    let out = parse({
      argv: ['--bool'],
      flags: {
        bool: flags.boolean(),
      },
      output: 'array',
    })
    expect((out[0] as any).name).toEqual('bool')
  })

  test('arg1', () => {
    let out = parse({
      argv: ['arg1'],
      args: [args.string()],
      output: 'array',
    })
    expect((out[0] as any).input).toEqual('arg1')
  })
})

test('parses args and flags', () => {
  let out = parse({
    argv: ['foo', '--myflag', 'bar', 'baz'],
    args: [args.string({ name: 'myarg' }), args.string({ name: 'myarg2' })],
    flags: { myflag: flags.string() },
  })
  expect(out.argv[0]).toEqual('foo')
  expect(out.argv[1]).toEqual('baz')
  expect(out.flags.myflag).toEqual('bar')
})

describe('flags', () => {
  test('parses flags', () => {
    let out = parse({
      argv: ['--myflag', '--myflag2'],
      flags: { myflag: flags.boolean(), myflag2: flags.boolean() },
    })
    expect(out.flags.myflag).toBeTruthy()
    expect(out.flags.myflag2).toBeTruthy()
  })

  test('parses short flags', () => {
    let out = parse({
      argv: ['-mf'],
      flags: {
        myflag: flags.boolean({ char: 'm' }),
        force: flags.boolean({ char: 'f' }),
      },
    })
    expect(out.flags.myflag).toBeTruthy()
    expect(out.flags.force).toBeTruthy()
  })

  test('parses flag value with "=" to separate', () => {
    let out = parse({
      argv: ['--myflag=foo'],
      flags: {
        myflag: flags.string({ char: 'm' }),
      },
    })
    expect(out.flags).toEqual({ myflag: 'foo' })
  })

  test('parses flag value with "=" in value', () => {
    let out = parse({
      argv: ['--myflag', '=foo'],
      flags: {
        myflag: flags.string({ char: 'm' }),
      },
    })
    expect(out.flags).toEqual({ myflag: '=foo' })
  })

  test('parses short flag value with "="', () => {
    let out = parse({
      argv: ['-m=foo'],
      flags: {
        myflag: flags.string({ char: 'm' }),
      },
    })
    expect(out.flags).toEqual({ myflag: 'foo' })
  })

  test.only('requires required args', () => {
    expect.assertions(1)
    try {
      let out = parse({
        argv: ['arg1'],
        args: [args.string({ required: true }), args.string({ required: true }), args.string({ optional: false })],
      })
    } catch (err) {
      expect(err.message).toEqual('Missing 2 required args')
    }
  })

  test.only('requires required args with names', () => {
    expect.assertions(1)
    try {
      let out = parse({
        argv: ['arg1'],
        args: [
          args.string({ required: true }),
          args.string({ name: 'arg2', description: 'arg2 desc', required: true }),
          args.string({ name: 'arg3', description: 'arg2 desc', optional: false }),
        ],
      })
    } catch (err) {
      expect(err.message).toEqual('Missing 2 required args')
    }
  })

  test('requires required flag', () => {
    expect.assertions(1)
    try {
      let out = parse({
        argv: [],
        flags: {
          myflag: flags.string({ required: true, description: 'flag description' }),
        },
      })
    } catch (err) {
      expect(err.message).toEqual('Missing required flag --myflag\nUSAGE: --myflag=MYFLAG\nflag description')
    }
  })
})

//   test('requires nonoptional flag', () => {
//     let out = parse({
//       flags: {
//         myflag: flags.string({optional: false})
//       }
//     })
//     expect.assertions(1)
//     try {
//       await p.parse()
//     } catch (err) {
//       expect(out.err.message).toEqual('Missing required flag --myflag')
//     }
//   })

//   test('removes flags from argv', () => {
//     let out = parse({
//       args: [{name: 'myarg'}],
//       flags: {myflag: flags.string()}
//     })
//     {argv: ['--myflag', 'bar', 'foo']})
//     expect(out.flags).toEqual({myflag: 'bar'})
//     expect(out.argv).toEqual(['foo'])
//   })
// })

// describe('args', () => {
//   test('requires args by default', () => {
//     let out = parse({
//     expect.assertions(1)
//     const p = new Parser({args: [{name: 'myarg'}, {name: 'myarg2'}]})
//     try {
//       await p.parse()
//     } catch (err) {
//       expect(out.err.message).toEqual('Error: Missing required argument myarg')
//     }
//   })

//   test('parses args', () => {
//     let out = parse({
//     const p = new Parser({args: [{name: 'myarg'}, {name: 'myarg2'}]})
//     {argv: ['foo', 'bar']})
//     expect(out.argv).toEqual(['foo', 'bar'])
//   })

//   test('skips optional args', () => {
//     let out = parse({
//     const p = new Parser({args: [{name: 'myarg', optional: true}, {name: 'myarg2', optional: true}]})
//     {argv: ['foo']})
//     expect(out.argv).toEqual(['foo'])
//   })

//   test('skips non-required args', () => {
//     let out = parse({
//     const p = new Parser({args: [{name: 'myarg', required: false}, {name: 'myarg2', required: false}]})
//     {argv: ['foo']})
//     expect(out.argv).toEqual(['foo'])
//   })

//   test('parses something looking like a flag as an arg', () => {
//     let out = parse({
//     const p = new Parser({args: [{name: 'myarg'}]})
//     {argv: ['--foo']})
//     expect(out.argv).toEqual(['--foo'])
//   })
// })

// describe('variableArgs', () => {
//   test('skips flag parsing after "--"', () => {
//     let out = parse({
//       variableArgs: true,
//       flags: {myflag: flags.boolean()},
//       args: [{name: 'argOne'}]
//     })
//     {argv: ['foo', 'bar', '--', '--myflag']})
//     expect(out.argv).toEqual(['foo', 'bar', '--myflag'])
//     expect(out.args).toEqual({argOne: 'foo'})
//   })

//   test('does not repeat arguments', () => {
//     let out = parse({
//       variableArgs: true
//     })
//     {argv: ['foo', '--myflag=foo bar']})
//     expect(out.argv).toEqual(['foo', '--myflag=foo bar'])
//   })
// })
