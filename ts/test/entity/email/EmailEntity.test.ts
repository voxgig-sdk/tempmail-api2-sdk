

import Path from 'node:path'
import * as Fs from 'node:fs'

import { test, describe, afterEach } from 'node:test'
import assert from 'node:assert'
import { createLiveTransport } from '../../live-runner'
import { runLiveEntity } from '../../live-entity'


import { TempmailApi2SDK, BaseFeature, config, stdutil } from '../../..'

import {
  envOverride,
  liveClientOptions,
  liveDelay,
  loadEnvLocal,
  makeCtrl,
  makeMatch,
  makeReqdata,
  makeStepData,
  makeValid,
  maybeSkipControl,
} from '../../utility'


loadEnvLocal(__dirname + '/../../../.env.local')


describe('EmailEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when TEMPMAIL_API2_TEST_LIVE=TRUE.
  afterEach(liveDelay('TEMPMAIL_API2_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = TempmailApi2SDK.test()
    const ent = testsdk.Email()
    assert(null != ent)
  })


  test('validate', async (t) => {
    if (null == (config as any).feature?.validate) {
      t.skip('feature not present in this SDK: validate')
      return
    }
    const client = TempmailApi2SDK.test(undefined, { feature: { validate: { active: true } } })
    await assert.rejects(client.Email().load({"email_id":1,"token":"x"} as any),
      (err: any) => 'validate_failed' === err.code)
  })



  test('basic', async (t) => {

    const live = 'TRUE' === process.env.TEMPMAIL_API2_TEST_LIVE
    for (const op of []) {
      if (!live && maybeSkipControl(t, 'entityOp', 'email.' + op, live)) return
    }

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":{"attachments":{"a":true,"h":"Attachments","n":"attachments","r":false,"t":"`$ARRAY`","key$":"attachments","index$":0},"body":{"a":true,"h":"Body","n":"body","r":false,"sh":"Email body content","t":"`$STRING`","key$":"body","index$":1},"date":{"a":true,"fo":"date-time","h":"Date","n":"date","r":false,"sh":"Timestamp when email was received","t":"`$STRING`","key$":"date","index$":2},"from":{"a":true,"fo":"email","h":"From","n":"from","r":false,"sh":"Sender email address","t":"`$STRING`","key$":"from","index$":3},"html":{"a":true,"h":"Html","n":"html","r":false,"sh":"HTML version of email body","t":"`$STRING`","key$":"html","index$":4},"id":{"a":true,"h":"Id","n":"id","r":false,"sh":"Unique identifier for the email","t":"`$STRING`","key$":"id","index$":5},"subject":{"a":true,"h":"Subject","n":"subject","r":false,"sh":"Email subject","t":"`$STRING`","key$":"subject","index$":6},"to":{"a":true,"fo":"email","h":"To","n":"to","r":false,"sh":"Recipient email address","t":"`$STRING`","key$":"to","index$":7}},"id":{"field":"id","name":"id","parts":["token","email_id"],"sep":"/"},"name":"email","op":{"load":{"input":"data","name":"load","points":[{"a":true,"co":{"id":"GET /inbox/{token}/{emailId}","source":"openapi3","version":2},"g":{"params":[{"a":true,"k":"param","n":"email_id","or":"emailId","r":true,"t":"`$STRING`","index$":0},{"a":true,"k":"param","n":"token","or":"token","r":true,"t":"`$STRING`","index$":1}]},"k":"http","m":"GET","o":"/inbox/{token}/{emailId}","q":{"exist":["email_id","token"]},"r":{"param":{"emailId":"email_id"}},"rs":{"kind":"json","media":"application/json"},"s":[{"lit":"inbox"},{"var":"token"},{"var":"email_id"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"load"},"remove":{"input":"data","name":"remove","points":[{"a":true,"co":{"id":"DELETE /inbox/{token}/{emailId}","source":"openapi3","version":2},"g":{"params":[{"a":true,"k":"param","n":"email_id","or":"emailId","r":true,"t":"`$STRING`","index$":0},{"a":true,"k":"param","n":"token","or":"token","r":true,"t":"`$STRING`","index$":1}]},"k":"http","m":"DELETE","o":"/inbox/{token}/{emailId}","q":{"exist":["email_id","token"]},"r":{"param":{"emailId":"email_id"}},"rs":{"kind":"json","media":"application/json"},"s":[{"lit":"inbox"},{"var":"token"},{"var":"email_id"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"remove"}},"relations":{"ancestors":[["$.main.kit.entity.inbox"]]},"key$":"email","name__orig":"email","Name":"Email","name_":"email","name-":"email","NAME":"EMAIL","index$":1}, {"active":true,"entity":"email","key$":"BasicEmailFlow","kind":"basic","name":"BasicEmailFlow","param":{},"step":[{"a":false,"d":{},"i":{"ref":"email_ref01","srcdatavar":"email_ref01_data","suffix":"_dt0"},"m":{"id":"email01","token":"token01"},"o":"load","s":[],"v":[{"apply":"TextFieldMark","def":{"mark":"Mark01-email_ref01"}}],"unreachable":true}]}, 'Email', {"GET /inbox/{token}/{emailId}":{"protocol":"http","parameters":[{"name":"token","in":"path","required":true,"description":"The authentication token for the inbox","schema":{"type":"string"},"index$":0},{"name":"emailId","in":"path","required":true,"description":"The unique identifier of the email","schema":{"type":"string"},"index$":1}]},"DELETE /inbox/{token}/{emailId}":{"protocol":"http","parameters":[{"name":"token","in":"path","required":true,"description":"The authentication token for the inbox","schema":{"type":"string"},"index$":0},{"name":"emailId","in":"path","required":true,"description":"The unique identifier of the email","schema":{"type":"string"},"index$":1}]}}, { strict: LIVE_STRICT, t })
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select

    let email_ref01_data = Object.values(setup.data.existing.email)[0] as any

  })
})



// main.kit.test.live.strict is true (the default is true): a live
// request that fails, or a live test missing an input it needs,
// fails the test.
// An account with no record for a test to read skips it either way.
const LIVE_STRICT = true

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

  const env = envOverride({
    'TEMPMAIL_API2_TEST_EMAIL_ENTID': idmap,
    'TEMPMAIL_API2_TEST_LIVE': 'FALSE',
    'TEMPMAIL_API2_TEST_EXPLAIN': 'FALSE',
  })

  idmap = env['TEMPMAIL_API2_TEST_EMAIL_ENTID']

  const live = 'TRUE' === env.TEMPMAIL_API2_TEST_LIVE

  const transport = createLiveTransport()
  if (live) {
    const rawIds = process.env['TEMPMAIL_API2_TEST_EMAIL_ENTID']
    idmap = rawIds && rawIds.trim() ? JSON.parse(rawIds) : {}
    if (!idmap || Array.isArray(idmap) || typeof idmap !== 'object') {
      throw new Error('Live ENTID must be a JSON object')
    }
    client = new TempmailApi2SDK(merge([
      // FIRST, so the generated fields below win: sdk-test-control.json's
      // test.client.options adds to the live client, it does not redirect it.
      liveClientOptions(),
      {
      },
      // 'extra || {}', not a bare 'extra': struct.merge returns UNDEFINED when the
      // last entry is undefined, and basicSetup is normally called with no
      // argument at all - so a bare 'extra' silently discarded the apikey
      // and server values above and handed the SDK undefined. Harmless
      // while there was nothing in that object; not harmless now.
      extra || {},
      { system: { fetch: transport.fetch } }
    ]))
  }

  const setup = {
    idmap,
    env,
    options,
    client,
    struct,
    data: entityData,
    explain: 'TRUE' === env.TEMPMAIL_API2_TEST_EXPLAIN,
    live,
    transport,
    now: Date.now(),
  }

  return setup
}
  
