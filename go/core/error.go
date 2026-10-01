package core

import "encoding/json"

type TempmailApi2Error struct {
	IsTempmailApi2Error bool
	Sdk                string
	Code               string
	Msg                string
	// Reachable for a debugger, invisible to a serialiser: the context holds
	// the live spec and options, and an error is what gets logged.
	Ctx    *Context `json:"-"`
	Result any
	Spec   any
}

func NewTempmailApi2Error(code string, msg string, ctx *Context) *TempmailApi2Error {
	return &TempmailApi2Error{
		IsTempmailApi2Error: true,
		Sdk:                "TempmailApi2",
		Code:               code,
		Msg:                msg,
		Ctx:                ctx,
	}
}

func (e *TempmailApi2Error) Error() string {
	return e.Msg
}

// What makeError attached is already cleaned; the context is not part of
// the record.
func (e *TempmailApi2Error) Record() map[string]any {
	return map[string]any{
		"sdk":     e.Sdk,
		"code":    e.Code,
		"message": e.Msg,
		"result":  e.Result,
		"spec":    e.Spec,
	}
}

func (e *TempmailApi2Error) MarshalJSON() ([]byte, error) {
	return json.Marshal(e.Record())
}
