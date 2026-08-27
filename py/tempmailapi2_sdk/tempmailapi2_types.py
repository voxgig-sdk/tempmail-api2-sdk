# Typed models for the TempmailApi2 SDK.
#
# GENERATED from the API model: main.kit.entity.<e>.fields[] and per-op
# params (op.<name>.points[].args.params[]). Field/param types come from the
# canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
# @voxgig/apidef VALID_CANON). Do not edit by hand.
#
# These are TypedDicts, not dataclasses: the SDK ops return/accept plain dicts
# at runtime, and a TypedDict IS a dict shape, so the types match the runtime.
# Optional (req:false) keys are modelled as TypedDict key-optionality
# (total=False), split into a required base + total=False subclass when a type
# has both required and optional keys.

from __future__ import annotations

from typing import TypedDict, Any


class Domain(TypedDict, total=False):
    domains: list


class DomainListMatch(TypedDict, total=False):
    domains: list


class Email(TypedDict, total=False):
    attachments: list
    body: str
    date: str
    html: str
    id: str
    subject: str
    to: str


class EmailLoadMatch(TypedDict):
    email_id: str
    token: str


class EmailRemoveMatch(TypedDict):
    email_id: str
    token: str


class InboxRequired(TypedDict):
    username: str


class Inbox(InboxRequired, total=False):
    domain: str
    email: str
    emails: list
    id: str
    token: str


class InboxLoadMatch(TypedDict):
    id: str


class InboxCreateDataRequired(TypedDict):
    username: str


class InboxCreateData(InboxCreateDataRequired, total=False):
    domain: str
    email: str
    emails: list
    id: str
    token: str


class InboxRemoveMatch(TypedDict):
    id: str
