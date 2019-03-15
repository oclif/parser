import {expect} from 'chai'

import {validate} from '../src/validate'

describe('validate', () => {
  const input = {
    argv: [],
    flags: {
      dinner: {
        description: 'what you want to eat for dinner',
        input: [],
        name: 'dinner',
        exclusive: ['dessert'],
      },
      dessert: {
        description: 'what you want to eat for dessert',
        default: 'cheesecake',
        input: [],
        name: 'dessert',
        exclusive: [],
      }
    },
    args: [],
    strict: true,
    context: {},
    '--': true
  }

  it('enforces exclusivity for flags', () => {
    const output = {
      args: {},
      argv: [],
      flags: {
        dinner: 'pizza',
        dessert: 'cheesecake'
      },
      raw: [{
        type: 'flag',
        flag: 'dinner',
        input: 'pizza'
      }],
      metadata: {
        flags: {
          dessert: {
            setFromDefault: false
          }
        }
      }
    }

    // @ts-ignore
    expect(validate.bind({input, output})).to.throw()
  })

  it('ignores exclusivity for defaulted flags', () => {
    const output = {
      args: {},
      argv: [],
      flags: {
        dinner: 'pizza',
        dessert: 'cheesecake'
      },
      raw: [{
        type: 'flag',
        flag: 'dinner',
        input: 'pizza'
      }],
      metadata: {
        flags: {
          dessert: {
            setFromDefault: true
          }
        }
      }
    }

    // @ts-ignore
    validate({input, output})
  })
})
