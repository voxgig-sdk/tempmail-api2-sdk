<?php
declare(strict_types=1);

// TempmailApi2 SDK utility: prepare_headers

class TempmailApi2PrepareHeaders
{
    public static function call(TempmailApi2Context $ctx): array
    {
        $options = $ctx->client->options_map();
        $headers = \Voxgig\Struct\Struct::getprop($options, 'headers');
        if (!$headers) {
            return [];
        }
        $out = \Voxgig\Struct\Struct::clone($headers);
        return is_array($out) ? $out : [];
    }
}
