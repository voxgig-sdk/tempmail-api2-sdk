# Email entity test

require "minitest/autorun"
require "json"
require_relative "../TempmailApi2_sdk"
require_relative "runner"

class EmailEntityTest < Minitest::Test
  def test_create_instance
    testsdk = TempmailApi2SDK.test(nil, nil)
    ent = testsdk.Email(nil)
    assert !ent.nil?
  end

  def test_basic_flow
    setup = email_basic_setup(nil)
    # Per-op sdk-test-control.json skip.
    _live = setup[:live] || false
    ["load"].each do |_op|
      _should_skip, _reason = Runner.is_control_skipped("entityOp", "email." + _op, _live ? "live" : "unit")
      if _should_skip
        skip(_reason || "skipped via sdk-test-control.json")
        return
      end
    end
    # The basic flow consumes synthetic IDs from the fixture. In live mode
    # without an *_ENTID env override, those IDs hit the live API and 4xx.
    if setup[:synthetic_only]
      skip "live entity test uses synthetic IDs from fixture — set TEMPMAIL_API2_TEST_EMAIL_ENTID JSON to run live"
      return
    end
    client = setup[:client]

    # Bootstrap entity data from existing test data.
    email_ref01_data_raw = Vs.items(Helpers.to_map(
      Vs.getpath(setup[:data], "existing.email")))
    email_ref01_data = nil
    if email_ref01_data_raw.length > 0
      email_ref01_data = Helpers.to_map(email_ref01_data_raw[0][1])
    end

    # LOAD
    email_ref01_ent = client.Email(nil)
    email_ref01_match_dt0 = {
      "id" => email_ref01_data["id"],
    }
    email_ref01_data_dt0_loaded = email_ref01_ent.load(email_ref01_match_dt0, nil)
    email_ref01_data_dt0_load_result = Helpers.to_map(email_ref01_data_dt0_loaded.respond_to?(:data_get) ? email_ref01_data_dt0_loaded.data_get : email_ref01_data_dt0_loaded)
    assert !email_ref01_data_dt0_load_result.nil?
    assert_equal email_ref01_data_dt0_load_result["id"], email_ref01_data["id"]

  end
end

def email_basic_setup(extra)
  Runner.load_env_local

  entity_data_file = File.join(__dir__, "..", "..", ".sdk", "test", "entity", "email", "EmailTestData.json")
  entity_data_source = File.read(entity_data_file)
  entity_data = JSON.parse(entity_data_source)

  options = {}
  options["entity"] = entity_data["existing"]

  client = TempmailApi2SDK.test(options, extra)

  # Generate idmap via transform.
  idmap = Vs.transform(
    ["email01", "email02", "email03", "inbox01", "inbox02", "inbox03", "token01"],
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
  entid_env_raw = ENV["TEMPMAIL_API2_TEST_EMAIL_ENTID"]
  idmap_overridden = !entid_env_raw.nil? && entid_env_raw.strip.start_with?("{")

  env = Runner.env_override({
    "TEMPMAIL_API2_TEST_EMAIL_ENTID" => idmap,
    "TEMPMAIL_API2_TEST_LIVE" => "FALSE",
    "TEMPMAIL_API2_TEST_EXPLAIN" => "FALSE",
  })

  idmap_resolved = Helpers.to_map(
    env["TEMPMAIL_API2_TEST_EMAIL_ENTID"])
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
