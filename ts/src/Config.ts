
import { BaseFeature } from './feature/base/BaseFeature'
import { RatelimitFeature } from './feature/ratelimit/RatelimitFeature'
import { RetryFeature } from './feature/retry/RetryFeature'
import { TestFeature } from './feature/test/TestFeature'
import { TimeoutFeature } from './feature/timeout/TimeoutFeature'



const FEATURE_CLASS: Record<string, typeof BaseFeature> = {
   ratelimit: RatelimitFeature,
 retry: RetryFeature,
 test: TestFeature,
 timeout: TimeoutFeature,

}


// Per-feature plugin DEFINITIONS (voxgig/plugin `Definition` values), from
// the model's active plugin groups. A feature that takes a `plugins` option
// (secrets over sekreto) reads its own entry; a feature with no plugins has
// none. Named imports above make each definition statically reachable, so
// an SDK carries exactly the plugin modules its model selects — the same
// leanness the old side-effect registry imports bought, without a registry.
const FEATURE_PLUGINS: Record<string, any[]> = {
  
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
     ratelimit:     {
      "options": {
        "active": false,
        "burst": 5,
        "rate": 5
      },
      "optspec": {
        "now": "`$FUNCTION`",
        "sleep": "`$FUNCTION`"
      },
      "strict": false,
      "transport": "wrap"
    },
 retry:     {
      "options": {
        "active": false,
        "factor": 2,
        "maxDelay": 2000,
        "minDelay": 50,
        "retries": 2,
        "statuses": [
          408,
          425,
          429,
          500,
          502,
          503,
          504
        ]
      },
      "optspec": {
        "jitter": "`$BOOLEAN`",
        "sleep": "`$FUNCTION`"
      },
      "strict": false,
      "transport": "wrap"
    },
 test:     {
      "options": {
        "active": false
      },
      "optspec": {
        "entity": "`$MAP`",
        "net": "`$MAP`"
      },
      "strict": false,
      "transport": "base"
    },
 timeout:     {
      "options": {
        "active": false,
        "ms": 30000
      },
      "optspec": {
        "clearTimer": "`$FUNCTION`",
        "setTimer": "`$FUNCTION`"
      },
      "strict": false,
      "transport": "wrap"
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
              "segments": [
                {
                  "lit": "domains"
                }
              ],
              "select": {},
              "transform": {
                "req": "`reqdata`",
                "res": "`body.domains`"
              },
              "parts": [
                "domains"
              ]
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
          "format": "date-time",
          "name": "date",
          "short": "Timestamp when email was received",
          "type": "`$STRING`"
        },
        {
          "format": "email",
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
          "format": "email",
          "name": "to",
          "short": "Recipient email address",
          "type": "`$STRING`"
        }
      ],
      "id": {
        "field": "id",
        "name": "id",
        "parts": [
          "token",
          "email_id"
        ],
        "sep": "/"
      },
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
              "rename": {
                "param": {
                  "emailId": "email_id"
                }
              },
              "segments": [
                {
                  "lit": "inbox"
                },
                {
                  "var": "token"
                },
                {
                  "var": "email_id"
                }
              ],
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
              "parts": [
                "inbox",
                "{token}",
                "{email_id}"
              ]
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
              "rename": {
                "param": {
                  "emailId": "email_id"
                }
              },
              "segments": [
                {
                  "lit": "inbox"
                },
                {
                  "var": "token"
                },
                {
                  "var": "email_id"
                }
              ],
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
              "parts": [
                "inbox",
                "{token}",
                "{email_id}"
              ]
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
          "format": "email",
          "name": "email",
          "short": "The generated temporary email address",
          "type": "`$STRING`"
        },
        {
          "name": "emails",
          "type": "`$ARRAY`"
        },
        {
          "name": "id",
          "type": "`$STRING`"
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
      "id": {
        "field": "id",
        "name": "id"
      },
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
              "segments": [
                {
                  "lit": "inbox"
                },
                {
                  "lit": "create"
                }
              ],
              "select": {
                "$action": "create"
              },
              "transform": {
                "req": "`reqdata`",
                "res": "`body`"
              },
              "parts": [
                "inbox",
                "create"
              ]
            },
            {
              "args": {},
              "kind": "http",
              "method": "POST",
              "orig": "/inbox/custom",
              "segments": [
                {
                  "lit": "inbox"
                },
                {
                  "lit": "custom"
                }
              ],
              "select": {
                "$action": "custom"
              },
              "transform": {
                "req": "`reqdata`",
                "res": "`body`"
              },
              "parts": [
                "inbox",
                "custom"
              ]
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
              "rename": {
                "param": {
                  "token": "id"
                }
              },
              "segments": [
                {
                  "lit": "inbox"
                },
                {
                  "var": "id"
                }
              ],
              "select": {
                "exist": [
                  "id"
                ]
              },
              "transform": {
                "req": "`reqdata`",
                "res": "`body`"
              },
              "parts": [
                "inbox",
                "{id}"
              ]
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
              "rename": {
                "param": {
                  "token": "id"
                }
              },
              "segments": [
                {
                  "lit": "inbox"
                },
                {
                  "var": "id"
                }
              ],
              "select": {
                "exist": [
                  "id"
                ]
              },
              "transform": {
                "req": "`reqdata`",
                "res": "`body`"
              },
              "parts": [
                "inbox",
                "{id}"
              ]
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
  config,
  FEATURE_PLUGINS,
}

