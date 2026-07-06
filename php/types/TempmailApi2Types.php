<?php
declare(strict_types=1);

// Typed models for the TempmailApi2 SDK.
//
// GENERATED from the API model: main.kit.entity.<e>.fields[] and per-op
// params (op.<name>.points[].args.params[]). Field/param types come from the
// canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
// @voxgig/apidef VALID_CANON). Do not edit by hand.
//
// These are documentation-grade value objects (PHP 8 typed properties),
// registered on the composer classmap autoload. The SDK boundary exchanges
// assoc-arrays; these classes name the shapes for tooling and typed callers.

/** Domain entity data model. */
class Domain
{
    public ?array $domain = null;
}

/** Request payload for Domain#list. */
class DomainListMatch
{
    public ?array $domain = null;
}

/** Email entity data model. */
class Email
{
    public ?string $content_type = null;
    public ?string $filename = null;
    public ?int $size = null;
}

/** Request payload for Email#list. */
class EmailListMatch
{
    public string $email_id;
    public string $token;
}

/** Request payload for Email#remove. */
class EmailRemoveMatch
{
    public string $email_id;
    public string $token;
}

/** Inbox entity data model. */
class Inbox
{
    public ?string $domain = null;
    public ?array $email = null;
    public ?string $token = null;
    public string $username;
}

/** Request payload for Inbox#load. */
class InboxLoadMatch
{
    public string $id;
}

/** Request payload for Inbox#create. */
class InboxCreateData
{
    public ?string $domain = null;
    public ?array $email = null;
    public ?string $token = null;
    public string $username;
}

/** Request payload for Inbox#remove. */
class InboxRemoveMatch
{
    public string $id;
}

