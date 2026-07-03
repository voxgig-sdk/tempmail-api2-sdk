
const envlocal = __dirname + '/../../../.env.local'
require('dotenv').config({ quiet: true, path: [envlocal] })

import Path from 'node:path'
import * as Fs from 'node:fs'

import { test, describe, afterEach } from 'node:test'
import assert from 'node:assert'


import { TempmailApi2SDK, BaseFeature, stdutil } from '../../..'

import {
  envOverride,
  liveDelay,
  makeCtrl,
  makeMatch,
  makeReqdata,
  makeStepData,
  makeValid,
  maybeSkipControl,
} from '../../utility'


describe('EmailEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when TEMPMAILAPI2_TEST_LIVE=TRUE.
  afterEach(liveDelay('TEMPMAILAPI2_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = TempmailApi2SDK.test()
    const ent = testsdk.Email()
    assert(null != ent)
  })


  test('basic', async (t) => {

    const live = 'TRUE' === process.env.TEMPMAIL_API__TEST_LIVE
    for (const op of ['list', 'remove']) {
      if (maybeSkipControl(t, 'entityOp', 'email.' + op, live)) return
    }

    const setup = basicSetup()
    // The basic flow consumes synthetic IDs and field values from the
    // fixture (entity TestData.json). Those don't exist on the live API.
    // Skip live runs unless the user provided a real ENTID env override.
    if (setup.syntheticOnly) {
      t.skip('live entity test uses synthetic IDs from fixture — set TEMPMAIL_API__TEST_EMAIL_ENTID JSON to run live')
      return
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select

    let email_ref01_data = Object.values(setup.data.existing.email)[0] as any

    // LIST
    const email_ref01_ent = client.Email()
    const email_ref01_match: any = {}
    email_ref01_match['email_id'] = setup.idmap['email01']
    email_ref01_match['token'] = setup.idmap['token01']

    const email_ref01_list = await email_ref01_ent.list(email_ref01_match)


    // REMOVE
    const email_ref01_match_rm0: any = { id: email_ref01_data.id }
    await email_ref01_ent.remove(email_ref01_match_rm0)
  

    // LIST
    const email_ref01_match_rt0: any = {}
    email_ref01_match_rt0['email_id'] = setup.idmap['email01']
    email_ref01_match_rt0['token'] = setup.idmap['token01']

    const email_ref01_list_rt0 = await email_ref01_ent.list(email_ref01_match_rt0)


  })
})



function basicSetup(extra?: any) {
  // TODO: fix test def options
  const options: any = {} // null

  // TODO: needs test utility to resolve path
  const entityDataFile =
    Path.resolve(__dirname, 
      '../../../../.sdk/test/entity/email/EmailTestData.json')

  // TODO: file ready util needed?
  const entityDataSource = Fs.readFileSync(entityDataFile).toString('utf8')

  // TODO: need a xlang JSON parse utility in voxgig/struct with better error msgs
  const entityData = JSON.parse(entityDataSource)

  options.entity = entityData.existing

  let client = TempmailApi2SDK.test(options, extra)
  const struct = client.utility().struct
  const merge = struct.merge
  const transform = struct.transform

  let idmap = transform(
    ['email01','email02','email03','inbox01','inbox02','inbox03'],
    {
      '`$PACK`': ['', {
        '`$KEY`': '`$COPY`',
        '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
      }]
    })

  // Detect whether the user provided a real ENTID JSON via env var. The
  // basic flow consumes synthetic IDs from the fixture file; without an
  // override those synthetic IDs reach the live API and 4xx. Surface this
  // to the test so it can skip rather than fail.
  const idmapEnvVal = process.env['TEMPMAIL_API__TEST_EMAIL_ENTID']
  const idmapOverridden = null != idmapEnvVal && idmapEnvVal.trim().startsWith('{')

  const env = envOverride({
    'TEMPMAIL_API__TEST_EMAIL_ENTID': idmap,
    'TEMPMAIL_API__TEST_LIVE': 'FALSE',
    'TEMPMAIL_API__TEST_EXPLAIN': 'FALSE',
    'TEMPMAIL_API__APIKEY': 'NONE',
  })

  idmap = env['TEMPMAIL_API__TEST_EMAIL_ENTID']

  const live = 'TRUE' === env.TEMPMAIL_API__TEST_LIVE

  if (live) {
    client = new TempmailApi2SDK(merge([
      {
        apikey: env.TEMPMAIL_API__APIKEY,
      },
      extra
    ]))
  }

  const setup = {
    idmap,
    env,
    options,
    client,
    struct,
    data: entityData,
    explain: 'TRUE' === env.TEMPMAIL_API__TEST_EXPLAIN,
    live,
    syntheticOnly: live && !idmapOverridden,
    now: Date.now(),
  }

  return setup
}
  
