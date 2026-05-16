<?php
declare(strict_types=1);

// TempmailApi2 SDK utility: result_body

class TempmailApi2ResultBody
{
    public static function call(TempmailApi2Context $ctx): ?TempmailApi2Result
    {
        $response = $ctx->response;
        $result = $ctx->result;
        if ($result && $response && $response->json_func && $response->body) {
            $result->body = ($response->json_func)();
        }
        return $result;
    }
}
