package core

import (
	"sync"
)

// MakeConfig builds a fresh, fully materialised config map. Every call
// rebuilds the whole structure, so prefer SharedConfig unless you need a
// private copy you intend to mutate.
func MakeConfig() map[string]any {
	return map[string]any{
		"main": map[string]any{
			"name": "TempmailApi2",
			"slug": "tempmail-api2",
			"version": "0.0.1",
			"target": "go",
		},
		"feature": map[string]any{
			"test": map[string]any{
				"options": map[string]any{
					"active": false,
				},
			},
		},
		"options": map[string]any{
			"base": "https://api.tempmail.lol/v2",
			"headers": map[string]any{
				"content-type": "application/json",
			},
			"entity": map[string]any{
				"domain": map[string]any{},
				"email": map[string]any{},
				"inbox": map[string]any{},
			},
		},
		"entity": map[string]any{
			"domain": map[string]any{
				"fields": []any{
					map[string]any{
						"name": "domains",
						"type": "`$ARRAY`",
					},
				},
				"name": "domain",
				"op": map[string]any{
					"list": map[string]any{
						"input": "data",
						"name": "list",
						"points": []any{
							map[string]any{
								"args": map[string]any{},
								"kind": "http",
								"method": "GET",
								"orig": "/domains",
								"parts": []any{
									"domains",
								},
								"select": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body.domains`",
								},
							},
						},
					},
				},
				"relations": map[string]any{
					"ancestors": []any{},
				},
			},
			"email": map[string]any{
				"fields": []any{
					map[string]any{
						"name": "attachments",
						"type": "`$ARRAY`",
					},
					map[string]any{
						"name": "body",
						"short": "Email body content",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "date",
						"short": "Timestamp when email was received",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "from",
						"short": "Sender email address",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "html",
						"short": "HTML version of email body",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "id",
						"short": "Unique identifier for the email",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "subject",
						"short": "Email subject",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "to",
						"short": "Recipient email address",
						"type": "`$STRING`",
					},
				},
				"name": "email",
				"op": map[string]any{
					"load": map[string]any{
						"input": "data",
						"name": "load",
						"points": []any{
							map[string]any{
								"args": map[string]any{
									"params": []any{
										map[string]any{
											"kind": "param",
											"name": "email_id",
											"orig": "email_id",
											"reqd": true,
											"type": "`$STRING`",
										},
										map[string]any{
											"kind": "param",
											"name": "token",
											"orig": "token",
											"reqd": true,
											"type": "`$STRING`",
										},
									},
								},
								"kind": "http",
								"method": "GET",
								"orig": "/inbox/{token}/{emailId}",
								"parts": []any{
									"inbox",
									"{token}",
									"{email_id}",
								},
								"rename": map[string]any{
									"param": map[string]any{
										"emailId": "email_id",
									},
								},
								"select": map[string]any{
									"exist": []any{
										"email_id",
										"token",
									},
								},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body`",
								},
							},
						},
					},
					"remove": map[string]any{
						"input": "data",
						"name": "remove",
						"points": []any{
							map[string]any{
								"args": map[string]any{
									"params": []any{
										map[string]any{
											"kind": "param",
											"name": "email_id",
											"orig": "email_id",
											"reqd": true,
											"type": "`$STRING`",
										},
										map[string]any{
											"kind": "param",
											"name": "token",
											"orig": "token",
											"reqd": true,
											"type": "`$STRING`",
										},
									},
								},
								"kind": "http",
								"method": "DELETE",
								"orig": "/inbox/{token}/{emailId}",
								"parts": []any{
									"inbox",
									"{token}",
									"{email_id}",
								},
								"rename": map[string]any{
									"param": map[string]any{
										"emailId": "email_id",
									},
								},
								"select": map[string]any{
									"exist": []any{
										"email_id",
										"token",
									},
								},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body`",
								},
							},
						},
					},
				},
				"relations": map[string]any{
					"ancestors": []any{
						[]any{
							"inbox",
						},
					},
				},
			},
			"inbox": map[string]any{
				"fields": []any{
					map[string]any{
						"name": "domain",
						"short": "Domain for the email address (optional)",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "email",
						"short": "The generated temporary email address",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "emails",
						"type": "`$ARRAY`",
					},
					map[string]any{
						"name": "token",
						"short": "Authentication token for accessing the inbox",
						"type": "`$STRING`",
					},
					map[string]any{
						"name": "username",
						"req": true,
						"short": "Desired username for the email address",
						"type": "`$STRING`",
					},
				},
				"name": "inbox",
				"op": map[string]any{
					"create": map[string]any{
						"input": "data",
						"name": "create",
						"points": []any{
							map[string]any{
								"args": map[string]any{},
								"kind": "http",
								"method": "POST",
								"orig": "/inbox/create",
								"parts": []any{
									"inbox",
									"create",
								},
								"select": map[string]any{
									"$action": "create",
								},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body`",
								},
							},
							map[string]any{
								"args": map[string]any{},
								"kind": "http",
								"method": "POST",
								"orig": "/inbox/custom",
								"parts": []any{
									"inbox",
									"custom",
								},
								"select": map[string]any{
									"$action": "custom",
								},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body`",
								},
							},
						},
					},
					"load": map[string]any{
						"input": "data",
						"name": "load",
						"points": []any{
							map[string]any{
								"args": map[string]any{
									"params": []any{
										map[string]any{
											"kind": "param",
											"name": "id",
											"orig": "token",
											"reqd": true,
											"type": "`$STRING`",
										},
									},
								},
								"kind": "http",
								"method": "GET",
								"orig": "/inbox/{token}",
								"parts": []any{
									"inbox",
									"{id}",
								},
								"rename": map[string]any{
									"param": map[string]any{
										"token": "id",
									},
								},
								"select": map[string]any{
									"exist": []any{
										"id",
									},
								},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body`",
								},
							},
						},
					},
					"remove": map[string]any{
						"input": "data",
						"name": "remove",
						"points": []any{
							map[string]any{
								"args": map[string]any{
									"params": []any{
										map[string]any{
											"kind": "param",
											"name": "id",
											"orig": "token",
											"reqd": true,
											"type": "`$STRING`",
										},
									},
								},
								"kind": "http",
								"method": "DELETE",
								"orig": "/inbox/{token}",
								"parts": []any{
									"inbox",
									"{id}",
								},
								"rename": map[string]any{
									"param": map[string]any{
										"token": "id",
									},
								},
								"select": map[string]any{
									"exist": []any{
										"id",
									},
								},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body`",
								},
							},
						},
					},
				},
				"relations": map[string]any{
					"ancestors": []any{},
				},
			},
		},
	}
}

var (
	sharedConfigOnce sync.Once
	sharedConfigVal  map[string]any
)

// SharedConfig returns the process-wide config, built once on first use.
// The SDK reads the config on every request and never writes to it, so one
// instance is shared by every client rather than rebuilt per client.
//
// The returned map is shared: treat it as read-only. Callers that need to
// mutate should use MakeConfig, which always returns a fresh copy.
func SharedConfig() map[string]any {
	sharedConfigOnce.Do(func() {
		sharedConfigVal = MakeConfig()
	})
	return sharedConfigVal
}

func makeFeature(name string) Feature {
	switch name {
	case "test":
		if NewTestFeatureFunc != nil {
			return NewTestFeatureFunc()
		}
	default:
		if NewBaseFeatureFunc != nil {
			return NewBaseFeatureFunc()
		}
	}
	return nil
}
