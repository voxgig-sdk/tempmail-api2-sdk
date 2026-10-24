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
(0, utility_1.loadEnvLocal)(__dirname + '/../../../.env.local');
(0, node_test_1.describe)('InboxEntity', async () => {
    // Per-test live pacing. Delay is read from sdk-test-control.json's
    // `test.live.delayMs`; only sleeps when TEMPMAIL_API2_TEST_LIVE=TRUE.
    (0, node_test_1.afterEach)((0, utility_1.liveDelay)('TEMPMAIL_API2_TEST_LIVE'));
    (0, node_test_1.test)('instance', async () => {
        const testsdk = __1.TempmailApi2SDK.test();
        const ent = testsdk.Inbox();
        (0, node_assert_1.default)(null != ent);
    });
    (0, node_test_1.test)('validate', async (t) => {
        if (null == __1.config.feature?.validate) {
            t.skip('feature not present in this SDK: validate');
            return;
        }
        const client = __1.TempmailApi2SDK.test(undefined, { feature: { validate: { active: true } } });
        await node_assert_1.default.rejects(client.Inbox().load({ "id": 1 }), (err) => 'validate_failed' === err.code);
    });
    (0, node_test_1.test)('basic', async (t) => {
        const live = 'TRUE' === process.env.TEMPMAIL_API2_TEST_LIVE;
        for (const op of ['load', 'remove']) {
            if (!live && (0, utility_1.maybeSkipControl)(t, 'entityOp', 'inbox.' + op, live))
                return;
        }
        const setup = basicSetup();
        if (setup.live) {
            return (0, live_entity_1.runLiveEntity)(setup, { "active": true, "alias": { "field": {} }, "fields": { "emails": { "a": true, "h": "Emails", "n": "emails", "r": false, "t": "`$ARRAY`", "key$": "emails", "index$": 0 }, "id": { "a": true, "h": "Id", "n": "id", "r": false, "t": "`$STRING`", "key$": "id", "index$": 1 } }, "id": { "field": "id", "name": "id" }, "name": "inbox", "op": { "create": { "input": "data", "name": "create", "points": [{ "a": true, "co": { "id": "POST /inbox/create", "source": "openapi3", "version": 2 }, "g": {}, "k": "http", "m": "POST", "o": "/inbox/create", "q": { "$action": "create" }, "r": {}, "rs": { "kind": "json", "media": "application/json" }, "s": [{ "lit": "inbox" }, { "lit": "create" }], "t": { "req": "`reqdata`", "res": "`body`" }, "index$": 0 }, { "a": true, "bf": ["domain", "username"], "co": { "id": "POST /inbox/custom", "source": "openapi3", "version": 2 }, "g": {}, "k": "http", "m": "POST", "o": "/inbox/custom", "q": { "$action": "custom" }, "r": {}, "rs": { "kind": "json", "media": "application/json" }, "s": [{ "lit": "inbox" }, { "lit": "custom" }], "t": { "req": "`reqdata`", "res": "`body`" }, "index$": 1 }], "key$": "create" }, "load": { "input": "data", "name": "load", "points": [{ "a": true, "co": { "id": "GET /inbox/{token}", "source": "openapi3", "version": 2 }, "g": { "params": [{ "a": true, "k": "param", "n": "id", "or": "token", "r": true, "t": "`$STRING`", "index$": 0 }] }, "k": "http", "m": "GET", "o": "/inbox/{token}", "q": { "exist": ["id"] }, "r": { "param": { "token": "id" } }, "rs": { "kind": "json", "media": "application/json" }, "s": [{ "lit": "inbox" }, { "var": "id" }], "t": { "req": "`reqdata`", "res": "`body`" }, "index$": 0 }], "key$": "load" }, "remove": { "input": "data", "name": "remove", "points": [{ "a": true, "co": { "id": "DELETE /inbox/{token}", "source": "openapi3", "version": 2 }, "g": { "params": [{ "a": true, "k": "param", "n": "id", "or": "token", "r": true, "t": "`$STRING`", "index$": 0 }] }, "k": "http", "m": "DELETE", "o": "/inbox/{token}", "q": { "exist": ["id"] }, "r": { "param": { "token": "id" } }, "rs": { "kind": "json", "media": "application/json" }, "s": [{ "lit": "inbox" }, { "var": "id" }], "t": { "req": "`reqdata`", "res": "`body`" }, "index$": 0 }], "key$": "remove" } }, "relations": { "ancestors": [] }, "key$": "inbox", "name__orig": "inbox", "Name": "Inbox", "name_": "inbox", "name-": "inbox", "NAME": "INBOX", "index$": 2 }, { "active": true, "entity": "inbox", "key$": "BasicInboxFlow", "kind": "basic", "name": "BasicInboxFlow", "param": {}, "step": [{ "a": false, "d": {}, "i": { "ref": "inbox_ref01" }, "m": {}, "o": "create", "s": [], "v": [], "unreachable": true }, { "a": true, "d": {}, "i": { "ref": "inbox_ref01", "srcdatavar": "inbox_ref01_data", "suffix": "_dt0" }, "m": { "id": "inbox01" }, "o": "load", "s": [], "v": [{ "apply": "TextFieldMark", "def": { "mark": "Mark01-inbox_ref01" } }], "index$": 0 }, { "a": true, "d": {}, "i": { "ref": "inbox_ref01", "suffix": "_rm0" }, "m": { "id": "inbox01" }, "o": "remove", "s": [], "v": [], "index$": 1 }] }, 'Inbox', { "POST /inbox/create": { "protocol": "http", "parameters": [] }, "POST /inbox/custom": { "protocol": "http", "requestBody": { "required": true, "content": { "application/json": { "schema": { "type": "object", "required": ["username"], "properties": { "username": { "type": "string", "description": "Desired username for the email address" }, "domain": { "type": "string", "description": "Domain for the email address (optional)" } } } } } }, "parameters": [] }, "GET /inbox/{token}": { "protocol": "http", "parameters": [{ "name": "token", "in": "path", "required": true, "description": "The authentication token for the inbox", "schema": { "type": "string" }, "index$": 0 }] }, "DELETE /inbox/{token}": { "protocol": "http", "parameters": [{ "name": "token", "in": "path", "required": true, "description": "The authentication token for the inbox", "schema": { "type": "string" }, "index$": 0 }] } }, { strict: LIVE_STRICT, t });
        }
        const client = setup.client;
        const struct = setup.struct;
        const isempty = struct.isempty;
        const select = struct.select;
        let inbox_ref01_data = Object.values(setup.data.existing.inbox)[0];
        // LOAD
        const inbox_ref01_ent = client.Inbox();
        const inbox_ref01_match_dt0 = {};
        inbox_ref01_match_dt0.id = inbox_ref01_data.id;
        const inbox_ref01_data_dt0 = (await inbox_ref01_ent.load(inbox_ref01_match_dt0)).data();
        (0, node_assert_1.default)(inbox_ref01_data_dt0.id === inbox_ref01_data.id);
    });
});
// main.kit.test.live.strict is true (the default is true): a live
// request that fails, or a live test missing an input it needs,
// fails the test.
// An account with no record for a test to read skips it either way.
const LIVE_STRICT = true;
function basicSetup(extra) {
    // TODO: fix test def options
    const options = {}; // null
    // TODO: needs test utility to resolve path
    const entityDataFile = node_path_1.default.resolve(__dirname, '../../../../.sdk/test/entity/inbox/InboxTestData.json');
    // TODO: file ready util needed?
    const entityDataSource = Fs.readFileSync(entityDataFile).toString('utf8');
    // TODO: need a xlang JSON parse utility in voxgig/struct with better error msgs
    const entityData = JSON.parse(entityDataSource);
    options.entity = entityData.existing;
    let client = __1.TempmailApi2SDK.test(options, extra);
    const struct = client.utility().struct;
    const merge = struct.merge;
    const transform = struct.transform;
    let idmap = transform(['inbox01', 'inbox02', 'inbox03'], {
        '`$PACK`': ['', {
                '`$KEY`': '`$COPY`',
                '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
            }]
    });
    const env = (0, utility_1.envOverride)({
        'TEMPMAIL_API2_TEST_INBOX_ENTID': idmap,
        'TEMPMAIL_API2_TEST_LIVE': 'FALSE',
        'TEMPMAIL_API2_TEST_EXPLAIN': 'FALSE',
    });
    idmap = env['TEMPMAIL_API2_TEST_INBOX_ENTID'];
    const live = 'TRUE' === env.TEMPMAIL_API2_TEST_LIVE;
    const transport = (0, live_runner_1.createLiveTransport)();
    if (live) {
        const rawIds = process.env['TEMPMAIL_API2_TEST_INBOX_ENTID'];
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
//# sourceMappingURL=InboxEntity.test.js.map