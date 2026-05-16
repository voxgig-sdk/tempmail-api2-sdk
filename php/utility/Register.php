<?php
declare(strict_types=1);

// TempmailApi2 SDK utility registration

require_once __DIR__ . '/../core/UtilityType.php';
require_once __DIR__ . '/Clean.php';
require_once __DIR__ . '/Done.php';
require_once __DIR__ . '/MakeError.php';
require_once __DIR__ . '/FeatureAdd.php';
require_once __DIR__ . '/FeatureHook.php';
require_once __DIR__ . '/FeatureInit.php';
require_once __DIR__ . '/Fetcher.php';
require_once __DIR__ . '/MakeFetchDef.php';
require_once __DIR__ . '/MakeContext.php';
require_once __DIR__ . '/MakeOptions.php';
require_once __DIR__ . '/MakeRequest.php';
require_once __DIR__ . '/MakeResponse.php';
require_once __DIR__ . '/MakeResult.php';
require_once __DIR__ . '/MakePoint.php';
require_once __DIR__ . '/MakeSpec.php';
require_once __DIR__ . '/MakeUrl.php';
require_once __DIR__ . '/Param.php';
require_once __DIR__ . '/PrepareAuth.php';
require_once __DIR__ . '/PrepareBody.php';
require_once __DIR__ . '/PrepareHeaders.php';
require_once __DIR__ . '/PrepareMethod.php';
require_once __DIR__ . '/PrepareParams.php';
require_once __DIR__ . '/PreparePath.php';
require_once __DIR__ . '/PrepareQuery.php';
require_once __DIR__ . '/ResultBasic.php';
require_once __DIR__ . '/ResultBody.php';
require_once __DIR__ . '/ResultHeaders.php';
require_once __DIR__ . '/TransformRequest.php';
require_once __DIR__ . '/TransformResponse.php';

TempmailApi2Utility::setRegistrar(function (TempmailApi2Utility $u): void {
    $u->clean = [TempmailApi2Clean::class, 'call'];
    $u->done = [TempmailApi2Done::class, 'call'];
    $u->make_error = [TempmailApi2MakeError::class, 'call'];
    $u->feature_add = [TempmailApi2FeatureAdd::class, 'call'];
    $u->feature_hook = [TempmailApi2FeatureHook::class, 'call'];
    $u->feature_init = [TempmailApi2FeatureInit::class, 'call'];
    $u->fetcher = [TempmailApi2Fetcher::class, 'call'];
    $u->make_fetch_def = [TempmailApi2MakeFetchDef::class, 'call'];
    $u->make_context = [TempmailApi2MakeContext::class, 'call'];
    $u->make_options = [TempmailApi2MakeOptions::class, 'call'];
    $u->make_request = [TempmailApi2MakeRequest::class, 'call'];
    $u->make_response = [TempmailApi2MakeResponse::class, 'call'];
    $u->make_result = [TempmailApi2MakeResult::class, 'call'];
    $u->make_point = [TempmailApi2MakePoint::class, 'call'];
    $u->make_spec = [TempmailApi2MakeSpec::class, 'call'];
    $u->make_url = [TempmailApi2MakeUrl::class, 'call'];
    $u->param = [TempmailApi2Param::class, 'call'];
    $u->prepare_auth = [TempmailApi2PrepareAuth::class, 'call'];
    $u->prepare_body = [TempmailApi2PrepareBody::class, 'call'];
    $u->prepare_headers = [TempmailApi2PrepareHeaders::class, 'call'];
    $u->prepare_method = [TempmailApi2PrepareMethod::class, 'call'];
    $u->prepare_params = [TempmailApi2PrepareParams::class, 'call'];
    $u->prepare_path = [TempmailApi2PreparePath::class, 'call'];
    $u->prepare_query = [TempmailApi2PrepareQuery::class, 'call'];
    $u->result_basic = [TempmailApi2ResultBasic::class, 'call'];
    $u->result_body = [TempmailApi2ResultBody::class, 'call'];
    $u->result_headers = [TempmailApi2ResultHeaders::class, 'call'];
    $u->transform_request = [TempmailApi2TransformRequest::class, 'call'];
    $u->transform_response = [TempmailApi2TransformResponse::class, 'call'];
});
