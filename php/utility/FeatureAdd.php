<?php
declare(strict_types=1);

// TempmailApi2 SDK utility: feature_add

class TempmailApi2FeatureAdd
{
    public static function call(TempmailApi2Context $ctx, mixed $f): void
    {
        $ctx->client->features[] = $f;
    }
}
