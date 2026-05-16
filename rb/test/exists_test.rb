# TempmailApi2 SDK exists test

require "minitest/autorun"
require_relative "../TempmailApi2_sdk"

class ExistsTest < Minitest::Test
  def test_create_test_sdk
    testsdk = TempmailApi2SDK.test(nil, nil)
    assert !testsdk.nil?
  end
end
