-- Email entity test

local json = require("dkjson")
local vs = require("utility.struct.struct")
local sdk = require("tempmail-api2_sdk")
local helpers = require("core.helpers")
local runner = require("test.runner")

local _test_dir = debug.getinfo(1, "S").source:match("^@(.+/)")  or "./"

describe("EmailEntity", function()
  it("should create instance", function()
    local testsdk = sdk.test(nil, nil)
    local ent = testsdk:Email(nil)
    assert.is_not_nil(ent)
  end)

  it("should run basic flow", function()
    local setup = email_basic_setup(nil)
    -- Per-op sdk-test-control.json skip.
    local _live = setup.live or false
    for _, _op in ipairs({"list", "remove"}) do
      local _should_skip, _reason = runner.is_control_skipped("entityOp", "email." .. _op, _live and "live" or "unit")
      if _should_skip then
        pending(_reason or "skipped via sdk-test-control.json")
        return
      end
    end
    -- The basic flow consumes synthetic IDs from the fixture. In live mode
    -- without an *_ENTID env override, those IDs hit the live API and 4xx.
    if setup.synthetic_only then
      pending("live entity test uses synthetic IDs from fixture — set TEMPMAILAPI__TEST_EMAIL_ENTID JSON to run live")
      return
    end
    local client = setup.client

    -- Bootstrap entity data from existing test data.
    local email_ref01_data_raw = vs.items(helpers.to_map(
      vs.getpath(setup.data, "existing.email")))
    local email_ref01_data = nil
    if #email_ref01_data_raw > 0 then
      email_ref01_data = helpers.to_map(email_ref01_data_raw[1][2])
    end

    -- LIST
    local email_ref01_ent = client:Email(nil)
    local email_ref01_match = {
      ["email_id"] = setup.idmap["email01"],
      ["token"] = setup.idmap["token01"],
    }

    local email_ref01_list_result, err = email_ref01_ent:list(email_ref01_match, nil)
    assert.is_nil(err)
    assert.is_table(email_ref01_list_result)

    -- REMOVE
    local email_ref01_match_rm0 = {
      id = email_ref01_data["id"],
    }
    local _, err = email_ref01_ent:remove(email_ref01_match_rm0, nil)
    assert.is_nil(err)

    -- LIST
    local email_ref01_match_rt0 = {
      ["email_id"] = setup.idmap["email01"],
      ["token"] = setup.idmap["token01"],
    }

    local email_ref01_list_rt0_result, err = email_ref01_ent:list(email_ref01_match_rt0, nil)
    assert.is_nil(err)
    assert.is_table(email_ref01_list_rt0_result)

  end)
end)

function email_basic_setup(extra)
  runner.load_env_local()

  local entity_data_file = _test_dir .. "../../.sdk/test/entity/email/EmailTestData.json"
  local f = io.open(entity_data_file, "r")
  if f == nil then
    error("failed to read email test data: " .. entity_data_file)
  end
  local entity_data_source = f:read("*a")
  f:close()

  local entity_data = json.decode(entity_data_source)

  local options = {}
  options["entity"] = entity_data["existing"]

  local client = sdk.test(options, extra)

  -- Generate idmap via transform.
  local idmap = vs.transform(
    { "email01", "email02", "email03", "inbox01", "inbox02", "inbox03", "token01" },
    {
      ["`$PACK`"] = { "", {
        ["`$KEY`"] = "`$COPY`",
        ["`$VAL`"] = { "`$FORMAT`", "upper", "`$COPY`" },
      }},
    }
  )

  -- Detect ENTID env override before envOverride consumes it. When live
  -- mode is on without a real override, the basic test runs against synthetic
  -- IDs from the fixture and 4xx's. Surface this so the test can skip.
  local entid_env_raw = os.getenv("TEMPMAILAPI__TEST_EMAIL_ENTID")
  local idmap_overridden = entid_env_raw ~= nil and entid_env_raw:match("^%s*{") ~= nil

  local env = runner.env_override({
    ["TEMPMAILAPI__TEST_EMAIL_ENTID"] = idmap,
    ["TEMPMAILAPI__TEST_LIVE"] = "FALSE",
    ["TEMPMAILAPI__TEST_EXPLAIN"] = "FALSE",
    ["TEMPMAILAPI__APIKEY"] = "NONE",
  })

  local idmap_resolved = helpers.to_map(
    env["TEMPMAILAPI__TEST_EMAIL_ENTID"])
  if idmap_resolved == nil then
    idmap_resolved = helpers.to_map(idmap)
  end

  if env["TEMPMAILAPI__TEST_LIVE"] == "TRUE" then
    local merged_opts = vs.merge({
      {
        apikey = env["TEMPMAILAPI__APIKEY"],
      },
      extra or {},
    })
    client = sdk.new(helpers.to_map(merged_opts))
  end

  local live = env["TEMPMAILAPI__TEST_LIVE"] == "TRUE"
  return {
    client = client,
    data = entity_data,
    idmap = idmap_resolved,
    env = env,
    explain = env["TEMPMAILAPI__TEST_EXPLAIN"] == "TRUE",
    live = live,
    synthetic_only = live and not idmap_overridden,
    now = os.time() * 1000,
  }
end
