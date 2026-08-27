# Inbox entity test

require "minitest/autorun"
require "json"
require_relative "../TempmailApi2_sdk"
require_relative "runner"

class InboxEntityTest < Minitest::Test
  def test_create_instance
    testsdk = TempmailApi2SDK.test(nil, nil)
    ent = testsdk.Inbox(nil)
    assert !ent.nil?
  end

  def test_basic_flow
    setup = inbox_basic_setup(nil)
    # Per-op sdk-test-control.json skip.
    _live = setup[:live] || false
    ["create", "load", "remove"].each do |_op|
      _should_skip, _reason = Runner.is_control_skipped("entityOp", "inbox." + _op, _live ? "live" : "unit")
      if _should_skip
        skip(_reason || "skipped via sdk-test-control.json")
        return
      end
    end
    # The basic flow consumes synthetic IDs from the fixture. In live mode
    # without an *_ENTID env override, those IDs hit the live API and 4xx.
    if setup[:synthetic_only]
      skip "live entity test uses synthetic IDs from fixture — set TEMPMAIL_API2_TEST_INBOX_ENTID JSON to run live"
      return
    end
    client = setup[:client]

    # CREATE
    inbox_ref01_ent = client.Inbox(nil)
    inbox_ref01_data = Helpers.to_map(Vs.getprop(
      Vs.getpath(setup[:data], "new.inbox"), "inbox_ref01"))

    inbox_ref01_data_result = inbox_ref01_ent.create(inbox_ref01_data, nil)
    inbox_ref01_data = Helpers.to_map(inbox_ref01_data_result.respond_to?(:data_get) ? inbox_ref01_data_result.data_get : inbox_ref01_data_result)
    assert !inbox_ref01_data.nil?
    assert !inbox_ref01_data["id"].nil?

    # LOAD
    inbox_ref01_match_dt0 = {
      "id" => inbox_ref01_data["id"],
    }
    inbox_ref01_data_dt0_loaded = inbox_ref01_ent.load(inbox_ref01_match_dt0, nil)
    inbox_ref01_data_dt0_load_result = Helpers.to_map(inbox_ref01_data_dt0_loaded.respond_to?(:data_get) ? inbox_ref01_data_dt0_loaded.data_get : inbox_ref01_data_dt0_loaded)
    assert !inbox_ref01_data_dt0_load_result.nil?
    assert_equal inbox_ref01_data_dt0_load_result["id"], inbox_ref01_data["id"]

    # REMOVE
    inbox_ref01_match_rm0 = {
      "id" => inbox_ref01_data["id"],
    }
    inbox_ref01_ent.remove(inbox_ref01_match_rm0, nil)

  end
end

def inbox_basic_setup(extra)
  Runner.load_env_local

  entity_data_file = File.join(__dir__, "..", "..", ".sdk", "test", "entity", "inbox", "InboxTestData.json")
  entity_data_source = File.read(entity_data_file)
  entity_data = JSON.parse(entity_data_source)

  options = {}
  options["entity"] = entity_data["existing"]

  client = TempmailApi2SDK.test(options, extra)

  # Generate idmap via transform.
  idmap = Vs.transform(
    ["inbox01", "inbox02", "inbox03"],
    {
      "`$PACK`" => ["", {
        "`$KEY`" => "`$COPY`",
        "`$VAL`" => ["`$FORMAT`", "upper", "`$COPY`"],
      }],
    }
  )

  # Detect ENTID env override before envOverride consumes it. When live
  # mode is on without a real override, the basic test runs against synthetic
  # IDs from the fixture and 4xx's. Surface this so the test can skip.
  entid_env_raw = ENV["TEMPMAIL_API2_TEST_INBOX_ENTID"]
  idmap_overridden = !entid_env_raw.nil? && entid_env_raw.strip.start_with?("{")

  env = Runner.env_override({
    "TEMPMAIL_API2_TEST_INBOX_ENTID" => idmap,
    "TEMPMAIL_API2_TEST_LIVE" => "FALSE",
    "TEMPMAIL_API2_TEST_EXPLAIN" => "FALSE",
  })

  idmap_resolved = Helpers.to_map(
    env["TEMPMAIL_API2_TEST_INBOX_ENTID"])
  if idmap_resolved.nil?
    idmap_resolved = Helpers.to_map(idmap)
  end

  if env["TEMPMAIL_API2_TEST_LIVE"] == "TRUE"
    merged_opts = Vs.merge([
      {
      },
      extra || {},
    ])
    client = TempmailApi2SDK.new(Helpers.to_map(merged_opts))
  end

  live = env["TEMPMAIL_API2_TEST_LIVE"] == "TRUE"
  {
    client: client,
    data: entity_data,
    idmap: idmap_resolved,
    env: env,
    explain: env["TEMPMAIL_API2_TEST_EXPLAIN"] == "TRUE",
    live: live,
    synthetic_only: live && !idmap_overridden,
    now: (Time.now.to_f * 1000).to_i,
  }
end
