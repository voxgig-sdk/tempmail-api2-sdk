# TempmailApi2 SDK configuration

module TempmailApi2Config
  # Return the process-wide config, built once on first use. The SDK reads
  # the config on every request and never writes to it, so one instance is
  # shared by every client rather than rebuilt per client.
  #
  # The returned hash is shared: treat it as read-only. Callers that need to
  # mutate should use make_config, which always returns a fresh copy.
  def self.shared_config
    @shared_config ||= make_config
  end


  # Build a fresh, fully materialised config hash. Every call rebuilds the
  # whole structure, so prefer shared_config unless you need a private copy
  # you intend to mutate.
  def self.make_config
    {
      "main" => {
        "name" => "TempmailApi2",
        "slug" => "tempmail-api2",
        "version" => "0.0.1",
        "target" => "rb",
      },
      "feature" => {
        "test" => {
          "options" => {
            "active" => false,
          },
        },
      },
      "options" => {
        "base" => "https://api.tempmail.lol/v2",
        "headers" => {
          "content-type" => "application/json",
        },
        "entity" => {
          "domain" => {},
          "email" => {},
          "inbox" => {},
        },
      },
      "entity" => {
        "domain" => {
          "fields" => [
            {
              "name" => "domains",
              "type" => "`$ARRAY`",
            },
          ],
          "name" => "domain",
          "op" => {
            "list" => {
              "input" => "data",
              "name" => "list",
              "points" => [
                {
                  "args" => {},
                  "kind" => "http",
                  "method" => "GET",
                  "orig" => "/domains",
                  "parts" => [
                    "domains",
                  ],
                  "select" => {},
                  "transform" => {
                    "req" => "`reqdata`",
                    "res" => "`body.domains`",
                  },
                },
              ],
            },
          },
          "relations" => {
            "ancestors" => [],
          },
        },
        "email" => {
          "fields" => [
            {
              "name" => "attachments",
              "type" => "`$ARRAY`",
            },
            {
              "name" => "body",
              "short" => "Email body content",
              "type" => "`$STRING`",
            },
            {
              "name" => "date",
              "short" => "Timestamp when email was received",
              "type" => "`$STRING`",
            },
            {
              "name" => "from",
              "short" => "Sender email address",
              "type" => "`$STRING`",
            },
            {
              "name" => "html",
              "short" => "HTML version of email body",
              "type" => "`$STRING`",
            },
            {
              "name" => "id",
              "short" => "Unique identifier for the email",
              "type" => "`$STRING`",
            },
            {
              "name" => "subject",
              "short" => "Email subject",
              "type" => "`$STRING`",
            },
            {
              "name" => "to",
              "short" => "Recipient email address",
              "type" => "`$STRING`",
            },
          ],
          "name" => "email",
          "op" => {
            "load" => {
              "input" => "data",
              "name" => "load",
              "points" => [
                {
                  "args" => {
                    "params" => [
                      {
                        "kind" => "param",
                        "name" => "email_id",
                        "orig" => "email_id",
                        "reqd" => true,
                        "type" => "`$STRING`",
                      },
                      {
                        "kind" => "param",
                        "name" => "token",
                        "orig" => "token",
                        "reqd" => true,
                        "type" => "`$STRING`",
                      },
                    ],
                  },
                  "kind" => "http",
                  "method" => "GET",
                  "orig" => "/inbox/{token}/{emailId}",
                  "parts" => [
                    "inbox",
                    "{token}",
                    "{email_id}",
                  ],
                  "rename" => {
                    "param" => {
                      "emailId" => "email_id",
                    },
                  },
                  "select" => {
                    "exist" => [
                      "email_id",
                      "token",
                    ],
                  },
                  "transform" => {
                    "req" => "`reqdata`",
                    "res" => "`body`",
                  },
                },
              ],
            },
            "remove" => {
              "input" => "data",
              "name" => "remove",
              "points" => [
                {
                  "args" => {
                    "params" => [
                      {
                        "kind" => "param",
                        "name" => "email_id",
                        "orig" => "email_id",
                        "reqd" => true,
                        "type" => "`$STRING`",
                      },
                      {
                        "kind" => "param",
                        "name" => "token",
                        "orig" => "token",
                        "reqd" => true,
                        "type" => "`$STRING`",
                      },
                    ],
                  },
                  "kind" => "http",
                  "method" => "DELETE",
                  "orig" => "/inbox/{token}/{emailId}",
                  "parts" => [
                    "inbox",
                    "{token}",
                    "{email_id}",
                  ],
                  "rename" => {
                    "param" => {
                      "emailId" => "email_id",
                    },
                  },
                  "select" => {
                    "exist" => [
                      "email_id",
                      "token",
                    ],
                  },
                  "transform" => {
                    "req" => "`reqdata`",
                    "res" => "`body`",
                  },
                },
              ],
            },
          },
          "relations" => {
            "ancestors" => [
              [
                "inbox",
              ],
            ],
          },
        },
        "inbox" => {
          "fields" => [
            {
              "name" => "domain",
              "short" => "Domain for the email address (optional)",
              "type" => "`$STRING`",
            },
            {
              "name" => "email",
              "short" => "The generated temporary email address",
              "type" => "`$STRING`",
            },
            {
              "name" => "emails",
              "type" => "`$ARRAY`",
            },
            {
              "name" => "token",
              "short" => "Authentication token for accessing the inbox",
              "type" => "`$STRING`",
            },
            {
              "name" => "username",
              "req" => true,
              "short" => "Desired username for the email address",
              "type" => "`$STRING`",
            },
          ],
          "name" => "inbox",
          "op" => {
            "create" => {
              "input" => "data",
              "name" => "create",
              "points" => [
                {
                  "args" => {},
                  "kind" => "http",
                  "method" => "POST",
                  "orig" => "/inbox/create",
                  "parts" => [
                    "inbox",
                    "create",
                  ],
                  "select" => {
                    "$action" => "create",
                  },
                  "transform" => {
                    "req" => "`reqdata`",
                    "res" => "`body`",
                  },
                },
                {
                  "args" => {},
                  "kind" => "http",
                  "method" => "POST",
                  "orig" => "/inbox/custom",
                  "parts" => [
                    "inbox",
                    "custom",
                  ],
                  "select" => {
                    "$action" => "custom",
                  },
                  "transform" => {
                    "req" => "`reqdata`",
                    "res" => "`body`",
                  },
                },
              ],
            },
            "load" => {
              "input" => "data",
              "name" => "load",
              "points" => [
                {
                  "args" => {
                    "params" => [
                      {
                        "kind" => "param",
                        "name" => "id",
                        "orig" => "token",
                        "reqd" => true,
                        "type" => "`$STRING`",
                      },
                    ],
                  },
                  "kind" => "http",
                  "method" => "GET",
                  "orig" => "/inbox/{token}",
                  "parts" => [
                    "inbox",
                    "{id}",
                  ],
                  "rename" => {
                    "param" => {
                      "token" => "id",
                    },
                  },
                  "select" => {
                    "exist" => [
                      "id",
                    ],
                  },
                  "transform" => {
                    "req" => "`reqdata`",
                    "res" => "`body`",
                  },
                },
              ],
            },
            "remove" => {
              "input" => "data",
              "name" => "remove",
              "points" => [
                {
                  "args" => {
                    "params" => [
                      {
                        "kind" => "param",
                        "name" => "id",
                        "orig" => "token",
                        "reqd" => true,
                        "type" => "`$STRING`",
                      },
                    ],
                  },
                  "kind" => "http",
                  "method" => "DELETE",
                  "orig" => "/inbox/{token}",
                  "parts" => [
                    "inbox",
                    "{id}",
                  ],
                  "rename" => {
                    "param" => {
                      "token" => "id",
                    },
                  },
                  "select" => {
                    "exist" => [
                      "id",
                    ],
                  },
                  "transform" => {
                    "req" => "`reqdata`",
                    "res" => "`body`",
                  },
                },
              ],
            },
          },
          "relations" => {
            "ancestors" => [],
          },
        },
      },
    }
  end


  def self.make_feature(name)
    require_relative 'features'
    TempmailApi2Features.make_feature(name)
  end
end
