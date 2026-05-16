
import { BaseFeature } from './feature/base/BaseFeature'
import { TestFeature } from './feature/test/TestFeature'



const FEATURE_CLASS: Record<string, typeof BaseFeature> = {
   test: TestFeature

}


class Config {

  makeFeature(this: any, fn: string) {
    const fc = FEATURE_CLASS[fn]
    const fi = new fc()
    // TODO: errors etc
    return fi
  }


  main = {
    name: 'ProjectName',
  }


  feature = {
     test:     {
      "options": {
        "active": false
      }
    }

  }


  options = {
    base: 'https://api.tempmail.lol/v2',

    auth: {
      prefix: 'Bearer',
    },

    headers: {
      "content-type": "application/json"
    },

    entity: {
      
      domain: {
      },

      email: {
      },

      inbox: {
      },

    }
  }


  entity = {
    "domain": {
      "fields": [
        {
          "name": "domain",
          "req": false,
          "type": "`$ARRAY`",
          "active": true,
          "index$": 0
        }
      ],
      "name": "domain",
      "op": {
        "list": {
          "name": "list",
          "points": [
            {
              "method": "GET",
              "orig": "/domains",
              "parts": [
                "domains"
              ],
              "transform": {
                "req": "`reqdata`",
                "res": "`body`"
              },
              "active": true,
              "args": {},
              "select": {},
              "index$": 0
            }
          ],
          "input": "data",
          "key$": "list"
        }
      },
      "relations": {
        "ancestors": []
      }
    },
    "email": {
      "fields": [
        {
          "name": "content_type",
          "req": false,
          "type": "`$STRING`",
          "active": true,
          "index$": 0
        },
        {
          "name": "filename",
          "req": false,
          "type": "`$STRING`",
          "active": true,
          "index$": 1
        },
        {
          "name": "size",
          "req": false,
          "type": "`$INTEGER`",
          "active": true,
          "index$": 2
        }
      ],
      "name": "email",
      "op": {
        "list": {
          "name": "list",
          "points": [
            {
              "args": {
                "params": [
                  {
                    "kind": "param",
                    "name": "email_id",
                    "orig": "email_id",
                    "reqd": true,
                    "type": "`$STRING`",
                    "active": true
                  },
                  {
                    "kind": "param",
                    "name": "token",
                    "orig": "token",
                    "reqd": true,
                    "type": "`$STRING`",
                    "active": true
                  }
                ]
              },
              "method": "GET",
              "orig": "/inbox/{token}/{emailId}",
              "parts": [
                "inbox",
                "{token}",
                "{email_id}"
              ],
              "rename": {
                "param": {
                  "emailId": "email_id"
                }
              },
              "select": {
                "exist": [
                  "email_id",
                  "token"
                ]
              },
              "transform": {
                "req": "`reqdata`",
                "res": "`body`"
              },
              "active": true,
              "index$": 0
            }
          ],
          "input": "data",
          "key$": "list"
        },
        "remove": {
          "name": "remove",
          "points": [
            {
              "args": {
                "params": [
                  {
                    "kind": "param",
                    "name": "email_id",
                    "orig": "email_id",
                    "reqd": true,
                    "type": "`$STRING`",
                    "active": true
                  },
                  {
                    "kind": "param",
                    "name": "token",
                    "orig": "token",
                    "reqd": true,
                    "type": "`$STRING`",
                    "active": true
                  }
                ]
              },
              "method": "DELETE",
              "orig": "/inbox/{token}/{emailId}",
              "parts": [
                "inbox",
                "{token}",
                "{email_id}"
              ],
              "rename": {
                "param": {
                  "emailId": "email_id"
                }
              },
              "select": {
                "exist": [
                  "email_id",
                  "token"
                ]
              },
              "transform": {
                "req": "`reqdata`",
                "res": "`body`"
              },
              "active": true,
              "index$": 0
            }
          ],
          "input": "data",
          "key$": "remove"
        }
      },
      "relations": {
        "ancestors": [
          [
            "inbox"
          ]
        ]
      }
    },
    "inbox": {
      "fields": [
        {
          "name": "domain",
          "req": false,
          "type": "`$STRING`",
          "active": true,
          "index$": 0
        },
        {
          "name": "email",
          "req": false,
          "type": "`$ARRAY`",
          "active": true,
          "index$": 1
        },
        {
          "name": "token",
          "req": false,
          "type": "`$STRING`",
          "active": true,
          "index$": 2
        },
        {
          "name": "username",
          "req": true,
          "type": "`$STRING`",
          "active": true,
          "index$": 3
        }
      ],
      "name": "inbox",
      "op": {
        "create": {
          "name": "create",
          "points": [
            {
              "method": "POST",
              "orig": "/inbox/create",
              "parts": [
                "inbox",
                "create"
              ],
              "select": {
                "$action": "create"
              },
              "transform": {
                "req": "`reqdata`",
                "res": "`body`"
              },
              "active": true,
              "args": {},
              "index$": 0
            },
            {
              "method": "POST",
              "orig": "/inbox/custom",
              "parts": [
                "inbox",
                "custom"
              ],
              "select": {
                "$action": "custom"
              },
              "transform": {
                "req": "`reqdata`",
                "res": "`body`"
              },
              "active": true,
              "args": {},
              "index$": 1
            }
          ],
          "input": "data",
          "key$": "create"
        },
        "load": {
          "name": "load",
          "points": [
            {
              "args": {
                "params": [
                  {
                    "kind": "param",
                    "name": "id",
                    "orig": "token",
                    "reqd": true,
                    "type": "`$STRING`",
                    "active": true
                  }
                ]
              },
              "method": "GET",
              "orig": "/inbox/{token}",
              "parts": [
                "inbox",
                "{id}"
              ],
              "rename": {
                "param": {
                  "token": "id"
                }
              },
              "select": {
                "exist": [
                  "id"
                ]
              },
              "transform": {
                "req": "`reqdata`",
                "res": "`body`"
              },
              "active": true,
              "index$": 0
            }
          ],
          "input": "data",
          "key$": "load"
        },
        "remove": {
          "name": "remove",
          "points": [
            {
              "args": {
                "params": [
                  {
                    "kind": "param",
                    "name": "id",
                    "orig": "token",
                    "reqd": true,
                    "type": "`$STRING`",
                    "active": true
                  }
                ]
              },
              "method": "DELETE",
              "orig": "/inbox/{token}",
              "parts": [
                "inbox",
                "{id}"
              ],
              "rename": {
                "param": {
                  "token": "id"
                }
              },
              "select": {
                "exist": [
                  "id"
                ]
              },
              "transform": {
                "req": "`reqdata`",
                "res": "`body`"
              },
              "active": true,
              "index$": 0
            }
          ],
          "input": "data",
          "key$": "remove"
        }
      },
      "relations": {
        "ancestors": []
      }
    }
  }
}


const config = new Config()

export {
  config
}

