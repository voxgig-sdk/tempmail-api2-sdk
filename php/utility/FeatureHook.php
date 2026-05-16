<?php
declare(strict_types=1);

// TempmailApi2 SDK utility: feature_hook

class TempmailApi2FeatureHook
{
    public static function call(TempmailApi2Context $ctx, string $name): void
    {
        if (!$ctx->client) {
            return;
        }
        $features = $ctx->client->features ?? null;
        if (!$features) {
            return;
        }
        foreach ($features as $f) {
            if (method_exists($f, $name)) {
                $f->$name($ctx);
            }
        }
    }
}
