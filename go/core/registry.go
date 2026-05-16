package core

var UtilityRegistrar func(u *Utility)

var NewBaseFeatureFunc func() Feature

var NewTestFeatureFunc func() Feature

var NewDomainEntityFunc func(client *TempmailApi2SDK, entopts map[string]any) TempmailApi2Entity

var NewEmailEntityFunc func(client *TempmailApi2SDK, entopts map[string]any) TempmailApi2Entity

var NewInboxEntityFunc func(client *TempmailApi2SDK, entopts map[string]any) TempmailApi2Entity

