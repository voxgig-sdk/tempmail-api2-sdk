-- TempmailApi2 SDK configuration

-- Build a fresh, fully materialised config table. Every call rebuilds the
-- whole structure, so prefer require("config_shared") unless you need a
-- private copy you intend to mutate.
local function make_config()
  return {
    main = {
      name = "TempmailApi2",
    },
    feature = {
      ["test"] = {
        ["options"] = {
          ["active"] = false,
        },
      },
    },
    options = {
      base = "https://api.tempmail.lol/v2",
      headers = {
        ["content-type"] = "application/json",
      },
      entity = {
        ["domain"] = {},
        ["email"] = {},
        ["inbox"] = {},
      },
    },
    entity = {
      ["domain"] = {
        ["fields"] = {
          {
            ["name"] = "domains",
            ["type"] = "`$ARRAY`",
          },
        },
        ["name"] = "domain",
        ["op"] = {
          ["list"] = {
            ["input"] = "data",
            ["name"] = "list",
            ["points"] = {
              {
                ["args"] = {},
                ["kind"] = "http",
                ["method"] = "GET",
                ["orig"] = "/domains",
                ["parts"] = {
                  "domains",
                },
                ["select"] = {},
                ["transform"] = {
                  ["req"] = "`reqdata`",
                  ["res"] = "`body.domains`",
                },
              },
            },
          },
        },
        ["relations"] = {
          ["ancestors"] = {},
        },
      },
      ["email"] = {
        ["fields"] = {
          {
            ["name"] = "attachments",
            ["type"] = "`$ARRAY`",
          },
          {
            ["name"] = "body",
            ["type"] = "`$STRING`",
          },
          {
            ["name"] = "date",
            ["type"] = "`$STRING`",
          },
          {
            ["name"] = "from",
            ["type"] = "`$STRING`",
          },
          {
            ["name"] = "html",
            ["type"] = "`$STRING`",
          },
          {
            ["name"] = "id",
            ["type"] = "`$STRING`",
          },
          {
            ["name"] = "subject",
            ["type"] = "`$STRING`",
          },
          {
            ["name"] = "to",
            ["type"] = "`$STRING`",
          },
        },
        ["name"] = "email",
        ["op"] = {
          ["load"] = {
            ["input"] = "data",
            ["name"] = "load",
            ["points"] = {
              {
                ["args"] = {
                  ["params"] = {
                    {
                      ["kind"] = "param",
                      ["name"] = "email_id",
                      ["orig"] = "email_id",
                      ["reqd"] = true,
                      ["type"] = "`$STRING`",
                    },
                    {
                      ["kind"] = "param",
                      ["name"] = "token",
                      ["orig"] = "token",
                      ["reqd"] = true,
                      ["type"] = "`$STRING`",
                    },
                  },
                },
                ["kind"] = "http",
                ["method"] = "GET",
                ["orig"] = "/inbox/{token}/{emailId}",
                ["parts"] = {
                  "inbox",
                  "{token}",
                  "{email_id}",
                },
                ["rename"] = {
                  ["param"] = {
                    ["emailId"] = "email_id",
                  },
                },
                ["select"] = {
                  ["exist"] = {
                    "email_id",
                    "token",
                  },
                },
                ["transform"] = {
                  ["req"] = "`reqdata`",
                  ["res"] = "`body`",
                },
              },
            },
          },
          ["remove"] = {
            ["input"] = "data",
            ["name"] = "remove",
            ["points"] = {
              {
                ["args"] = {
                  ["params"] = {
                    {
                      ["kind"] = "param",
                      ["name"] = "email_id",
                      ["orig"] = "email_id",
                      ["reqd"] = true,
                      ["type"] = "`$STRING`",
                    },
                    {
                      ["kind"] = "param",
                      ["name"] = "token",
                      ["orig"] = "token",
                      ["reqd"] = true,
                      ["type"] = "`$STRING`",
                    },
                  },
                },
                ["kind"] = "http",
                ["method"] = "DELETE",
                ["orig"] = "/inbox/{token}/{emailId}",
                ["parts"] = {
                  "inbox",
                  "{token}",
                  "{email_id}",
                },
                ["rename"] = {
                  ["param"] = {
                    ["emailId"] = "email_id",
                  },
                },
                ["select"] = {
                  ["exist"] = {
                    "email_id",
                    "token",
                  },
                },
                ["transform"] = {
                  ["req"] = "`reqdata`",
                  ["res"] = "`body`",
                },
              },
            },
          },
        },
        ["relations"] = {
          ["ancestors"] = {
            {
              "inbox",
            },
          },
        },
      },
      ["inbox"] = {
        ["fields"] = {
          {
            ["name"] = "domain",
            ["type"] = "`$STRING`",
          },
          {
            ["name"] = "email",
            ["type"] = "`$STRING`",
          },
          {
            ["name"] = "emails",
            ["type"] = "`$ARRAY`",
          },
          {
            ["name"] = "token",
            ["type"] = "`$STRING`",
          },
          {
            ["name"] = "username",
            ["req"] = true,
            ["type"] = "`$STRING`",
          },
        },
        ["name"] = "inbox",
        ["op"] = {
          ["create"] = {
            ["input"] = "data",
            ["name"] = "create",
            ["points"] = {
              {
                ["args"] = {},
                ["kind"] = "http",
                ["method"] = "POST",
                ["orig"] = "/inbox/create",
                ["parts"] = {
                  "inbox",
                  "create",
                },
                ["select"] = {
                  ["$action"] = "create",
                },
                ["transform"] = {
                  ["req"] = "`reqdata`",
                  ["res"] = "`body`",
                },
              },
              {
                ["args"] = {},
                ["kind"] = "http",
                ["method"] = "POST",
                ["orig"] = "/inbox/custom",
                ["parts"] = {
                  "inbox",
                  "custom",
                },
                ["select"] = {
                  ["$action"] = "custom",
                },
                ["transform"] = {
                  ["req"] = "`reqdata`",
                  ["res"] = "`body`",
                },
              },
            },
          },
          ["load"] = {
            ["input"] = "data",
            ["name"] = "load",
            ["points"] = {
              {
                ["args"] = {
                  ["params"] = {
                    {
                      ["kind"] = "param",
                      ["name"] = "id",
                      ["orig"] = "token",
                      ["reqd"] = true,
                      ["type"] = "`$STRING`",
                    },
                  },
                },
                ["kind"] = "http",
                ["method"] = "GET",
                ["orig"] = "/inbox/{token}",
                ["parts"] = {
                  "inbox",
                  "{id}",
                },
                ["rename"] = {
                  ["param"] = {
                    ["token"] = "id",
                  },
                },
                ["select"] = {
                  ["exist"] = {
                    "id",
                  },
                },
                ["transform"] = {
                  ["req"] = "`reqdata`",
                  ["res"] = "`body`",
                },
              },
            },
          },
          ["remove"] = {
            ["input"] = "data",
            ["name"] = "remove",
            ["points"] = {
              {
                ["args"] = {
                  ["params"] = {
                    {
                      ["kind"] = "param",
                      ["name"] = "id",
                      ["orig"] = "token",
                      ["reqd"] = true,
                      ["type"] = "`$STRING`",
                    },
                  },
                },
                ["kind"] = "http",
                ["method"] = "DELETE",
                ["orig"] = "/inbox/{token}",
                ["parts"] = {
                  "inbox",
                  "{id}",
                },
                ["rename"] = {
                  ["param"] = {
                    ["token"] = "id",
                  },
                },
                ["select"] = {
                  ["exist"] = {
                    "id",
                  },
                },
                ["transform"] = {
                  ["req"] = "`reqdata`",
                  ["res"] = "`body`",
                },
              },
            },
          },
        },
        ["relations"] = {
          ["ancestors"] = {},
        },
      },
    },
  }
end


local function make_feature(name)
  local features = require("features")
  local factory = features[name]
  if factory ~= nil then
    return factory()
  end
  return features.base()
end


-- Attach make_feature to the SDK class
local function setup_sdk(SDK)
  SDK._make_feature = make_feature
end


return make_config
