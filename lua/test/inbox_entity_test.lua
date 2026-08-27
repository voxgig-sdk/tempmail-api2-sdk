-- Inbox entity test

local json = require("dkjson")
local vs = require("utility.struct.struct")
local sdk = require("tempmail-api2_sdk")
local helpers = require("core.helpers")
local runner = require("test.runner")

local _test_dir = debug.getinfo(1, "S").source:match("^@(.+/)")  or "./"

describe("InboxEntity", function()
  it("should create instance", function()
    local testsdk = sdk.test(nil, nil)
    local ent = testsdk:Inbox(nil)
    assert.is_not_nil(ent)
  end)

  it("should run basic flow", function()
    local setup = inbox_basic_setup(nil)
    -- Per-op sdk-test-control.json skip.
    local _live = setup.live or false
    for _, _op in ipairs({"create", "load", "remove"}) do
      local _should_skip, _reason = runner.is_control_skipped("entityOp", "inbox." .. _op, _live and "live" or "unit")
      if _should_skip then
        pending(_reason or "skipped via sdk-test-control.json")
        return
      end
    end
    -- The basic flow consumes synthetic IDs from the fixture. In live mode
    -- without an *_ENTID env override, those IDs hit the live API and 4xx.
    if setup.synthetic_only then
      pending("live entity test uses synthetic IDs from fixture — set TEMPMAIL_API2_TEST_INBOX_ENTID JSON to run live")
      return
    end
    local client = setup.client

    -- CREATE
    local inbox_ref01_ent = client:Inbox(nil)
    local inbox_ref01_data = helpers.to_map(vs.getprop(
      vs.getpath(setup.data, "new.inbox"), "inbox_ref01"))

    local inbox_ref01_data_result, err = inbox_ref01_ent:create(inbox_ref01_data, nil)
    assert.is_nil(err)
    inbox_ref01_data = helpers.to_map(type(inbox_ref01_data_result) == 'table' and inbox_ref01_data_result.data_get and inbox_ref01_data_result:data_get() or inbox_ref01_data_result)
    assert.is_not_nil(inbox_ref01_data)
    assert.is_not_nil(inbox_ref01_data["id"])

    -- LOAD
    local inbox_ref01_match_dt0 = {
      id = inbox_ref01_data["id"],
    }
    local inbox_ref01_data_dt0_loaded, err = inbox_ref01_ent:load(inbox_ref01_match_dt0, nil)
    assert.is_nil(err)
    local inbox_ref01_data_dt0_load_result = helpers.to_map(type(inbox_ref01_data_dt0_loaded) == 'table' and inbox_ref01_data_dt0_loaded.data_get and inbox_ref01_data_dt0_loaded:data_get() or inbox_ref01_data_dt0_loaded)
    assert.is_not_nil(inbox_ref01_data_dt0_load_result)
    assert.are.equal(inbox_ref01_data_dt0_load_result["id"], inbox_ref01_data["id"])

    -- REMOVE
    local inbox_ref01_match_rm0 = {
      id = inbox_ref01_data["id"],
    }
    local _, err = inbox_ref01_ent:remove(inbox_ref01_match_rm0, nil)
    assert.is_nil(err)

  end)
end)

function inbox_basic_setup(extra)
  runner.load_env_local()

  local entity_data_file = _test_dir .. "../../.sdk/test/entity/inbox/InboxTestData.json"
  local f = io.open(entity_data_file, "r")
  if f == nil then
    error("failed to read inbox test data: " .. entity_data_file)
  end
  local entity_data_source = f:read("*a")
  f:close()

  local entity_data = json.decode(entity_data_source)

  local options = {}
  options["entity"] = entity_data["existing"]

  local client = sdk.test(options, extra)

  -- Generate idmap via transform.
  local idmap = vs.transform(
    { "inbox01", "inbox02", "inbox03" },
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
  local entid_env_raw = os.getenv("TEMPMAIL_API2_TEST_INBOX_ENTID")
  local idmap_overridden = entid_env_raw ~= nil and entid_env_raw:match("^%s*{") ~= nil

  local env = runner.env_override({
    ["TEMPMAIL_API2_TEST_INBOX_ENTID"] = idmap,
    ["TEMPMAIL_API2_TEST_LIVE"] = "FALSE",
    ["TEMPMAIL_API2_TEST_EXPLAIN"] = "FALSE",
  })

  local idmap_resolved = helpers.to_map(
    env["TEMPMAIL_API2_TEST_INBOX_ENTID"])
  if idmap_resolved == nil then
    idmap_resolved = helpers.to_map(idmap)
  end

  if env["TEMPMAIL_API2_TEST_LIVE"] == "TRUE" then
    local merged_opts = vs.merge({
      {
      },
      extra or {},
    })
    client = sdk.new(helpers.to_map(merged_opts))
  end

  local live = env["TEMPMAIL_API2_TEST_LIVE"] == "TRUE"
  return {
    client = client,
    data = entity_data,
    idmap = idmap_resolved,
    env = env,
    explain = env["TEMPMAIL_API2_TEST_EXPLAIN"] == "TRUE",
    live = live,
    synthetic_only = live and not idmap_overridden,
    now = os.time() * 1000,
  }
end
