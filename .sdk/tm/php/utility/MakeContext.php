<?php
declare(strict_types=1);

// TempmailApi2 SDK utility: make_context

require_once __DIR__ . '/../core/Context.php';

class TempmailApi2MakeContext
{
    public static function call(array $ctxmap, ?TempmailApi2Context $basectx): TempmailApi2Context
    {
        return new TempmailApi2Context($ctxmap, $basectx);
    }
}
