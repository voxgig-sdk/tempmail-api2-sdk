
import { test, describe } from 'node:test'
import { equal } from 'node:assert'


import { TempmailApi2SDK } from '..'


describe('exists', async () => {

  test('test-mode', async () => {
    const testsdk = await TempmailApi2SDK.test()
    equal(null !== testsdk, true)
  })

})
