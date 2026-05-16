# TempmailApi2 SDK utility: feature_add
module TempmailApi2Utilities
  FeatureAdd = ->(ctx, f) {
    ctx.client.features << f
  }
end
