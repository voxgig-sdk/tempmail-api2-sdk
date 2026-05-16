package core

type TempmailApi2Error struct {
	IsTempmailApi2Error bool
	Sdk              string
	Code             string
	Msg              string
	Ctx              *Context
	Result           any
	Spec             any
}

func NewTempmailApi2Error(code string, msg string, ctx *Context) *TempmailApi2Error {
	return &TempmailApi2Error{
		IsTempmailApi2Error: true,
		Sdk:              "TempmailApi2",
		Code:             code,
		Msg:              msg,
		Ctx:              ctx,
	}
}

func (e *TempmailApi2Error) Error() string {
	return e.Msg
}
