# TempmailApi2 SDK configuration


# The sekreto plugin DEFINITIONS the model selected per feature, imported
# above by name from the modules the catalogue's active `plugin.def`
# entries declare. Handed to each feature (secrets builds its Sekreto
# with them): a provider kind not listed here is unknown to that SDK.
FEATURE_PLUGINS = {
}


_shared_config = None


def shared_config():
    """Return the process-wide config, built once on first use.

    The SDK reads the config on every request and never writes to it, so one
    instance is shared by every client rather than rebuilt per client.

    The returned dict is shared: treat it as read-only. Callers that need to
    mutate should use make_config, which always returns a fresh copy.
    """
    global _shared_config
    if _shared_config is None:
        _shared_config = make_config()
    return _shared_config


def make_config():
    """Build a fresh, fully materialised config dict.

    Every call rebuilds the whole structure, so prefer shared_config unless
    you need a private copy you intend to mutate.
    """
    return {
        "main": {
            "name": "TempmailApi2",
            "slug": "tempmail-api2",
            "version": "0.0.1",
            "target": "py",
        },
        "feature": {
            "ratelimit": {
        "options": {
          "active": False,
          "burst": 5,
          "rate": 5,
        },
        "optspec": {
          "now": "`$FUNCTION`",
          "sleep": "`$FUNCTION`",
        },
        "strict": False,
        "transport": "wrap",
      },
            "retry": {
        "options": {
          "active": False,
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
            504,
          ],
        },
        "optspec": {
          "jitter": "`$BOOLEAN`",
          "sleep": "`$FUNCTION`",
        },
        "strict": False,
        "transport": "wrap",
      },
            "test": {
        "options": {
          "active": False,
        },
        "optspec": {
          "entity": "`$MAP`",
          "net": "`$MAP`",
        },
        "strict": False,
        "transport": "base",
      },
            "timeout": {
        "options": {
          "active": False,
          "ms": 30000,
        },
        "optspec": {
          "clearTimer": "`$FUNCTION`",
          "setTimer": "`$FUNCTION`",
        },
        "strict": False,
        "transport": "wrap",
      },
        },
        "options": {
            "base": "https://api.tempmail.lol/v2",
            "headers": {
        "content-type": "application/json",
      },
            "entity": {
                "domain": {},
                "email": {},
                "inbox": {},
            },
        },
        "entity": {
      "domain": {
        "fields": [
          {
            "name": "domains",
            "title": "Domains",
            "type": "`$ARRAY`",
          },
        ],
        "name": "domain",
        "op": {
          "list": {
            "input": "data",
            "name": "list",
            "points": [
              {
                "kind": "http",
                "method": "GET",
                "orig": "/domains",
                "segments": [
                  {
                    "lit": "domains",
                  },
                ],
                "parts": [
                  "domains",
                ],
                "rename": {},
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body.domains`",
                },
                "args": {},
                "select": {},
              },
            ],
          },
        },
        "relations": {
          "ancestors": [],
        },
      },
      "email": {
        "fields": [
          {
            "name": "attachments",
            "title": "Attachments",
            "type": "`$ARRAY`",
          },
          {
            "name": "body",
            "title": "Body",
            "type": "`$STRING`",
            "short": "Email body content",
          },
          {
            "name": "date",
            "title": "Date",
            "type": "`$STRING`",
            "short": "Timestamp when email was received",
            "format": "date-time",
          },
          {
            "name": "from",
            "title": "From",
            "type": "`$STRING`",
            "short": "Sender email address",
            "format": "email",
          },
          {
            "name": "html",
            "title": "Html",
            "type": "`$STRING`",
            "short": "HTML version of email body",
          },
          {
            "name": "id",
            "title": "Id",
            "type": "`$STRING`",
            "short": "Unique identifier for the email",
          },
          {
            "name": "subject",
            "title": "Subject",
            "type": "`$STRING`",
            "short": "Email subject",
          },
          {
            "name": "to",
            "title": "To",
            "type": "`$STRING`",
            "short": "Recipient email address",
            "format": "email",
          },
        ],
        "id": {
          "field": "id",
          "name": "id",
          "parts": [
            "token",
            "email_id",
          ],
          "sep": "/",
        },
        "name": "email",
        "op": {
          "load": {
            "input": "data",
            "name": "load",
            "points": [
              {
                "kind": "http",
                "method": "GET",
                "orig": "/inbox/{token}/{emailId}",
                "segments": [
                  {
                    "lit": "inbox",
                  },
                  {
                    "var": "token",
                  },
                  {
                    "var": "email_id",
                  },
                ],
                "parts": [
                  "inbox",
                  "{token}",
                  "{email_id}",
                ],
                "rename": {
                  "param": {
                    "emailId": "email_id",
                  },
                },
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body`",
                },
                "args": {
                  "params": [
                    {
                      "name": "email_id",
                      "orig": "email_id",
                      "type": "`$STRING`",
                      "kind": "param",
                      "reqd": True,
                    },
                    {
                      "name": "token",
                      "orig": "token",
                      "type": "`$STRING`",
                      "kind": "param",
                      "reqd": True,
                    },
                  ],
                },
                "select": {
                  "exist": [
                    "email_id",
                    "token",
                  ],
                },
              },
            ],
          },
          "remove": {
            "input": "data",
            "name": "remove",
            "points": [
              {
                "kind": "http",
                "method": "DELETE",
                "orig": "/inbox/{token}/{emailId}",
                "segments": [
                  {
                    "lit": "inbox",
                  },
                  {
                    "var": "token",
                  },
                  {
                    "var": "email_id",
                  },
                ],
                "parts": [
                  "inbox",
                  "{token}",
                  "{email_id}",
                ],
                "rename": {
                  "param": {
                    "emailId": "email_id",
                  },
                },
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body`",
                },
                "args": {
                  "params": [
                    {
                      "name": "email_id",
                      "orig": "email_id",
                      "type": "`$STRING`",
                      "kind": "param",
                      "reqd": True,
                    },
                    {
                      "name": "token",
                      "orig": "token",
                      "type": "`$STRING`",
                      "kind": "param",
                      "reqd": True,
                    },
                  ],
                },
                "select": {
                  "exist": [
                    "email_id",
                    "token",
                  ],
                },
              },
            ],
          },
        },
        "relations": {
          "ancestors": [
            [
              "$.main.kit.entity.inbox",
            ],
          ],
        },
      },
      "inbox": {
        "fields": [
          {
            "name": "emails",
            "title": "Emails",
            "type": "`$ARRAY`",
          },
          {
            "name": "id",
            "title": "Id",
            "type": "`$STRING`",
          },
        ],
        "id": {
          "field": "id",
          "name": "id",
        },
        "name": "inbox",
        "op": {
          "create": {
            "input": "data",
            "name": "create",
            "points": [
              {
                "kind": "http",
                "method": "POST",
                "orig": "/inbox/create",
                "segments": [
                  {
                    "lit": "inbox",
                  },
                  {
                    "lit": "create",
                  },
                ],
                "parts": [
                  "inbox",
                  "create",
                ],
                "rename": {},
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body`",
                },
                "args": {},
                "select": {
                  "$action": "create",
                },
              },
              {
                "kind": "http",
                "method": "POST",
                "orig": "/inbox/custom",
                "segments": [
                  {
                    "lit": "inbox",
                  },
                  {
                    "lit": "custom",
                  },
                ],
                "parts": [
                  "inbox",
                  "custom",
                ],
                "rename": {},
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body`",
                },
                "args": {},
                "select": {
                  "$action": "custom",
                },
              },
            ],
          },
          "load": {
            "input": "data",
            "name": "load",
            "points": [
              {
                "kind": "http",
                "method": "GET",
                "orig": "/inbox/{token}",
                "segments": [
                  {
                    "lit": "inbox",
                  },
                  {
                    "var": "id",
                  },
                ],
                "parts": [
                  "inbox",
                  "{id}",
                ],
                "rename": {
                  "param": {
                    "token": "id",
                  },
                },
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body`",
                },
                "args": {
                  "params": [
                    {
                      "name": "id",
                      "orig": "token",
                      "type": "`$STRING`",
                      "kind": "param",
                      "reqd": True,
                    },
                  ],
                },
                "select": {
                  "exist": [
                    "id",
                  ],
                },
              },
            ],
          },
          "remove": {
            "input": "data",
            "name": "remove",
            "points": [
              {
                "kind": "http",
                "method": "DELETE",
                "orig": "/inbox/{token}",
                "segments": [
                  {
                    "lit": "inbox",
                  },
                  {
                    "var": "id",
                  },
                ],
                "parts": [
                  "inbox",
                  "{id}",
                ],
                "rename": {
                  "param": {
                    "token": "id",
                  },
                },
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body`",
                },
                "args": {
                  "params": [
                    {
                      "name": "id",
                      "orig": "token",
                      "type": "`$STRING`",
                      "kind": "param",
                      "reqd": True,
                    },
                  ],
                },
                "select": {
                  "exist": [
                    "id",
                  ],
                },
              },
            ],
          },
        },
        "relations": {
          "ancestors": [],
        },
      },
    },
    }
