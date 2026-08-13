// Typed models for the TempmailApi2 SDK.
//
// GENERATED from the API model: main.kit.entity.<e>.fields[] and per-op
// params (op.<name>.points[].args.params[]). Field/param types come from the
// canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
// @voxgig/apidef VALID_CANON). Do not edit by hand.

export interface Domain {
  domains?: any[]
}

export interface DomainListMatch {
  domains?: any[]
}

export interface Email {
  contentType?: string
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
  email?: string
  emails?: any[]
  token?: string
  username: string
}

export interface InboxLoadMatch {
  id: string
}

export interface InboxCreateData {
  domain?: string
  email?: string
  emails?: any[]
  token?: string
  username: string

  // Selects a custom action instead of the plain create:
  //   'create' | 'custom'
  // The remaining keys are that action's own payload.
  $action?: string
  [action: string]: any
}

export interface InboxRemoveMatch {
  id: string
}

