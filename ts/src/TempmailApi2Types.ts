// Typed models for the TempmailApi2 SDK.
//
// GENERATED from the API model: main.kit.entity.<e>.fields[] and per-op
// params (op.<name>.points[].args.params[]). Field/param types come from the
// canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
// @voxgig/apidef VALID_CANON). Do not edit by hand.

export interface Domain {
  domain?: any[]
}

export type DomainListMatch = Partial<Domain>

export interface Email {
  content_type?: string
  filename?: string
  size?: number
}

export interface EmailListMatch {
  email_id: string
  token: string
}

export interface EmailRemoveMatch {
  email_id: string
  token: string
}

export interface Inbox {
  domain?: string
  email?: any[]
  token?: string
  username: string
}

export interface InboxLoadMatch {
  id: string
}

export type InboxCreateData = Partial<Inbox>

export interface InboxRemoveMatch {
  id: string
}

