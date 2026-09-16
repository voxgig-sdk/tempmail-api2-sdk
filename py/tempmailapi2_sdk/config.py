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
                "args": {},
                "kind": "http",
                "method": "GET",
                "orig": "/domains",
                "segments": [
                  {
                    "lit": "domains",
                  },
                ],
                "select": {},
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body.domains`",
                },
                "parts": [
                  "domains",
                ],
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
            "type": "`$ARRAY`",
          },
          {
            "name": "body",
            "short": "Email body content",
            "type": "`$STRING`",
          },
          {
            "format": "date-time",
            "name": "date",
            "short": "Timestamp when email was received",
            "type": "`$STRING`",
          },
          {
            "format": "email",
            "name": "from",
            "short": "Sender email address",
            "type": "`$STRING`",
          },
          {
            "name": "html",
            "short": "HTML version of email body",
            "type": "`$STRING`",
          },
          {
            "name": "id",
            "short": "Unique identifier for the email",
            "type": "`$STRING`",
          },
          {
            "name": "subject",
            "short": "Email subject",
            "type": "`$STRING`",
          },
          {
            "format": "email",
            "name": "to",
            "short": "Recipient email address",
            "type": "`$STRING`",
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
                "args": {
                  "params": [
                    {
                      "kind": "param",
                      "name": "email_id",
                      "orig": "email_id",
                      "reqd": True,
                      "type": "`$STRING`",
                    },
                    {
                      "kind": "param",
                      "name": "token",
                      "orig": "token",
                      "reqd": True,
                      "type": "`$STRING`",
                    },
                  ],
                },
                "kind": "http",
                "method": "GET",
                "orig": "/inbox/{token}/{emailId}",
                "rename": {
                  "param": {
                    "emailId": "email_id",
                  },
                },
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
                "select": {
                  "exist": [
                    "email_id",
                    "token",
                  ],
                },
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body`",
                },
                "parts": [
                  "inbox",
                  "{token}",
                  "{email_id}",
                ],
              },
            ],
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
                      "reqd": True,
                      "type": "`$STRING`",
                    },
                    {
                      "kind": "param",
                      "name": "token",
                      "orig": "token",
                      "reqd": True,
                      "type": "`$STRING`",
                    },
                  ],
                },
                "kind": "http",
                "method": "DELETE",
                "orig": "/inbox/{token}/{emailId}",
                "rename": {
                  "param": {
                    "emailId": "email_id",
                  },
                },
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
                "select": {
                  "exist": [
                    "email_id",
                    "token",
                  ],
                },
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body`",
                },
                "parts": [
                  "inbox",
                  "{token}",
                  "{email_id}",
                ],
              },
            ],
          },
        },
        "relations": {
          "ancestors": [
            [
              "inbox",
            ],
          ],
        },
      },
      "inbox": {
        "fields": [
          {
            "name": "domain",
            "short": "Domain for the email address (optional)",
            "type": "`$STRING`",
          },
          {
            "format": "email",
            "name": "email",
            "short": "The generated temporary email address",
            "type": "`$STRING`",
          },
          {
            "name": "emails",
            "type": "`$ARRAY`",
          },
          {
            "name": "id",
            "type": "`$STRING`",
          },
          {
            "name": "token",
            "short": "Authentication token for accessing the inbox",
            "type": "`$STRING`",
          },
          {
            "name": "username",
            "req": True,
            "short": "Desired username for the email address",
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
                "args": {},
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
                "select": {
                  "$action": "create",
                },
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body`",
                },
                "parts": [
                  "inbox",
                  "create",
                ],
              },
              {
                "args": {},
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
                "select": {
                  "$action": "custom",
                },
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body`",
                },
                "parts": [
                  "inbox",
                  "custom",
                ],
              },
            ],
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
                      "reqd": True,
                      "type": "`$STRING`",
                    },
                  ],
                },
                "kind": "http",
                "method": "GET",
                "orig": "/inbox/{token}",
                "rename": {
                  "param": {
                    "token": "id",
                  },
                },
                "segments": [
                  {
                    "lit": "inbox",
                  },
                  {
                    "var": "id",
                  },
                ],
                "select": {
                  "exist": [
                    "id",
                  ],
                },
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body`",
                },
                "parts": [
                  "inbox",
                  "{id}",
                ],
              },
            ],
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
                      "reqd": True,
                      "type": "`$STRING`",
                    },
                  ],
                },
                "kind": "http",
                "method": "DELETE",
                "orig": "/inbox/{token}",
                "rename": {
                  "param": {
                    "token": "id",
                  },
                },
                "segments": [
                  {
                    "lit": "inbox",
                  },
                  {
                    "var": "id",
                  },
                ],
                "select": {
                  "exist": [
                    "id",
                  ],
                },
                "transform": {
                  "req": "`reqdata`",
                  "res": "`body`",
                },
                "parts": [
                  "inbox",
                  "{id}",
                ],
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
