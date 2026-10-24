-- TempmailApi2 SDK error

local json = require("dkjson")

local TempmailApi2Error = {}
TempmailApi2Error.__index = TempmailApi2Error

-- Reachable for a debugger, absent from the table itself: the context holds
-- the live spec and options, and an error is what gets dumped or encoded.
local CONTEXT = setmetatable({}, { __mode = "k" })


function TempmailApi2Error.new(code, msg, ctx)
  local self = setmetatable({}, TempmailApi2Error)
  self.is_sdk_error = true
  self.sdk = "TempmailApi2"
  self.code = code or ""
  self.msg = msg or ""
  self.result = nil
  self.spec = nil
  self.status = -1
  CONTEXT[self] = ctx
  return self
end


function TempmailApi2Error:context()
  return CONTEXT[self]
end


function TempmailApi2Error:error()
  return self.msg
end


function TempmailApi2Error:not_found()
  return 404 == self.status
end


-- What make_error attached is already cleaned; the context is not part of
-- the record.
function TempmailApi2Error:to_table()
  return {
    sdk = self.sdk,
    code = self.code,
    msg = self.msg,
    status = self.status,
    result = self.result,
    spec = self.spec,
  }
end


function TempmailApi2Error:to_json()
  return json.encode(self:to_table())
end


function TempmailApi2Error:__tostring()
  return self.msg
end


function TempmailApi2Error.__tojson(self)
  return self:to_json()
end


return TempmailApi2Error
