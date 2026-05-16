-- ProjectName SDK exists test

local sdk = require("tempmail-api2_sdk")

describe("TempmailApi2SDK", function()
  it("should create test SDK", function()
    local testsdk = sdk.test(nil, nil)
    assert.is_not_nil(testsdk)
  end)
end)
