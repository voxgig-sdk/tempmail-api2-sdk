"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FEATURE_PLUGINS = exports.config = void 0;
const TestFeature_1 = require("./feature/test/TestFeature");
const FEATURE_CLASS = {
    test: TestFeature_1.TestFeature,
};
// Per-feature plugin DEFINITIONS (voxgig/plugin `Definition` values), from
// the model's active plugin groups. A feature that takes a `plugins` option
// (secrets over sekreto) reads its own entry; a feature with no plugins has
// none. Named imports above make each definition statically reachable, so
// an SDK carries exactly the plugin modules its model selects — the same
// leanness the old side-effect registry imports bought, without a registry.
const FEATURE_PLUGINS = {};
exports.FEATURE_PLUGINS = FEATURE_PLUGINS;
class Config {
    makeFeature(fn) {
        const fc = FEATURE_CLASS[fn];
        const fi = new fc();
        // TODO: errors etc
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
        test: {
            "options": {
                "active": false
            },
            "transport": "base"
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
                            "args": {},
                            "kind": "http",
                            "method": "GET",
                            "orig": "/domains",
                            "segments": [
                                {
                                    "lit": "domains"
                                }
                            ],
                            "select": {},
                            "transform": {
                                "req": "`reqdata`",
                                "res": "`body.domains`"
                            },
                            "parts": [
                                "domains"
                            ]
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
                    "type": "`$ARRAY`"
                },
                {
                    "name": "body",
                    "short": "Email body content",
                    "type": "`$STRING`"
                },
                {
                    "format": "date-time",
                    "name": "date",
                    "short": "Timestamp when email was received",
                    "type": "`$STRING`"
                },
                {
                    "format": "email",
                    "name": "from",
                    "short": "Sender email address",
                    "type": "`$STRING`"
                },
                {
                    "name": "html",
                    "short": "HTML version of email body",
                    "type": "`$STRING`"
                },
                {
                    "name": "id",
                    "short": "Unique identifier for the email",
                    "type": "`$STRING`"
                },
                {
                    "name": "subject",
                    "short": "Email subject",
                    "type": "`$STRING`"
                },
                {
                    "format": "email",
                    "name": "to",
                    "short": "Recipient email address",
                    "type": "`$STRING`"
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
                            "args": {
                                "params": [
                                    {
                                        "kind": "param",
                                        "name": "email_id",
                                        "orig": "email_id",
                                        "reqd": true,
                                        "type": "`$STRING`"
                                    },
                                    {
                                        "kind": "param",
                                        "name": "token",
                                        "orig": "token",
                                        "reqd": true,
                                        "type": "`$STRING`"
                                    }
                                ]
                            },
                            "kind": "http",
                            "method": "GET",
                            "orig": "/inbox/{token}/{emailId}",
                            "rename": {
                                "param": {
                                    "emailId": "email_id"
                                }
                            },
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
                            "select": {
                                "exist": [
                                    "email_id",
                                    "token"
                                ]
                            },
                            "transform": {
                                "req": "`reqdata`",
                                "res": "`body`"
                            },
                            "parts": [
                                "inbox",
                                "{token}",
                                "{email_id}"
                            ]
                        }
                    ]
                },
                "remove": {
                    "input": "data",
                    "name": "remove",
                    "points": [
                        {
                            "args": {
                                "params": [
                                    {
                                        "kind": "param",
                                        "name": "email_id",
                                        "orig": "email_id",
                                        "reqd": true,
                                        "type": "`$STRING`"
                                    },
                                    {
                                        "kind": "param",
                                        "name": "token",
                                        "orig": "token",
                                        "reqd": true,
                                        "type": "`$STRING`"
                                    }
                                ]
                            },
                            "kind": "http",
                            "method": "DELETE",
                            "orig": "/inbox/{token}/{emailId}",
                            "rename": {
                                "param": {
                                    "emailId": "email_id"
                                }
                            },
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
                            "select": {
                                "exist": [
                                    "email_id",
                                    "token"
                                ]
                            },
                            "transform": {
                                "req": "`reqdata`",
                                "res": "`body`"
                            },
                            "parts": [
                                "inbox",
                                "{token}",
                                "{email_id}"
                            ]
                        }
                    ]
                }
            },
            "relations": {
                "ancestors": [
                    [
                        "inbox"
                    ]
                ]
            }
        },
        "inbox": {
            "fields": [
                {
                    "name": "domain",
                    "short": "Domain for the email address (optional)",
                    "type": "`$STRING`"
                },
                {
                    "format": "email",
                    "name": "email",
                    "short": "The generated temporary email address",
                    "type": "`$STRING`"
                },
                {
                    "name": "emails",
                    "type": "`$ARRAY`"
                },
                {
                    "name": "id",
                    "type": "`$STRING`"
                },
                {
                    "name": "token",
                    "short": "Authentication token for accessing the inbox",
                    "type": "`$STRING`"
                },
                {
                    "name": "username",
                    "req": true,
                    "short": "Desired username for the email address",
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
                            "args": {},
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
                            "select": {
                                "$action": "create"
                            },
                            "transform": {
                                "req": "`reqdata`",
                                "res": "`body`"
                            },
                            "parts": [
                                "inbox",
                                "create"
                            ]
                        },
                        {
                            "args": {},
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
                            "select": {
                                "$action": "custom"
                            },
                            "transform": {
                                "req": "`reqdata`",
                                "res": "`body`"
                            },
                            "parts": [
                                "inbox",
                                "custom"
                            ]
                        }
                    ]
                },
                "load": {
                    "input": "data",
                    "name": "load",
                    "points": [
                        {
                            "args": {
                                "params": [
                                    {
                                        "kind": "param",
                                        "name": "id",
                                        "orig": "token",
                                        "reqd": true,
                                        "type": "`$STRING`"
                                    }
                                ]
                            },
                            "kind": "http",
                            "method": "GET",
                            "orig": "/inbox/{token}",
                            "rename": {
                                "param": {
                                    "token": "id"
                                }
                            },
                            "segments": [
                                {
                                    "lit": "inbox"
                                },
                                {
                                    "var": "id"
                                }
                            ],
                            "select": {
                                "exist": [
                                    "id"
                                ]
                            },
                            "transform": {
                                "req": "`reqdata`",
                                "res": "`body`"
                            },
                            "parts": [
                                "inbox",
                                "{id}"
                            ]
                        }
                    ]
                },
                "remove": {
                    "input": "data",
                    "name": "remove",
                    "points": [
                        {
                            "args": {
                                "params": [
                                    {
                                        "kind": "param",
                                        "name": "id",
                                        "orig": "token",
                                        "reqd": true,
                                        "type": "`$STRING`"
                                    }
                                ]
                            },
                            "kind": "http",
                            "method": "DELETE",
                            "orig": "/inbox/{token}",
                            "rename": {
                                "param": {
                                    "token": "id"
                                }
                            },
                            "segments": [
                                {
                                    "lit": "inbox"
                                },
                                {
                                    "var": "id"
                                }
                            ],
                            "select": {
                                "exist": [
                                    "id"
                                ]
                            },
                            "transform": {
                                "req": "`reqdata`",
                                "res": "`body`"
                            },
                            "parts": [
                                "inbox",
                                "{id}"
                            ]
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