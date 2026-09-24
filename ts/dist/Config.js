"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FEATURE_PLUGINS = exports.config = void 0;
const RatelimitFeature_1 = require("./feature/ratelimit/RatelimitFeature");
const RetryFeature_1 = require("./feature/retry/RetryFeature");
const TestFeature_1 = require("./feature/test/TestFeature");
const TimeoutFeature_1 = require("./feature/timeout/TimeoutFeature");
const FEATURE_CLASS = {
    ratelimit: RatelimitFeature_1.RatelimitFeature,
    retry: RetryFeature_1.RetryFeature,
    test: TestFeature_1.TestFeature,
    timeout: TimeoutFeature_1.TimeoutFeature,
};
const FEATURE_PLUGINS = {};
exports.FEATURE_PLUGINS = FEATURE_PLUGINS;
class Config {
    makeFeature(fn) {
        const fc = FEATURE_CLASS[fn];
        const fi = new fc();
        return fi;
    }
    // False for a feature added at runtime via options.extend (station's
    // adopt path) - the constructor uses this to skip makeFeature for names
    // no generated class backs.
    hasFeature(fn) {
        return null != FEATURE_CLASS[fn];
    }
    main = {
        name: 'TempmailApi2',
        slug: "tempmail-api2",
        version: "0.0.1",
        target: "ts",
    };
    feature = {
        ratelimit: {
            "options": {
                "active": false,
                "burst": 5,
                "rate": 5
            },
            "optspec": {
                "now": "`$FUNCTION`",
                "sleep": "`$FUNCTION`"
            },
            "strict": false,
            "transport": "wrap"
        },
        retry: {
            "options": {
                "active": false,
                "factor": 2,
                "maxDelay": 2000,
                "minDelay": 50,
                "retries": 2,
                "statuses": [
                    408,
                    425,
                    429,
                    500,
                    502,
                    503,
                    504
                ]
            },
            "optspec": {
                "jitter": "`$BOOLEAN`",
                "sleep": "`$FUNCTION`"
            },
            "strict": false,
            "transport": "wrap"
        },
        test: {
            "options": {
                "active": false
            },
            "optspec": {
                "entity": "`$MAP`",
                "net": "`$MAP`"
            },
            "strict": false,
            "transport": "base"
        },
        timeout: {
            "options": {
                "active": false,
                "ms": 30000
            },
            "optspec": {
                "clearTimer": "`$FUNCTION`",
                "setTimer": "`$FUNCTION`"
            },
            "strict": false,
            "transport": "wrap"
        },
    };
    options = {
        base: "https://api.tempmail.lol/v2",
        headers: {
            "content-type": "application/json"
        },
        entity: {
            domain: {},
            email: {},
            inbox: {},
        }
    };
    entity = {
        "domain": {
            "fields": [
                {
                    "name": "domains",
                    "title": "Domains",
                    "type": "`$ARRAY`"
                }
            ],
            "name": "domain",
            "op": {
                "list": {
                    "input": "data",
                    "name": "list",
                    "points": [
                        {
                            "kind": "http",
                            "method": "GET",
                            "orig": "/domains",
                            "segments": [
                                {
                                    "lit": "domains"
                                }
                            ],
                            "parts": [
                                "domains"
                            ],
                            "rename": {},
                            "transform": {
                                "req": "`reqdata`",
                                "res": "`body.domains`"
                            },
                            "args": {},
                            "select": {}
                        }
                    ]
                }
            },
            "relations": {
                "ancestors": []
            }
        },
        "email": {
            "fields": [
                {
                    "name": "attachments",
                    "title": "Attachments",
                    "type": "`$ARRAY`"
                },
                {
                    "name": "body",
                    "title": "Body",
                    "type": "`$STRING`",
                    "short": "Email body content"
                },
                {
                    "name": "date",
                    "title": "Date",
                    "type": "`$STRING`",
                    "short": "Timestamp when email was received",
                    "format": "date-time"
                },
                {
                    "name": "from",
                    "title": "From",
                    "type": "`$STRING`",
                    "short": "Sender email address",
                    "format": "email"
                },
                {
                    "name": "html",
                    "title": "Html",
                    "type": "`$STRING`",
                    "short": "HTML version of email body"
                },
                {
                    "name": "id",
                    "title": "Id",
                    "type": "`$STRING`",
                    "short": "Unique identifier for the email"
                },
                {
                    "name": "subject",
                    "title": "Subject",
                    "type": "`$STRING`",
                    "short": "Email subject"
                },
                {
                    "name": "to",
                    "title": "To",
                    "type": "`$STRING`",
                    "short": "Recipient email address",
                    "format": "email"
                }
            ],
            "id": {
                "field": "id",
                "name": "id",
                "parts": [
                    "token",
                    "email_id"
                ],
                "sep": "/"
            },
            "name": "email",
            "op": {
                "load": {
                    "input": "data",
                    "name": "load",
                    "points": [
                        {
                            "kind": "http",
                            "method": "GET",
                            "orig": "/inbox/{token}/{emailId}",
                            "segments": [
                                {
                                    "lit": "inbox"
                                },
                                {
                                    "var": "token"
                                },
                                {
                                    "var": "email_id"
                                }
                            ],
                            "parts": [
                                "inbox",
                                "{token}",
                                "{email_id}"
                            ],
                            "rename": {
                                "param": {
                                    "emailId": "email_id"
                                }
                            },
                            "transform": {
                                "req": "`reqdata`",
                                "res": "`body`"
                            },
                            "args": {
                                "params": [
                                    {
                                        "name": "email_id",
                                        "orig": "email_id",
                                        "type": "`$STRING`",
                                        "kind": "param",
                                        "reqd": true
                                    },
                                    {
                                        "name": "token",
                                        "orig": "token",
                                        "type": "`$STRING`",
                                        "kind": "param",
                                        "reqd": true
                                    }
                                ]
                            },
                            "select": {
                                "exist": [
                                    "email_id",
                                    "token"
                                ]
                            }
                        }
                    ]
                },
                "remove": {
                    "input": "data",
                    "name": "remove",
                    "points": [
                        {
                            "kind": "http",
                            "method": "DELETE",
                            "orig": "/inbox/{token}/{emailId}",
                            "segments": [
                                {
                                    "lit": "inbox"
                                },
                                {
                                    "var": "token"
                                },
                                {
                                    "var": "email_id"
                                }
                            ],
                            "parts": [
                                "inbox",
                                "{token}",
                                "{email_id}"
                            ],
                            "rename": {
                                "param": {
                                    "emailId": "email_id"
                                }
                            },
                            "transform": {
                                "req": "`reqdata`",
                                "res": "`body`"
                            },
                            "args": {
                                "params": [
                                    {
                                        "name": "email_id",
                                        "orig": "email_id",
                                        "type": "`$STRING`",
                                        "kind": "param",
                                        "reqd": true
                                    },
                                    {
                                        "name": "token",
                                        "orig": "token",
                                        "type": "`$STRING`",
                                        "kind": "param",
                                        "reqd": true
                                    }
                                ]
                            },
                            "select": {
                                "exist": [
                                    "email_id",
                                    "token"
                                ]
                            }
                        }
                    ]
                }
            },
            "relations": {
                "ancestors": [
                    [
                        "$.main.kit.entity.inbox"
                    ]
                ]
            }
        },
        "inbox": {
            "fields": [
                {
                    "name": "emails",
                    "title": "Emails",
                    "type": "`$ARRAY`"
                },
                {
                    "name": "id",
                    "title": "Id",
                    "type": "`$STRING`"
                }
            ],
            "id": {
                "field": "id",
                "name": "id"
            },
            "name": "inbox",
            "op": {
                "create": {
                    "input": "data",
                    "name": "create",
                    "points": [
                        {
                            "kind": "http",
                            "method": "POST",
                            "orig": "/inbox/create",
                            "segments": [
                                {
                                    "lit": "inbox"
                                },
                                {
                                    "lit": "create"
                                }
                            ],
                            "parts": [
                                "inbox",
                                "create"
                            ],
                            "rename": {},
                            "transform": {
                                "req": "`reqdata`",
                                "res": "`body`"
                            },
                            "args": {},
                            "select": {
                                "$action": "create"
                            }
                        },
                        {
                            "kind": "http",
                            "method": "POST",
                            "orig": "/inbox/custom",
                            "segments": [
                                {
                                    "lit": "inbox"
                                },
                                {
                                    "lit": "custom"
                                }
                            ],
                            "parts": [
                                "inbox",
                                "custom"
                            ],
                            "rename": {},
                            "transform": {
                                "req": "`reqdata`",
                                "res": "`body`"
                            },
                            "args": {},
                            "select": {
                                "$action": "custom"
                            }
                        }
                    ]
                },
                "load": {
                    "input": "data",
                    "name": "load",
                    "points": [
                        {
                            "kind": "http",
                            "method": "GET",
                            "orig": "/inbox/{token}",
                            "segments": [
                                {
                                    "lit": "inbox"
                                },
                                {
                                    "var": "id"
                                }
                            ],
                            "parts": [
                                "inbox",
                                "{id}"
                            ],
                            "rename": {
                                "param": {
                                    "token": "id"
                                }
                            },
                            "transform": {
                                "req": "`reqdata`",
                                "res": "`body`"
                            },
                            "args": {
                                "params": [
                                    {
                                        "name": "id",
                                        "orig": "token",
                                        "type": "`$STRING`",
                                        "kind": "param",
                                        "reqd": true
                                    }
                                ]
                            },
                            "select": {
                                "exist": [
                                    "id"
                                ]
                            }
                        }
                    ]
                },
                "remove": {
                    "input": "data",
                    "name": "remove",
                    "points": [
                        {
                            "kind": "http",
                            "method": "DELETE",
                            "orig": "/inbox/{token}",
                            "segments": [
                                {
                                    "lit": "inbox"
                                },
                                {
                                    "var": "id"
                                }
                            ],
                            "parts": [
                                "inbox",
                                "{id}"
                            ],
                            "rename": {
                                "param": {
                                    "token": "id"
                                }
                            },
                            "transform": {
                                "req": "`reqdata`",
                                "res": "`body`"
                            },
                            "args": {
                                "params": [
                                    {
                                        "name": "id",
                                        "orig": "token",
                                        "type": "`$STRING`",
                                        "kind": "param",
                                        "reqd": true
                                    }
                                ]
                            },
                            "select": {
                                "exist": [
                                    "id"
                                ]
                            }
                        }
                    ]
                }
            },
            "relations": {
                "ancestors": []
            }
        }
    };
}
const config = new Config();
exports.config = config;
//# sourceMappingURL=Config.js.map