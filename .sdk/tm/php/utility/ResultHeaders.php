<?php
declare(strict_types=1);

// TempmailApi2 SDK utility: result_headers

class TempmailApi2ResultHeaders
{
    public static function call(TempmailApi2Context $ctx): ?TempmailApi2Result
    {
        $response = $ctx->response;
        $result = $ctx->result;
        if ($result) {
            if ($response && is_array($response->headers)) {
                $result->headers = $response->headers;
            } else {
                $result->headers = [];
            }
        }
        return $result;
    }
}
