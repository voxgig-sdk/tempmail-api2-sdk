-- TempmailApi2 SDK error

local TempmailApi2Error = {}
TempmailApi2Error.__index = TempmailApi2Error


function TempmailApi2Error.new(code, msg, ctx)
  local self = setmetatable({}, TempmailApi2Error)
  self.is_sdk_error = true
  self.sdk = "TempmailApi2"
  self.code = code or ""
  self.msg = msg or ""
  self.ctx = ctx
  self.result = nil
  self.spec = nil
  return self
end


function TempmailApi2Error:error()
  return self.msg
end


function TempmailApi2Error:__tostring()
  return self.msg
end


return TempmailApi2Error
