

import Path from 'node:path'
import * as Fs from 'node:fs'

import { test, describe, afterEach } from 'node:test'
import assert from 'node:assert'
import { createLiveTransport } from '../../live-runner'
import { runLiveEntity } from '../../live-entity'


import { TempmailApi2SDK, BaseFeature, stdutil } from '../../..'

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


describe('InboxEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when TEMPMAIL_API2_TEST_LIVE=TRUE.
  afterEach(liveDelay('TEMPMAIL_API2_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = TempmailApi2SDK.test()
    const ent = testsdk.Inbox()
    assert(null != ent)
  })


  test('basic', async (t) => {

    const live = 'TRUE' === process.env.TEMPMAIL_API2_TEST_LIVE
    for (const op of ['create', 'load', 'remove']) {
      if (!live && maybeSkipControl(t, 'entityOp', 'inbox.' + op, live)) return
    }

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":{"emails":{"a":true,"h":"Emails","n":"emails","r":false,"t":"`$ARRAY`","key$":"emails","index$":0},"id":{"a":true,"h":"Id","n":"id","r":false,"t":"`$STRING`","key$":"id","index$":1}},"id":{"field":"id","name":"id"},"name":"inbox","op":{"create":{"input":"data","name":"create","points":[{"a":true,"co":{"id":"POST /inbox/create","source":"openapi3","version":2},"g":{},"k":"http","m":"POST","o":"/inbox/create","q":{"$action":"create"},"r":{},"s":[{"lit":"inbox"},{"lit":"create"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":0},{"a":true,"co":{"id":"POST /inbox/custom","source":"openapi3","version":2},"g":{},"k":"http","m":"POST","o":"/inbox/custom","q":{"$action":"custom"},"r":{},"s":[{"lit":"inbox"},{"lit":"custom"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":1}],"key$":"create"},"load":{"input":"data","name":"load","points":[{"a":true,"co":{"id":"GET /inbox/{token}","source":"openapi3","version":2},"g":{"params":[{"a":true,"k":"param","n":"id","or":"token","r":true,"t":"`$STRING`","index$":0}]},"k":"http","m":"GET","o":"/inbox/{token}","q":{"exist":["id"]},"r":{"param":{"token":"id"}},"s":[{"lit":"inbox"},{"var":"id"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"load"},"remove":{"input":"data","name":"remove","points":[{"a":true,"co":{"id":"DELETE /inbox/{token}","source":"openapi3","version":2},"g":{"params":[{"a":true,"k":"param","n":"id","or":"token","r":true,"t":"`$STRING`","index$":0}]},"k":"http","m":"DELETE","o":"/inbox/{token}","q":{"exist":["id"]},"r":{"param":{"token":"id"}},"s":[{"lit":"inbox"},{"var":"id"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"remove"}},"relations":{"ancestors":[]},"key$":"inbox","name__orig":"inbox","Name":"Inbox","name_":"inbox","name-":"inbox","NAME":"INBOX","index$":2}, {"active":true,"entity":"inbox","key$":"BasicInboxFlow","kind":"basic","name":"BasicInboxFlow","param":{},"step":[{"a":true,"d":{},"i":{"ref":"inbox_ref01"},"m":{},"o":"create","s":[],"v":[],"index$":0},{"a":true,"d":{},"i":{"ref":"inbox_ref01","srcdatavar":"inbox_ref01_data","suffix":"_dt0"},"m":{"id":"inbox01"},"o":"load","s":[],"v":[{"apply":"TextFieldMark","def":{"mark":"Mark01-inbox_ref01"}}],"index$":1},{"a":true,"d":{},"i":{"ref":"inbox_ref01","suffix":"_rm0"},"m":{"id":"inbox01"},"o":"remove","s":[],"v":[],"index$":2}]}, 'Inbox', {"POST /inbox/create":{"protocol":"http","operationId":"createInbox","responses":{"200":{"description":"Successfully created temporary inbox","content":{"application/json":{"schema":{"type":"object","properties":{"email":{"type":"string","format":"email","description":"The generated temporary email address"},"token":{"type":"string","description":"Authentication token for accessing the inbox"}}}}}},"400":{"description":"Bad request"},"500":{"description":"Internal server error"}},"parameters":[],"securitySource":"unspecified"},"POST /inbox/custom":{"protocol":"http","operationId":"createCustomInbox","requestBody":{"required":true,"content":{"application/json":{"schema":{"type":"object","required":["username"],"properties":{"username":{"type":"string","description":"Desired username for the email address"},"domain":{"type":"string","description":"Domain for the email address (optional)"}}}}}},"responses":{"200":{"description":"Successfully created custom inbox","content":{"application/json":{"schema":{"type":"object","properties":{"email":{"type":"string","format":"email","description":"The created custom email address"},"token":{"type":"string","description":"Authentication token for accessing the inbox"}}}}}},"400":{"description":"Bad request - Username already taken or invalid"},"500":{"description":"Internal server error"}},"parameters":[],"securitySource":"unspecified"},"GET /inbox/{token}":{"protocol":"http","operationId":"getInbox","responses":{"200":{"description":"Successfully retrieved inbox messages","content":{"application/json":{"schema":{"type":"object","properties":{"emails":{"type":"array","items":{"type":"object","properties":{"id":{"type":"string","description":"Unique identifier for the email"},"from":{"type":"string","format":"email","description":"Sender email address"},"subject":{"type":"string","description":"Email subject"},"body":{"type":"string","description":"Email body content"},"date":{"type":"string","format":"date-time","description":"Timestamp when email was received"}}},"key$":"emails"}},"index$":0}}}},"401":{"description":"Unauthorized - Invalid token"},"404":{"description":"Inbox not found"},"500":{"description":"Internal server error"}},"parameters":[{"name":"token","in":"path","required":true,"description":"The authentication token for the inbox","schema":{"type":"string"},"index$":0}],"securitySource":"unspecified"},"DELETE /inbox/{token}":{"protocol":"http","operationId":"deleteInbox","responses":{"200":{"description":"Inbox successfully deleted","content":{"application/json":{"schema":{"type":"object","properties":{"message":{"type":"string","example":"Inbox deleted successfully"}}}}}},"401":{"description":"Unauthorized - Invalid token"},"404":{"description":"Inbox not found"},"500":{"description":"Internal server error"}},"parameters":[{"name":"token","in":"path","required":true,"description":"The authentication token for the inbox","schema":{"type":"string"},"index$":0}],"securitySource":"unspecified"}})
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select


    // CREATE
    const inbox_ref01_ent = client.Inbox()
    let inbox_ref01_data = setup.data.new.inbox['inbox_ref01']

    inbox_ref01_data = (await inbox_ref01_ent.create(inbox_ref01_data)).data()
    assert(null != inbox_ref01_data.id)


    // LOAD
    const inbox_ref01_match_dt0: any = {}
    inbox_ref01_match_dt0.id = inbox_ref01_data.id
    const inbox_ref01_data_dt0 = (await inbox_ref01_ent.load(inbox_ref01_match_dt0)).data()
    assert(inbox_ref01_data_dt0.id === inbox_ref01_data.id)


    // REMOVE
    const inbox_ref01_match_rm0: any = { id: inbox_ref01_data.id }
    await inbox_ref01_ent.remove(inbox_ref01_match_rm0)
  

  })
})



function basicSetup(extra?: any) {
  // TODO: fix test def options
  const options: any = {} // null

  // TODO: needs test utility to resolve path
  const entityDataFile =
    Path.resolve(__dirname, 
      '../../../../.sdk/test/entity/inbox/InboxTestData.json')

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
    ['inbox01','inbox02','inbox03'],
    {
      '`$PACK`': ['', {
        '`$KEY`': '`$COPY`',
        '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
      }]
    })

  const env = envOverride({
    'TEMPMAIL_API2_TEST_INBOX_ENTID': idmap,
    'TEMPMAIL_API2_TEST_LIVE': 'FALSE',
    'TEMPMAIL_API2_TEST_EXPLAIN': 'FALSE',
  })

  idmap = env['TEMPMAIL_API2_TEST_INBOX_ENTID']

  const live = 'TRUE' === env.TEMPMAIL_API2_TEST_LIVE

  const transport = createLiveTransport()
  if (live) {
    const rawIds = process.env['TEMPMAIL_API2_TEST_INBOX_ENTID']
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
  
