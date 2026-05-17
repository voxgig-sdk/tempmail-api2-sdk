package voxgigtempmailapi2sdk

import (
	"github.com/voxgig-sdk/tempmail-api2-sdk/go/core"
	"github.com/voxgig-sdk/tempmail-api2-sdk/go/entity"
	"github.com/voxgig-sdk/tempmail-api2-sdk/go/feature"
	_ "github.com/voxgig-sdk/tempmail-api2-sdk/go/utility"
)

// Type aliases preserve external API.
type TempmailApi2SDK = core.TempmailApi2SDK
type Context = core.Context
type Utility = core.Utility
type Feature = core.Feature
type Entity = core.Entity
type TempmailApi2Entity = core.TempmailApi2Entity
type FetcherFunc = core.FetcherFunc
type Spec = core.Spec
type Result = core.Result
type Response = core.Response
type Operation = core.Operation
type Control = core.Control
type TempmailApi2Error = core.TempmailApi2Error

// BaseFeature from feature package.
type BaseFeature = feature.BaseFeature

func init() {
	core.NewBaseFeatureFunc = func() core.Feature {
		return feature.NewBaseFeature()
	}
	core.NewTestFeatureFunc = func() core.Feature {
		return feature.NewTestFeature()
	}
	core.NewDomainEntityFunc = func(client *core.TempmailApi2SDK, entopts map[string]any) core.TempmailApi2Entity {
		return entity.NewDomainEntity(client, entopts)
	}
	core.NewEmailEntityFunc = func(client *core.TempmailApi2SDK, entopts map[string]any) core.TempmailApi2Entity {
		return entity.NewEmailEntity(client, entopts)
	}
	core.NewInboxEntityFunc = func(client *core.TempmailApi2SDK, entopts map[string]any) core.TempmailApi2Entity {
		return entity.NewInboxEntity(client, entopts)
	}
}

// Constructor re-exports.
var NewTempmailApi2SDK = core.NewTempmailApi2SDK
var TestSDK = core.TestSDK
var NewContext = core.NewContext
var NewSpec = core.NewSpec
var NewResult = core.NewResult
var NewResponse = core.NewResponse
var NewOperation = core.NewOperation
var MakeConfig = core.MakeConfig
var NewBaseFeature = feature.NewBaseFeature
var NewTestFeature = feature.NewTestFeature
