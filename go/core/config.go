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
			"ratelimit": map[string]any{
				"options": map[string]any{
					"active": false,
					"burst": 5,
					"rate": 5,
				},
				"optspec": map[string]any{
					"now": "`$FUNCTION`",
					"sleep": "`$FUNCTION`",
				},
				"strict": false,
				"transport": "wrap",
			},
			"retry": map[string]any{
				"options": map[string]any{
					"active": false,
					"factor": 2,
					"maxDelay": 2000,
					"minDelay": 50,
					"retries": 2,
					"statuses": []any{
						408,
						425,
						429,
						500,
						502,
						503,
						504,
					},
				},
				"optspec": map[string]any{
					"jitter": "`$BOOLEAN`",
					"sleep": "`$FUNCTION`",
				},
				"strict": false,
				"transport": "wrap",
			},
			"test": map[string]any{
				"options": map[string]any{
					"active": false,
				},
				"optspec": map[string]any{
					"entity": "`$MAP`",
					"net": "`$MAP`",
				},
				"strict": false,
				"transport": "base",
			},
			"timeout": map[string]any{
				"options": map[string]any{
					"active": false,
					"ms": 30000,
				},
				"optspec": map[string]any{
					"clearTimer": "`$FUNCTION`",
					"setTimer": "`$FUNCTION`",
				},
				"strict": false,
				"transport": "wrap",
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
						"title": "Domains",
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
								"kind": "http",
								"method": "GET",
								"orig": "/domains",
								"segments": []any{
									map[string]any{
										"lit": "domains",
									},
								},
								"parts": []any{
									"domains",
								},
								"rename": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body.domains`",
								},
								"args": map[string]any{},
								"select": map[string]any{},
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
						"title": "Attachments",
						"type": "`$ARRAY`",
					},
					map[string]any{
						"name": "body",
						"title": "Body",
						"type": "`$STRING`",
						"short": "Email body content",
					},
					map[string]any{
						"name": "date",
						"title": "Date",
						"type": "`$STRING`",
						"short": "Timestamp when email was received",
						"format": "date-time",
					},
					map[string]any{
						"name": "from",
						"title": "From",
						"type": "`$STRING`",
						"short": "Sender email address",
						"format": "email",
					},
					map[string]any{
						"name": "html",
						"title": "Html",
						"type": "`$STRING`",
						"short": "HTML version of email body",
					},
					map[string]any{
						"name": "id",
						"title": "Id",
						"type": "`$STRING`",
						"short": "Unique identifier for the email",
					},
					map[string]any{
						"name": "subject",
						"title": "Subject",
						"type": "`$STRING`",
						"short": "Email subject",
					},
					map[string]any{
						"name": "to",
						"title": "To",
						"type": "`$STRING`",
						"short": "Recipient email address",
						"format": "email",
					},
				},
				"id": map[string]any{
					"field": "id",
					"name": "id",
					"parts": []any{
						"token",
						"email_id",
					},
					"sep": "/",
				},
				"name": "email",
				"op": map[string]any{
					"load": map[string]any{
						"input": "data",
						"name": "load",
						"points": []any{
							map[string]any{
								"kind": "http",
								"method": "GET",
								"orig": "/inbox/{token}/{emailId}",
								"segments": []any{
									map[string]any{
										"lit": "inbox",
									},
									map[string]any{
										"var": "token",
									},
									map[string]any{
										"var": "email_id",
									},
								},
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
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body`",
								},
								"args": map[string]any{
									"params": []any{
										map[string]any{
											"name": "email_id",
											"orig": "email_id",
											"type": "`$STRING`",
											"kind": "param",
											"reqd": true,
										},
										map[string]any{
											"name": "token",
											"orig": "token",
											"type": "`$STRING`",
											"kind": "param",
											"reqd": true,
										},
									},
								},
								"select": map[string]any{
									"exist": []any{
										"email_id",
										"token",
									},
								},
							},
						},
					},
					"remove": map[string]any{
						"input": "data",
						"name": "remove",
						"points": []any{
							map[string]any{
								"kind": "http",
								"method": "DELETE",
								"orig": "/inbox/{token}/{emailId}",
								"segments": []any{
									map[string]any{
										"lit": "inbox",
									},
									map[string]any{
										"var": "token",
									},
									map[string]any{
										"var": "email_id",
									},
								},
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
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body`",
								},
								"args": map[string]any{
									"params": []any{
										map[string]any{
											"name": "email_id",
											"orig": "email_id",
											"type": "`$STRING`",
											"kind": "param",
											"reqd": true,
										},
										map[string]any{
											"name": "token",
											"orig": "token",
											"type": "`$STRING`",
											"kind": "param",
											"reqd": true,
										},
									},
								},
								"select": map[string]any{
									"exist": []any{
										"email_id",
										"token",
									},
								},
							},
						},
					},
				},
				"relations": map[string]any{
					"ancestors": []any{
						[]any{
							"$.main.kit.entity.inbox",
						},
					},
				},
			},
			"inbox": map[string]any{
				"fields": []any{
					map[string]any{
						"name": "emails",
						"title": "Emails",
						"type": "`$ARRAY`",
					},
					map[string]any{
						"name": "id",
						"title": "Id",
						"type": "`$STRING`",
					},
				},
				"id": map[string]any{
					"field": "id",
					"name": "id",
				},
				"name": "inbox",
				"op": map[string]any{
					"create": map[string]any{
						"input": "data",
						"name": "create",
						"points": []any{
							map[string]any{
								"kind": "http",
								"method": "POST",
								"orig": "/inbox/create",
								"segments": []any{
									map[string]any{
										"lit": "inbox",
									},
									map[string]any{
										"lit": "create",
									},
								},
								"parts": []any{
									"inbox",
									"create",
								},
								"rename": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body`",
								},
								"args": map[string]any{},
								"select": map[string]any{
									"$action": "create",
								},
							},
							map[string]any{
								"kind": "http",
								"method": "POST",
								"orig": "/inbox/custom",
								"segments": []any{
									map[string]any{
										"lit": "inbox",
									},
									map[string]any{
										"lit": "custom",
									},
								},
								"parts": []any{
									"inbox",
									"custom",
								},
								"rename": map[string]any{},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body`",
								},
								"args": map[string]any{},
								"select": map[string]any{
									"$action": "custom",
								},
							},
						},
					},
					"load": map[string]any{
						"input": "data",
						"name": "load",
						"points": []any{
							map[string]any{
								"kind": "http",
								"method": "GET",
								"orig": "/inbox/{token}",
								"segments": []any{
									map[string]any{
										"lit": "inbox",
									},
									map[string]any{
										"var": "id",
									},
								},
								"parts": []any{
									"inbox",
									"{id}",
								},
								"rename": map[string]any{
									"param": map[string]any{
										"token": "id",
									},
								},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body`",
								},
								"args": map[string]any{
									"params": []any{
										map[string]any{
											"name": "id",
											"orig": "token",
											"type": "`$STRING`",
											"kind": "param",
											"reqd": true,
										},
									},
								},
								"select": map[string]any{
									"exist": []any{
										"id",
									},
								},
							},
						},
					},
					"remove": map[string]any{
						"input": "data",
						"name": "remove",
						"points": []any{
							map[string]any{
								"kind": "http",
								"method": "DELETE",
								"orig": "/inbox/{token}",
								"segments": []any{
									map[string]any{
										"lit": "inbox",
									},
									map[string]any{
										"var": "id",
									},
								},
								"parts": []any{
									"inbox",
									"{id}",
								},
								"rename": map[string]any{
									"param": map[string]any{
										"token": "id",
									},
								},
								"transform": map[string]any{
									"req": "`reqdata`",
									"res": "`body`",
								},
								"args": map[string]any{
									"params": []any{
										map[string]any{
											"name": "id",
											"orig": "token",
											"type": "`$STRING`",
											"kind": "param",
											"reqd": true,
										},
									},
								},
								"select": map[string]any{
									"exist": []any{
										"id",
									},
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

// The plugin definitions the model selected per feature, as []any so a
// feature package can consume them without core naming its types. Empty
// when no active feature declares active plugin groups for this target.
var featurePlugins = map[string][]any{
}

// FeaturePlugins is the definitions list for one feature's chain.
func FeaturePlugins(name string) []any {
	return featurePlugins[name]
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
	case "ratelimit":
		if NewRatelimitFeatureFunc != nil {
			return NewRatelimitFeatureFunc()
		}
	case "retry":
		if NewRetryFeatureFunc != nil {
			return NewRetryFeatureFunc()
		}
	case "test":
		if NewTestFeatureFunc != nil {
			return NewTestFeatureFunc()
		}
	case "timeout":
		if NewTimeoutFeatureFunc != nil {
			return NewTimeoutFeatureFunc()
		}
	default:
		if NewBaseFeatureFunc != nil {
			return NewBaseFeatureFunc()
		}
	}
	return nil
}
