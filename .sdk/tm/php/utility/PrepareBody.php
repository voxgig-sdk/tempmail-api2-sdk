<?php
declare(strict_types=1);

// TempmailApi2 SDK utility: prepare_body

class TempmailApi2PrepareBody
{
    public static function call(TempmailApi2Context $ctx): mixed
    {
        if ($ctx->op->input === 'data') {
            return ($ctx->utility->transform_request)($ctx);
        }
        return null;
    }
}
