-- Typed models for the TempmailApi2 SDK (LuaLS annotations).
--
-- GENERATED from the API model: main.kit.entity.<e>.fields[] and per-op
-- params (op.<name>.points[].args.params[]). Field/param types come from the
-- canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
-- @voxgig/apidef VALID_CANON). Annotations only — no runtime effect. Do not
-- edit by hand.

---@class Domain
---@field domains? table

---@class DomainListMatch
---@field domains? table

---@class Email
---@field attachments? table
---@field body? string
---@field date? string
---@field from? string
---@field html? string
---@field id? string
---@field subject? string
---@field to? string

---@class EmailLoadMatch
---@field email_id string
---@field token string

---@class EmailRemoveMatch
---@field email_id string
---@field token string

---@class Inbox
---@field domain? string
---@field email? string
---@field emails? table
---@field id? string
---@field token? string
---@field username string

---@class InboxLoadMatch
---@field id string

---@class InboxCreateData
---@field domain? string
---@field email? string
---@field emails? table
---@field id? string
---@field token? string
---@field username string

---@class InboxRemoveMatch
---@field id string

local M = {}

return M
