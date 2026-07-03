# Email direct test

require "minitest/autorun"
require "json"
require_relative "../TempmailApi2_sdk"
require_relative "runner"

class EmailDirectTest < Minitest::Test
  def test_direct_list_email
    setup = email_direct_setup([
      { "id" => "direct01" },
      { "id" => "direct02" },
    ])
    _should_skip, _reason = Runner.is_control_skipped("direct", "direct-list-email", setup[:live] ? "live" : "unit")
    if _should_skip
      skip(_reason || "skipped via sdk-test-control.json")
      return
    end
    if setup[:live]
      ["email01", "token01"].each do |_live_key|
        if setup[:idmap][_live_key].nil?
          skip "live test needs #{_live_key} via *_ENTID env var (synthetic IDs only)"
          return
        end
      end
    end
    client = setup[:client]

    params = {}
    if setup[:live]
      params["email_id"] = setup[:idmap]["email01"]
    else
      params["email_id"] = "direct01"
    end
    if setup[:live]
      params["token"] = setup[:idmap]["token01"]
    else
      params["token"] = "direct01"
    end

    result, err = client.direct({
      "path" => "inbox/{token}/{email_id}",
      "method" => "GET",
      "params" => params,
    })
    if setup[:live]
      # Live mode is lenient: synthetic IDs frequently 4xx and the list-
      # response shape varies wildly across public APIs. Skip rather than
      # fail when the call doesn't return a usable list.
      if !err.nil?
        skip("list call failed (likely synthetic IDs against live API): #{err}")
        return
      end
      unless result["ok"]
        skip("list call not ok (likely synthetic IDs against live API)")
        return
      end
      status = Helpers.to_int(result["status"])
      if status < 200 || status >= 300
        skip("expected 2xx status, got #{status}")
        return
      end
    else
      assert_nil err
      assert result["ok"]
      assert_equal 200, Helpers.to_int(result["status"])
      assert result["data"].is_a?(Array)
      assert_equal 2, result["data"].length
      assert_equal 1, setup[:calls].length
    end
  end

end


def email_direct_setup(mockres)
  Runner.load_env_local

  calls = []

  env = Runner.env_override({
    "TEMPMAILAPI__TEST_EMAIL_ENTID" => {},
    "TEMPMAILAPI__TEST_LIVE" => "FALSE",
    "TEMPMAILAPI__APIKEY" => "NONE",
  })

  live = env["TEMPMAILAPI__TEST_LIVE"] == "TRUE"

  if live
    merged_opts = {
      "apikey" => env["TEMPMAILAPI__APIKEY"],
    }
    client = TempmailApi2SDK.new(merged_opts)
    return {
      client: client,
      calls: calls,
      live: true,
      idmap: {},
    }
  end

  mock_fetch = ->(url, init) {
    calls.push({ "url" => url, "init" => init })
    return {
      "status" => 200,
      "statusText" => "OK",
      "headers" => {},
      "json" => ->() {
        if !mockres.nil?
          return mockres
        end
        return { "id" => "direct01" }
      },
      "body" => "mock",
    }, nil
  }

  client = TempmailApi2SDK.new({
    "base" => "http://localhost:8080",
    "system" => {
      "fetch" => mock_fetch,
    },
  })

  {
    client: client,
    calls: calls,
    live: false,
    idmap: {},
  }
end
