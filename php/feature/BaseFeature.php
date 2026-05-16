<?php
declare(strict_types=1);

// TempmailApi2 SDK base feature

class TempmailApi2BaseFeature
{
    public string $version;
    public string $name;
    public bool $active;

    public function __construct()
    {
        $this->version = '0.0.1';
        $this->name = 'base';
        $this->active = true;
    }

    public function get_version(): string { return $this->version; }
    public function get_name(): string { return $this->name; }
    public function get_active(): bool { return $this->active; }

    public function init(TempmailApi2Context $ctx, array $options): void {}
    public function PostConstruct(TempmailApi2Context $ctx): void {}
    public function PostConstructEntity(TempmailApi2Context $ctx): void {}
    public function SetData(TempmailApi2Context $ctx): void {}
    public function GetData(TempmailApi2Context $ctx): void {}
    public function GetMatch(TempmailApi2Context $ctx): void {}
    public function SetMatch(TempmailApi2Context $ctx): void {}
    public function PrePoint(TempmailApi2Context $ctx): void {}
    public function PreSpec(TempmailApi2Context $ctx): void {}
    public function PreRequest(TempmailApi2Context $ctx): void {}
    public function PreResponse(TempmailApi2Context $ctx): void {}
    public function PreResult(TempmailApi2Context $ctx): void {}
    public function PreDone(TempmailApi2Context $ctx): void {}
    public function PreUnexpected(TempmailApi2Context $ctx): void {}
}
