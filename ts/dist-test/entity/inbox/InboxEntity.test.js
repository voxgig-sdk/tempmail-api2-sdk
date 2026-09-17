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
(0, node_test_1.describe)('InboxEntity', async () => {
    // Per-test live pacing. Delay is read from sdk-test-control.json's
    // `test.live.delayMs`; only sleeps when TEMPMAIL_API2_TEST_LIVE=TRUE.
    (0, node_test_1.afterEach)((0, utility_1.liveDelay)('TEMPMAIL_API2_TEST_LIVE'));
    (0, node_test_1.test)('instance', async () => {
        const testsdk = __1.TempmailApi2SDK.test();
        const ent = testsdk.Inbox();
        (0, node_assert_1.default)(null != ent);
    });
    (0, node_test_1.test)('basic', async (t) => {
        const live = 'TRUE' === process.env.TEMPMAIL_API2_TEST_LIVE;
        for (const op of ['create', 'load', 'remove']) {
            if (!live && (0, utility_1.maybeSkipControl)(t, 'entityOp', 'inbox.' + op, live))
                return;
        }
        const setup = basicSetup();
        if (setup.live) {
            return (0, live_entity_1.runLiveEntity)(setup, { "active": true, "alias": { "field": {} }, "fields": [{ "active": true, "name": "emails", "req": false, "type": "`$ARRAY`", "index$": 0 }, { "active": true, "name": "id", "req": false, "type": "`$STRING`", "index$": 1 }], "id": { "field": "id", "name": "id" }, "name": "inbox", "op": { "create": { "input": "data", "name": "create", "points": [{ "active": true, "args": {}, "contract": { "id": "POST /inbox/create", "json": "{\"operationId\":\"createInbox\",\"parameters\":[],\"protocol\":\"http\",\"responses\":{\"200\":{\"content\":{\"application/json\":{\"schema\":{\"properties\":{\"email\":{\"description\":\"The generated temporary email address\",\"format\":\"email\",\"type\":\"string\"},\"token\":{\"description\":\"Authentication token for accessing the inbox\",\"type\":\"string\"}},\"type\":\"object\"}}},\"description\":\"Successfully created temporary inbox\"},\"400\":{\"description\":\"Bad request\"},\"500\":{\"description\":\"Internal server error\"}},\"securitySource\":\"unspecified\"}", "source": "openapi3", "version": 1 }, "kind": "http", "method": "POST", "orig": "/inbox/create", "segments": [{ "lit": "inbox" }, { "lit": "create" }], "select": { "$action": "create" }, "transform": { "req": "`reqdata`", "res": "`body`" }, "index$": 0 }, { "active": true, "args": {}, "contract": { "id": "POST /inbox/custom", "json": "{\"operationId\":\"createCustomInbox\",\"parameters\":[],\"protocol\":\"http\",\"requestBody\":{\"content\":{\"application/json\":{\"schema\":{\"properties\":{\"domain\":{\"description\":\"Domain for the email address (optional)\",\"type\":\"string\"},\"username\":{\"description\":\"Desired username for the email address\",\"type\":\"string\"}},\"required\":[\"username\"],\"type\":\"object\"}}},\"required\":true},\"responses\":{\"200\":{\"content\":{\"application/json\":{\"schema\":{\"properties\":{\"email\":{\"description\":\"The created custom email address\",\"format\":\"email\",\"type\":\"string\"},\"token\":{\"description\":\"Authentication token for accessing the inbox\",\"type\":\"string\"}},\"type\":\"object\"}}},\"description\":\"Successfully created custom inbox\"},\"400\":{\"description\":\"Bad request - Username already taken or invalid\"},\"500\":{\"description\":\"Internal server error\"}},\"securitySource\":\"unspecified\"}", "source": "openapi3", "version": 1 }, "kind": "http", "method": "POST", "orig": "/inbox/custom", "segments": [{ "lit": "inbox" }, { "lit": "custom" }], "select": { "$action": "custom" }, "transform": { "req": "`reqdata`", "res": "`body`" }, "index$": 1 }], "key$": "create" }, "load": { "input": "data", "name": "load", "points": [{ "active": true, "args": { "params": [{ "active": true, "kind": "param", "name": "id", "orig": "token", "reqd": true, "type": "`$STRING`", "index$": 0 }] }, "contract": { "id": "GET /inbox/{token}", "json": "{\"operationId\":\"getInbox\",\"parameters\":[{\"description\":\"The authentication token for the inbox\",\"in\":\"path\",\"name\":\"token\",\"required\":true,\"schema\":{\"type\":\"string\"}}],\"protocol\":\"http\",\"responses\":{\"200\":{\"content\":{\"application/json\":{\"schema\":{\"properties\":{\"emails\":{\"items\":{\"properties\":{\"body\":{\"description\":\"Email body content\",\"type\":\"string\"},\"date\":{\"description\":\"Timestamp when email was received\",\"format\":\"date-time\",\"type\":\"string\"},\"from\":{\"description\":\"Sender email address\",\"format\":\"email\",\"type\":\"string\"},\"id\":{\"description\":\"Unique identifier for the email\",\"type\":\"string\"},\"subject\":{\"description\":\"Email subject\",\"type\":\"string\"}},\"type\":\"object\"},\"type\":\"array\"}},\"type\":\"object\"}}},\"description\":\"Successfully retrieved inbox messages\"},\"401\":{\"description\":\"Unauthorized - Invalid token\"},\"404\":{\"description\":\"Inbox not found\"},\"500\":{\"description\":\"Internal server error\"}},\"securitySource\":\"unspecified\"}", "source": "openapi3", "version": 1 }, "kind": "http", "method": "GET", "orig": "/inbox/{token}", "rename": { "param": { "token": "id" } }, "segments": [{ "lit": "inbox" }, { "var": "id" }], "select": { "exist": ["id"] }, "transform": { "req": "`reqdata`", "res": "`body`" }, "index$": 0 }], "key$": "load" }, "remove": { "input": "data", "name": "remove", "points": [{ "active": true, "args": { "params": [{ "active": true, "kind": "param", "name": "id", "orig": "token", "reqd": true, "type": "`$STRING`", "index$": 0 }] }, "contract": { "id": "DELETE /inbox/{token}", "json": "{\"operationId\":\"deleteInbox\",\"parameters\":[{\"description\":\"The authentication token for the inbox\",\"in\":\"path\",\"name\":\"token\",\"required\":true,\"schema\":{\"type\":\"string\"}}],\"protocol\":\"http\",\"responses\":{\"200\":{\"content\":{\"application/json\":{\"schema\":{\"properties\":{\"message\":{\"example\":\"Inbox deleted successfully\",\"type\":\"string\"}},\"type\":\"object\"}}},\"description\":\"Inbox successfully deleted\"},\"401\":{\"description\":\"Unauthorized - Invalid token\"},\"404\":{\"description\":\"Inbox not found\"},\"500\":{\"description\":\"Internal server error\"}},\"securitySource\":\"unspecified\"}", "source": "openapi3", "version": 1 }, "kind": "http", "method": "DELETE", "orig": "/inbox/{token}", "rename": { "param": { "token": "id" } }, "segments": [{ "lit": "inbox" }, { "var": "id" }], "select": { "exist": ["id"] }, "transform": { "req": "`reqdata`", "res": "`body`" }, "index$": 0 }], "key$": "remove" } }, "relations": { "ancestors": [] }, "key$": "inbox", "name__orig": "inbox", "Name": "Inbox", "name_": "inbox", "name-": "inbox", "NAME": "INBOX", "index$": 2 }, { "active": true, "entity": "inbox", "key$": "BasicInboxFlow", "kind": "basic", "name": "BasicInboxFlow", "param": {}, "step": [{ "active": true, "data": {}, "input": { "ref": "inbox_ref01" }, "match": {}, "op": "create", "spec": [], "valid": [], "index$": 0 }, { "active": true, "data": {}, "input": { "ref": "inbox_ref01", "srcdatavar": "inbox_ref01_data", "suffix": "_dt0" }, "match": { "id": "inbox01" }, "op": "load", "spec": [], "valid": [{ "apply": "TextFieldMark", "def": { "mark": "Mark01-inbox_ref01" } }], "index$": 1 }, { "active": true, "data": {}, "input": { "ref": "inbox_ref01", "suffix": "_rm0" }, "match": { "id": "inbox01" }, "op": "remove", "spec": [], "valid": [], "index$": 2 }] }, 'Inbox');
        }
        const client = setup.client;
        const struct = setup.struct;
        const isempty = struct.isempty;
        const select = struct.select;
        // CREATE
        const inbox_ref01_ent = client.Inbox();
        let inbox_ref01_data = setup.data.new.inbox['inbox_ref01'];
        inbox_ref01_data = (await inbox_ref01_ent.create(inbox_ref01_data)).data();
        (0, node_assert_1.default)(null != inbox_ref01_data.id);
        // LOAD
        const inbox_ref01_match_dt0 = {};
        inbox_ref01_match_dt0.id = inbox_ref01_data.id;
        const inbox_ref01_data_dt0 = (await inbox_ref01_ent.load(inbox_ref01_match_dt0)).data();
        (0, node_assert_1.default)(inbox_ref01_data_dt0.id === inbox_ref01_data.id);
        // REMOVE
        const inbox_ref01_match_rm0 = { id: inbox_ref01_data.id };
        await inbox_ref01_ent.remove(inbox_ref01_match_rm0);
    });
});
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