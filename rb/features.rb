# TempmailApi2 SDK feature factory

require_relative 'feature/base_feature'
require_relative 'feature/ratelimit_feature'
require_relative 'feature/retry_feature'
require_relative 'feature/test_feature'
require_relative 'feature/timeout_feature'


module TempmailApi2Features
  def self.make_feature(name)
    case name
    when "base"
      TempmailApi2BaseFeature.new
    when "ratelimit"
      TempmailApi2RatelimitFeature.new
    when "retry"
      TempmailApi2RetryFeature.new
    when "test"
      TempmailApi2TestFeature.new
    when "timeout"
      TempmailApi2TimeoutFeature.new
    else
      TempmailApi2BaseFeature.new
    end
  end
end
