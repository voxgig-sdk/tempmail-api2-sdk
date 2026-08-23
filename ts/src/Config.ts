
import { BaseFeature } from './feature/base/BaseFeature'
import { TestFeature } from './feature/test/TestFeature'



const FEATURE_CLASS: Record<string, typeof BaseFeature> = {
   test: TestFeature,

}


class Config {

  makeFeature(this: any, fn: string) {
    const fc = FEATURE_CLASS[fn]
    const fi = new fc()
    // TODO: errors etc
    return fi
  }

  // False for a feature added at runtime via options.extend (station's
  // adopt path) - the constructor uses this to skip makeFeature for names
  // no generated class backs.
  hasFeature(this: any, fn: string) {
    return null != FEATURE_CLASS[fn]
  }


  main = {
    name: 'TempmailApi2',
        slug: "tempmail-api2",
    version: "0.0.1",
    target: "ts",

  }


  feature = {
     test:     {
      "options": {
        "active": false
      }
    },

  }


  options = {
    base: "https://api.tempmail.lol/v2",

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
          "name": "domains",
          "type": "`$ARRAY`"
        }
      ],
      "name": "domain",
      "op": {
        "list": {
          "input": "data",
          "name": "list",
          "points": [
            {
              "args": {},
              "kind": "http",
              "method": "GET",
              "orig": "/domains",
              "parts": [
                "domains"
              ],
              "select": {},
              "transform": {
                "req": "`reqdata`",
                "res": "`body.domains`"
              }
            }
          ]
        }
      },
      "relations": {
        "ancestors": []
      }
    },
    "email": {
      "fields": [
        {
          "name": "attachments",
          "type": "`$ARRAY`"
        },
        {
          "name": "body",
          "short": "Email body content",
          "type": "`$STRING`"
        },
        {
          "name": "date",
          "short": "Timestamp when email was received",
          "type": "`$STRING`"
        },
        {
          "name": "from",
          "short": "Sender email address",
          "type": "`$STRING`"
        },
        {
          "name": "html",
          "short": "HTML version of email body",
          "type": "`$STRING`"
        },
        {
          "name": "id",
          "short": "Unique identifier for the email",
          "type": "`$STRING`"
        },
        {
          "name": "subject",
          "short": "Email subject",
          "type": "`$STRING`"
        },
        {
          "name": "to",
          "short": "Recipient email address",
          "type": "`$STRING`"
        }
      ],
      "name": "email",
      "op": {
        "load": {
          "input": "data",
          "name": "load",
          "points": [
            {
              "args": {
                "params": [
                  {
                    "kind": "param",
                    "name": "email_id",
                    "orig": "email_id",
                    "reqd": true,
                    "type": "`$STRING`"
                  },
                  {
                    "kind": "param",
                    "name": "token",
                    "orig": "token",
                    "reqd": true,
                    "type": "`$STRING`"
                  }
                ]
              },
              "kind": "http",
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
              }
            }
          ]
        },
        "remove": {
          "input": "data",
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
                    "type": "`$STRING`"
                  },
                  {
                    "kind": "param",
                    "name": "token",
                    "orig": "token",
                    "reqd": true,
                    "type": "`$STRING`"
                  }
                ]
              },
              "kind": "http",
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
              }
            }
          ]
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
          "short": "Domain for the email address (optional)",
          "type": "`$STRING`"
        },
        {
          "name": "email",
          "short": "The generated temporary email address",
          "type": "`$STRING`"
        },
        {
          "name": "emails",
          "type": "`$ARRAY`"
        },
        {
          "name": "token",
          "short": "Authentication token for accessing the inbox",
          "type": "`$STRING`"
        },
        {
          "name": "username",
          "req": true,
          "short": "Desired username for the email address",
          "type": "`$STRING`"
        }
      ],
      "name": "inbox",
      "op": {
        "create": {
          "input": "data",
          "name": "create",
          "points": [
            {
              "args": {},
              "kind": "http",
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
              }
            },
            {
              "args": {},
              "kind": "http",
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
              }
            }
          ]
        },
        "load": {
          "input": "data",
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
                    "type": "`$STRING`"
                  }
                ]
              },
              "kind": "http",
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
              }
            }
          ]
        },
        "remove": {
          "input": "data",
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
                    "type": "`$STRING`"
                  }
                ]
              },
              "kind": "http",
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
              }
            }
          ]
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

