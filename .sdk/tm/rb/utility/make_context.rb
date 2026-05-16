# TempmailApi2 SDK utility: make_context
require_relative '../core/context'
module TempmailApi2Utilities
  MakeContext = ->(ctxmap, basectx) {
    TempmailApi2Context.new(ctxmap, basectx)
  }
end
