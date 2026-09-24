
import { test, describe } from 'node:test'
import { equal } from 'node:assert'


import { TempmailApi2SDK } from '..'


describe('exists', async () => {

  test('test-mode', () => {
    const testsdk = TempmailApi2SDK.test()
    equal(testsdk instanceof TempmailApi2SDK, true,
      'TempmailApi2SDK.test() must return a client synchronously')
  })

})
