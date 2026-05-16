<?php
declare(strict_types=1);

// TempmailApi2 SDK feature factory

require_once __DIR__ . '/feature/BaseFeature.php';
require_once __DIR__ . '/feature/TestFeature.php';


class TempmailApi2Features
{
    public static function make_feature(string $name)
    {
        switch ($name) {
            case "base":
                return new TempmailApi2BaseFeature();
            case "test":
                return new TempmailApi2TestFeature();
            default:
                return new TempmailApi2BaseFeature();
        }
    }
}
