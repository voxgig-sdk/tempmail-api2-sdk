import { describe, test } from 'node:test'
import { SDK } from '..'
import { runDefinitionPoint } from './definition-runner'
import { isControlSkipped } from './utility'


// Generated from the API definition, not from the model this SDK was built
// from: the route, the declared query parameters, the credential the security
// scheme names, and the definition's own response example.
const PLAN: any[] = [
  {
    "entity": "domain",
    "accessor": "Domain",
    "op": "list",
    "method": "GET",
    "path": "/domains",
    "args": [],
    "select": {},
    "headers": [],
    "query": [],
    "auth": null,
    "status": 200,
    "sample": {
      "domains": [
        "tempmail.lol",
        "temp.lol"
      ]
    },
    "idField": "id"
  },
  {
    "entity": "email",
    "accessor": "Email",
    "op": "load",
    "method": "GET",
    "path": "/inbox/{token}/{emailId}",
    "args": [
      {
        "name": "email_id",
        "wire": "emailId",
        "value": "p1"
      },
      {
        "name": "token",
        "wire": "token",
        "value": "p2"
      }
    ],
    "select": {},
    "headers": [],
    "query": [],
    "auth": null,
    "status": 200,
    "sample": {
      "id": "x",
      "from": "x",
      "to": "x",
      "subject": "x",
      "body": "x",
      "html": "x",
      "date": "2026-01-01T00:00:00Z",
      "attachments": [
        {
          "filename": "x",
          "size": 1,
          "contentType": "x"
        }
      ]
    },
    "idField": "id"
  },
  {
    "entity": "email",
    "accessor": "Email",
    "op": "remove",
    "method": "DELETE",
    "path": "/inbox/{token}/{emailId}",
    "args": [
      {
        "name": "email_id",
        "wire": "emailId",
        "value": "p1"
      },
      {
        "name": "token",
        "wire": "token",
        "value": "p2"
      }
    ],
    "select": {},
    "headers": [],
    "query": [],
    "auth": null,
    "status": 200,
    "sample": {
      "message": "Email deleted successfully"
    },
    "idField": "id"
  },
  {
    "entity": "inbox",
    "accessor": "Inbox",
    "op": "create",
    "method": "POST",
    "path": "/inbox/create",
    "action": "create",
    "args": [],
    "select": {},
    "headers": [],
    "query": [],
    "auth": null,
    "status": 200,
    "sample": {
      "email": "x",
      "token": "x"
    },
    "idField": "id"
  },
  {
    "entity": "inbox",
    "accessor": "Inbox",
    "op": "create",
    "method": "POST",
    "path": "/inbox/custom",
    "action": "custom",
    "args": [],
    "select": {},
    "headers": [],
    "query": [],
    "auth": null,
    "status": 200,
    "sample": {
      "email": "x",
      "token": "x"
    },
    "idField": "id"
  },
  {
    "entity": "inbox",
    "accessor": "Inbox",
    "op": "load",
    "method": "GET",
    "path": "/inbox/{token}",
    "args": [
      {
        "name": "id",
        "wire": "token",
        "value": "p1"
      }
    ],
    "select": {},
    "headers": [],
    "query": [],
    "auth": null,
    "status": 200,
    "sample": {
      "emails": [
        {
          "id": "x",
          "from": "x",
          "subject": "x",
          "body": "x",
          "date": "2026-01-01T00:00:00Z"
        }
      ]
    },
    "idField": "id"
  },
  {
    "entity": "inbox",
    "accessor": "Inbox",
    "op": "remove",
    "method": "DELETE",
    "path": "/inbox/{token}",
    "args": [
      {
        "name": "id",
        "wire": "token",
        "value": "p1"
      }
    ],
    "select": {},
    "headers": [],
    "query": [],
    "auth": null,
    "status": 200,
    "sample": {
      "message": "Inbox deleted successfully"
    },
    "idField": "id"
  }
]


describe('definition', () => {
  for (const point of PLAN) {
    test(point.entity + '.' + point.op + ' ' + point.method + ' ' + point.path, async (t) => {
      const control = isControlSkipped('entityOp', point.entity + '.' + point.op, 'definition')
      if (control.skip) {
        t.skip(control.reason || 'skipped via sdk-test-control.json')
        return
      }
      await runDefinitionPoint(SDK, point)
    })
  }
})
