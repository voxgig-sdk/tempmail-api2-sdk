"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = __importDefault(require("node:path"));
const Fs = __importStar(require("node:fs"));
const node_test_1 = require("node:test");
const node_assert_1 = __importDefault(require("node:assert"));
const live_runner_1 = require("../../live-runner");
const live_entity_1 = require("../../live-entity");
const __1 = require("../../..");
const utility_1 = require("../../utility");
// AFTER the imports on purpose: TypeScript hoists `import` above any
// statement in the emitted CommonJS, so a loader placed above them would
// run only after every imported module had already been evaluated - and
// anything reading process.env at module scope would miss these values.
(0, utility_1.loadEnvLocal)(__dirname + '/../../../.env.local');
(0, node_test_1.describe)('EmailEntity', async () => {
    // Per-test live pacing. Delay is read from sdk-test-control.json's
    // `test.live.delayMs`; only sleeps when TEMPMAIL_API2_TEST_LIVE=TRUE.
    (0, node_test_1.afterEach)((0, utility_1.liveDelay)('TEMPMAIL_API2_TEST_LIVE'));
    (0, node_test_1.test)('instance', async () => {
        const testsdk = __1.TempmailApi2SDK.test();
        const ent = testsdk.Email();
        (0, node_assert_1.default)(null != ent);
    });
    (0, node_test_1.test)('basic', async (t) => {
        const live = 'TRUE' === process.env.TEMPMAIL_API2_TEST_LIVE;
        for (const op of ['load']) {
            if (!live && (0, utility_1.maybeSkipControl)(t, 'entityOp', 'email.' + op, live))
                return;
        }
        const setup = basicSetup();
        if (setup.live) {
            return (0, live_entity_1.runLiveEntity)(setup, { "active": true, "alias": { "field": {} }, "fields": [{ "active": true, "name": "attachments", "req": false, "type": "`$ARRAY`", "index$": 0 }, { "active": true, "name": "body", "req": false, "short": "Email body content", "type": "`$STRING`", "index$": 1 }, { "active": true, "format": "date-time", "name": "date", "req": false, "short": "Timestamp when email was received", "type": "`$STRING`", "index$": 2 }, { "active": true, "format": "email", "name": "from", "req": false, "short": "Sender email address", "type": "`$STRING`", "index$": 3 }, { "active": true, "name": "html", "req": false, "short": "HTML version of email body", "type": "`$STRING`", "index$": 4 }, { "active": true, "name": "id", "req": false, "short": "Unique identifier for the email", "type": "`$STRING`", "index$": 5 }, { "active": true, "name": "subject", "req": false, "short": "Email subject", "type": "`$STRING`", "index$": 6 }, { "active": true, "format": "email", "name": "to", "req": false, "short": "Recipient email address", "type": "`$STRING`", "index$": 7 }], "id": { "field": "id", "name": "id", "parts": ["token", "email_id"], "sep": "/" }, "name": "email", "op": { "load": { "input": "data", "name": "load", "points": [{ "active": true, "args": { "params": [{ "active": true, "kind": "param", "name": "email_id", "orig": "email_id", "reqd": true, "type": "`$STRING`", "index$": 0 }, { "active": true, "kind": "param", "name": "token", "orig": "token", "reqd": true, "type": "`$STRING`", "index$": 1 }] }, "contract": { "id": "GET /inbox/{token}/{emailId}", "json": "{\"operationId\":\"getEmail\",\"parameters\":[{\"description\":\"The authentication token for the inbox\",\"in\":\"path\",\"name\":\"token\",\"required\":true,\"schema\":{\"type\":\"string\"}},{\"description\":\"The unique identifier of the email\",\"in\":\"path\",\"name\":\"emailId\",\"required\":true,\"schema\":{\"type\":\"string\"}}],\"protocol\":\"http\",\"responses\":{\"200\":{\"content\":{\"application/json\":{\"schema\":{\"properties\":{\"attachments\":{\"items\":{\"properties\":{\"contentType\":{\"type\":\"string\"},\"filename\":{\"type\":\"string\"},\"size\":{\"type\":\"integer\"}},\"type\":\"object\"},\"type\":\"array\"},\"body\":{\"description\":\"Email body content\",\"type\":\"string\"},\"date\":{\"description\":\"Timestamp when email was received\",\"format\":\"date-time\",\"type\":\"string\"},\"from\":{\"description\":\"Sender email address\",\"format\":\"email\",\"type\":\"string\"},\"html\":{\"description\":\"HTML version of email body\",\"type\":\"string\"},\"id\":{\"description\":\"Unique identifier for the email\",\"type\":\"string\"},\"subject\":{\"description\":\"Email subject\",\"type\":\"string\"},\"to\":{\"description\":\"Recipient email address\",\"format\":\"email\",\"type\":\"string\"}},\"type\":\"object\"}}},\"description\":\"Successfully retrieved email\"},\"401\":{\"description\":\"Unauthorized - Invalid token\"},\"404\":{\"description\":\"Email not found\"},\"500\":{\"description\":\"Internal server error\"}},\"securitySource\":\"unspecified\"}", "source": "openapi3", "version": 1 }, "kind": "http", "method": "GET", "orig": "/inbox/{token}/{emailId}", "rename": { "param": { "emailId": "email_id" } }, "segments": [{ "lit": "inbox" }, { "var": "token" }, { "var": "email_id" }], "select": { "exist": ["email_id", "token"] }, "transform": { "req": "`reqdata`", "res": "`body`" }, "index$": 0 }], "key$": "load" }, "remove": { "input": "data", "name": "remove", "points": [{ "active": true, "args": { "params": [{ "active": true, "kind": "param", "name": "email_id", "orig": "email_id", "reqd": true, "type": "`$STRING`", "index$": 0 }, { "active": true, "kind": "param", "name": "token", "orig": "token", "reqd": true, "type": "`$STRING`", "index$": 1 }] }, "contract": { "id": "DELETE /inbox/{token}/{emailId}", "json": "{\"operationId\":\"deleteEmail\",\"parameters\":[{\"description\":\"The authentication token for the inbox\",\"in\":\"path\",\"name\":\"token\",\"required\":true,\"schema\":{\"type\":\"string\"}},{\"description\":\"The unique identifier of the email\",\"in\":\"path\",\"name\":\"emailId\",\"required\":true,\"schema\":{\"type\":\"string\"}}],\"protocol\":\"http\",\"responses\":{\"200\":{\"content\":{\"application/json\":{\"schema\":{\"properties\":{\"message\":{\"example\":\"Email deleted successfully\",\"type\":\"string\"}},\"type\":\"object\"}}},\"description\":\"Email successfully deleted\"},\"401\":{\"description\":\"Unauthorized - Invalid token\"},\"404\":{\"description\":\"Email not found\"},\"500\":{\"description\":\"Internal server error\"}},\"securitySource\":\"unspecified\"}", "source": "openapi3", "version": 1 }, "kind": "http", "method": "DELETE", "orig": "/inbox/{token}/{emailId}", "rename": { "param": { "emailId": "email_id" } }, "segments": [{ "lit": "inbox" }, { "var": "token" }, { "var": "email_id" }], "select": { "exist": ["email_id", "token"] }, "transform": { "req": "`reqdata`", "res": "`body`" }, "index$": 0 }], "key$": "remove" } }, "relations": { "ancestors": [["inbox"]] }, "key$": "email", "name__orig": "email", "Name": "Email", "name_": "email", "name-": "email", "NAME": "EMAIL", "index$": 1 }, { "active": true, "entity": "email", "key$": "BasicEmailFlow", "kind": "basic", "name": "BasicEmailFlow", "param": {}, "step": [{ "active": true, "data": {}, "input": { "ref": "email_ref01", "srcdatavar": "email_ref01_data", "suffix": "_dt0" }, "match": { "id": "email01", "token": "token01" }, "op": "load", "spec": [], "valid": [{ "apply": "TextFieldMark", "def": { "mark": "Mark01-email_ref01" } }], "index$": 0 }] }, 'Email');
        }
        const client = setup.client;
        const struct = setup.struct;
        const isempty = struct.isempty;
        const select = struct.select;
        let email_ref01_data = Object.values(setup.data.existing.email)[0];
        // LOAD
        const email_ref01_ent = client.Email();
        const email_ref01_match_dt0 = {};
        email_ref01_match_dt0.id = email_ref01_data.id;
        const email_ref01_data_dt0 = (await email_ref01_ent.load(email_ref01_match_dt0)).data();
        (0, node_assert_1.default)(email_ref01_data_dt0.id === email_ref01_data.id);
    });
});
function basicSetup(extra) {
    // TODO: fix test def options
    const options = {}; // null
    // TODO: needs test utility to resolve path
    const entityDataFile = node_path_1.default.resolve(__dirname, '../../../../.sdk/test/entity/email/EmailTestData.json');
    // TODO: file ready util needed?
    const entityDataSource = Fs.readFileSync(entityDataFile).toString('utf8');
    // TODO: need a xlang JSON parse utility in voxgig/struct with better error msgs
    const entityData = JSON.parse(entityDataSource);
    options.entity = entityData.existing;
    let client = __1.TempmailApi2SDK.test(options, extra);
    const struct = client.utility().struct;
    const merge = struct.merge;
    const transform = struct.transform;
    let idmap = transform(['email01', 'email02', 'email03', 'inbox01', 'inbox02', 'inbox03'], {
        '`$PACK`': ['', {
                '`$KEY`': '`$COPY`',
                '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
            }]
    });
    const env = (0, utility_1.envOverride)({
        'TEMPMAIL_API2_TEST_EMAIL_ENTID': idmap,
        'TEMPMAIL_API2_TEST_LIVE': 'FALSE',
        'TEMPMAIL_API2_TEST_EXPLAIN': 'FALSE',
    });
    idmap = env['TEMPMAIL_API2_TEST_EMAIL_ENTID'];
    const live = 'TRUE' === env.TEMPMAIL_API2_TEST_LIVE;
    const transport = (0, live_runner_1.createLiveTransport)();
    if (live) {
        const rawIds = process.env['TEMPMAIL_API2_TEST_EMAIL_ENTID'];
        idmap = rawIds && rawIds.trim() ? JSON.parse(rawIds) : {};
        if (!idmap || Array.isArray(idmap) || typeof idmap !== 'object') {
            throw new Error('Live ENTID must be a JSON object');
        }
        client = new __1.TempmailApi2SDK(merge([
            // FIRST, so the generated fields below win: sdk-test-control.json's
            // test.client.options adds to the live client, it does not redirect it.
            (0, utility_1.liveClientOptions)(),
            {},
            // 'extra || {}', not a bare 'extra': struct.merge returns UNDEFINED when the
            // last entry is undefined, and basicSetup is normally called with no
            // argument at all - so a bare 'extra' silently discarded the apikey
            // and server values above and handed the SDK undefined. Harmless
            // while there was nothing in that object; not harmless now.
            extra || {},
            { system: { fetch: transport.fetch } }
        ]));
    }
    const setup = {
        idmap,
        env,
        options,
        client,
        struct,
        data: entityData,
        explain: 'TRUE' === env.TEMPMAIL_API2_TEST_EXPLAIN,
        live,
        transport,
        now: Date.now(),
    };
    return setup;
}
//# sourceMappingURL=EmailEntity.test.js.map