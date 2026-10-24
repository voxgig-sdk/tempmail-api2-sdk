# Inbox entity test

import json
import os
import time

import pytest

from tempmailapi2_sdk.utility.voxgig_struct import voxgig_struct as vs
from tempmailapi2_sdk import TempmailApi2SDK
from tempmailapi2_sdk.core import helpers
from tempmailapi2_sdk.config import shared_config
from tempmailapi2_sdk.feature.base_feature import TempmailApi2BaseFeature

_TEST_DIR = os.path.dirname(os.path.abspath(__file__))
from test import runner



# main.kit.test.live.strict is true (the default is true): a live
# request that fails, or a live test missing an input it needs,
# fails the test.
# An account with no record for a test to read skips it either way.
LIVE_STRICT = True


class TestInboxEntity:

    def test_should_create_instance(self):
        testsdk = TempmailApi2SDK.test(None, None)
        ent = testsdk.Inbox(None)
        assert ent is not None

    def test_should_refuse_an_invalid_request(self):
        if "validate" not in (shared_config().get("feature") or {}):
            pytest.skip("feature not present in this SDK: validate")
        client = TempmailApi2SDK.test(
            None, {"feature": {"validate": {"active": True}}})
        with pytest.raises(Exception) as err:
            client.Inbox(None).load({"id": 1}, None)
        assert "validate_failed" == getattr(err.value, "code", None)

    def test_should_run_basic_flow(self):
        setup = _inbox_basic_setup(None)
        # Per-op sdk-test-control.json skip — basic test exercises a flow with
        # multiple ops; skipping any one skips the whole flow (steps depend
        # on each other).
        _live = setup.get("live", False)
        for _op in ["load", "remove"]:
            _skip, _reason = runner.is_control_skipped("entityOp", "inbox." + _op, "live" if _live else "unit")
            if _skip:
                pytest.skip(_reason or "skipped via sdk-test-control.json")
                return
        if setup["live"]:
            runner.live_miss(LIVE_STRICT, "Live entity test blocked: " + "the flow loads a inbox record it has no list to find")
        client = setup["client"]

        # Bootstrap entity data from existing test data.
        inbox_ref01_data_raw = vs.items(helpers.to_map(
            vs.getpath(setup["data"], "existing.inbox")))
        inbox_ref01_data = None
        if len(inbox_ref01_data_raw) > 0:
            inbox_ref01_data = helpers.to_map(inbox_ref01_data_raw[0][1])

        # LOAD
        inbox_ref01_ent = client.Inbox(None)
        inbox_ref01_match_dt0 = {
            "id": inbox_ref01_data["id"],
        }
        inbox_ref01_data_dt0_loaded = inbox_ref01_ent.load(inbox_ref01_match_dt0, None)
        inbox_ref01_data_dt0_load_result = helpers.to_map(runner.entity_data(inbox_ref01_data_dt0_loaded))
        assert inbox_ref01_data_dt0_load_result is not None
        assert inbox_ref01_data_dt0_load_result["id"] == inbox_ref01_data["id"]



def _inbox_basic_setup(extra):
    runner.load_env_local()

    entity_data_file = os.path.join(_TEST_DIR, "../../.sdk/test/entity/inbox/InboxTestData.json")
    with open(entity_data_file, "r", encoding="utf-8") as f:
        entity_data_source = f.read()

    entity_data = json.loads(entity_data_source)

    options = {}
    options["entity"] = entity_data.get("existing")

    client = TempmailApi2SDK.test(options, extra)

    # Generate idmap via transform.
    idmap = vs.transform(
        ["inbox01", "inbox02", "inbox03"],
        {
            "`$PACK`": ["", {
                "`$KEY`": "`$COPY`",
                "`$VAL`": ["`$FORMAT`", "upper", "`$COPY`"],
            }],
        }
    )

    # Whether *_ENTID supplied the idmap, read before env_override consumes
    # it: without it, the ids a live flow binds are the fixture's synthetic ones.
    _entid_env_raw = os.environ.get(
        "TEMPMAIL_API2_TEST_INBOX_ENTID")
    _idmap_overridden = _entid_env_raw is not None and _entid_env_raw.strip().startswith("{")

    env = runner.env_override({
        "TEMPMAIL_API2_TEST_INBOX_ENTID": idmap,
        "TEMPMAIL_API2_TEST_LIVE": "FALSE",
        "TEMPMAIL_API2_TEST_EXPLAIN": "FALSE",
    })

    idmap_resolved = helpers.to_map(
        env.get("TEMPMAIL_API2_TEST_INBOX_ENTID"))
    if idmap_resolved is None:
        idmap_resolved = helpers.to_map(idmap)

    if env.get("TEMPMAIL_API2_TEST_LIVE") == "TRUE":
        merged_opts = vs.merge([
            # FIRST, so the generated fields below win: sdk-test-control.json's
            # test.client.options adds to the live client, it does not
            # redirect it.
            runner.live_client_options(),
            {
            },
            extra or {},
        ])
        client = TempmailApi2SDK(helpers.to_map(merged_opts))

    _live = env.get("TEMPMAIL_API2_TEST_LIVE") == "TRUE"
    return {
        "client": client,
        "data": entity_data,
        "idmap": idmap_resolved,
        "env": env,
        "explain": env.get("TEMPMAIL_API2_TEST_EXPLAIN") == "TRUE",
        "live": _live,
        "synthetic_only": _live and not _idmap_overridden,
        "now": int(time.time() * 1000),
    }
