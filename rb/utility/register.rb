# TempmailApi2 SDK utility registration
require_relative '../core/utility_type'
require_relative 'clean'
require_relative 'done'
require_relative 'make_error'
require_relative 'feature_add'
require_relative 'feature_hook'
require_relative 'feature_init'
require_relative 'fetcher'
require_relative 'make_fetch_def'
require_relative 'make_context'
require_relative 'make_options'
require_relative 'make_request'
require_relative 'make_response'
require_relative 'make_result'
require_relative 'make_point'
require_relative 'make_spec'
require_relative 'make_url'
require_relative 'param'
require_relative 'prepare_auth'
require_relative 'prepare_body'
require_relative 'prepare_headers'
require_relative 'prepare_method'
require_relative 'prepare_params'
require_relative 'prepare_path'
require_relative 'prepare_query'
require_relative 'result_basic'
require_relative 'result_body'
require_relative 'result_headers'
require_relative 'transform_request'
require_relative 'transform_response'

TempmailApi2Utility.registrar = ->(u) {
  u.clean = TempmailApi2Utilities::Clean
  u.done = TempmailApi2Utilities::Done
  u.make_error = TempmailApi2Utilities::MakeError
  u.feature_add = TempmailApi2Utilities::FeatureAdd
  u.feature_hook = TempmailApi2Utilities::FeatureHook
  u.feature_init = TempmailApi2Utilities::FeatureInit
  u.fetcher = TempmailApi2Utilities::Fetcher
  u.make_fetch_def = TempmailApi2Utilities::MakeFetchDef
  u.make_context = TempmailApi2Utilities::MakeContext
  u.make_options = TempmailApi2Utilities::MakeOptions
  u.make_request = TempmailApi2Utilities::MakeRequest
  u.make_response = TempmailApi2Utilities::MakeResponse
  u.make_result = TempmailApi2Utilities::MakeResult
  u.make_point = TempmailApi2Utilities::MakePoint
  u.make_spec = TempmailApi2Utilities::MakeSpec
  u.make_url = TempmailApi2Utilities::MakeUrl
  u.param = TempmailApi2Utilities::Param
  u.prepare_auth = TempmailApi2Utilities::PrepareAuth
  u.prepare_body = TempmailApi2Utilities::PrepareBody
  u.prepare_headers = TempmailApi2Utilities::PrepareHeaders
  u.prepare_method = TempmailApi2Utilities::PrepareMethod
  u.prepare_params = TempmailApi2Utilities::PrepareParams
  u.prepare_path = TempmailApi2Utilities::PreparePath
  u.prepare_query = TempmailApi2Utilities::PrepareQuery
  u.result_basic = TempmailApi2Utilities::ResultBasic
  u.result_body = TempmailApi2Utilities::ResultBody
  u.result_headers = TempmailApi2Utilities::ResultHeaders
  u.transform_request = TempmailApi2Utilities::TransformRequest
  u.transform_response = TempmailApi2Utilities::TransformResponse
}
