# frozen_string_literal: true

# Typed models for the TempmailApi2 SDK.
#
# GENERATED from the API model: main.kit.entity.<e>.fields[] and per-op
# params (op.<name>.points[].args.params[]). Member types come from the
# canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
# @voxgig/apidef VALID_CANON). Ruby types are unenforced; these YARD
# annotations document the shapes. Do not edit by hand.

# Domain entity data model.
#
# @!attribute [rw] domains
#   @return [Array, nil]
Domain = Struct.new(
  :domains,
  keyword_init: true
)

# Request payload for Domain#list.
#
# @!attribute [rw] domains
#   @return [Array, nil]
DomainListMatch = Struct.new(
  :domains,
  keyword_init: true
)

# Email entity data model.
#
# @!attribute [rw] attachments
#   @return [Array, nil]
#
# @!attribute [rw] body
#   @return [String, nil]
#
# @!attribute [rw] date
#   @return [String, nil]
#
# @!attribute [rw] from
#   @return [String, nil]
#
# @!attribute [rw] html
#   @return [String, nil]
#
# @!attribute [rw] id
#   @return [String, nil]
#
# @!attribute [rw] subject
#   @return [String, nil]
#
# @!attribute [rw] to
#   @return [String, nil]
Email = Struct.new(
  :attachments,
  :body,
  :date,
  :from,
  :html,
  :id,
  :subject,
  :to,
  keyword_init: true
)

# Request payload for Email#load.
#
# @!attribute [rw] email_id
#   @return [String]
#
# @!attribute [rw] token
#   @return [String]
EmailLoadMatch = Struct.new(
  :email_id,
  :token,
  keyword_init: true
)

# Request payload for Email#remove.
#
# @!attribute [rw] email_id
#   @return [String]
#
# @!attribute [rw] token
#   @return [String]
EmailRemoveMatch = Struct.new(
  :email_id,
  :token,
  keyword_init: true
)

# Inbox entity data model.
#
# @!attribute [rw] domain
#   @return [String, nil]
#
# @!attribute [rw] email
#   @return [String, nil]
#
# @!attribute [rw] emails
#   @return [Array, nil]
#
# @!attribute [rw] token
#   @return [String, nil]
#
# @!attribute [rw] username
#   @return [String]
Inbox = Struct.new(
  :domain,
  :email,
  :emails,
  :token,
  :username,
  keyword_init: true
)

# Request payload for Inbox#load.
#
# @!attribute [rw] id
#   @return [String]
InboxLoadMatch = Struct.new(
  :id,
  keyword_init: true
)

# Request payload for Inbox#create.
#
# @!attribute [rw] domain
#   @return [String, nil]
#
# @!attribute [rw] email
#   @return [String, nil]
#
# @!attribute [rw] emails
#   @return [Array, nil]
#
# @!attribute [rw] token
#   @return [String, nil]
#
# @!attribute [rw] username
#   @return [String]
InboxCreateData = Struct.new(
  :domain,
  :email,
  :emails,
  :token,
  :username,
  keyword_init: true
)

# Request payload for Inbox#remove.
#
# @!attribute [rw] id
#   @return [String]
InboxRemoveMatch = Struct.new(
  :id,
  keyword_init: true
)

