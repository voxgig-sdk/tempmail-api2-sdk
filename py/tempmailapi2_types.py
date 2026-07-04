# Typed models for the TempmailApi2 SDK.
#
# GENERATED from the API model: main.kit.entity.<e>.fields[] and per-op
# params (op.<name>.points[].args.params[]). Field/param types come from the
# canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
# @voxgig/apidef VALID_CANON). Do not edit by hand.

from __future__ import annotations

from dataclasses import dataclass
from typing import Optional, Any


@dataclass
class Domain:
    domain: Optional[list] = None


@dataclass
class DomainListMatch:
    domain: Optional[list] = None


@dataclass
class Email:
    content_type: Optional[str] = None
    filename: Optional[str] = None
    size: Optional[int] = None


@dataclass
class EmailListMatch:
    email_id: str
    token: str


@dataclass
class EmailRemoveMatch:
    email_id: str
    token: str


@dataclass
class Inbox:
    username: str
    domain: Optional[str] = None
    email: Optional[list] = None
    token: Optional[str] = None


@dataclass
class InboxLoadMatch:
    id: str


@dataclass
class InboxCreateData:
    domain: Optional[str] = None
    email: Optional[list] = None
    token: Optional[str] = None
    username: Optional[str] = None


@dataclass
class InboxRemoveMatch:
    id: str

