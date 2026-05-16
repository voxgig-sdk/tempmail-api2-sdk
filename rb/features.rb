# TempmailApi2 SDK feature factory

require_relative 'feature/base_feature'
require_relative 'feature/test_feature'


module TempmailApi2Features
  def self.make_feature(name)
    case name
    when "base"
      TempmailApi2BaseFeature.new
    when "test"
      TempmailApi2TestFeature.new
    else
      TempmailApi2BaseFeature.new
    end
  end
end
