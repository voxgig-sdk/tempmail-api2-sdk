# Domain entity test

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


class _FailHook(TempmailApi2BaseFeature):
    def __init__(self):
        super().__init__()
        self.name = "failhook"
        self.unexpected = 0

    def init(self, ctx, options):
        pass

    def PreSpec(self, ctx):
        raise RuntimeError("domain hook failed")

    def PreUnexpected(self, ctx):
        self.unexpected += 1



# main.kit.test.live.strict is true (the default is true): a live
# request that fails, or a live test missing an input it needs,
# fails the test.
# An account with no record for a test to read skips it either way.
LIVE_STRICT = True


class TestDomainEntity:

    def test_should_create_instance(self):
        testsdk = TempmailApi2SDK.test(None, None)
        ent = testsdk.Domain(None)
        assert ent is not None

    def test_should_stream(self):
        # Feature #4: the entity stream(action, ...) method runs the op
        # pipeline and yields result items. With the streaming feature active
        # it yields the feature's incremental output; otherwise it falls back
        # to the materialised list so stream always yields.
        seed = {
            "entity": {
                "domain": {
                    "s1": {"id": "s1"},
                    "s2": {"id": "s2"},
                    "s3": {"id": "s3"},
                }
            }
        }

        # Fallback: streaming inactive -> yields the materialised list items.
        base = TempmailApi2SDK.test(seed, None)
        seen = list(base.Domain(None).stream("list", None, None))
        assert len(seen) == 3

        # Inbound: streaming active -> yields each item from the feature.
        from tempmailapi2_sdk.config import shared_config
        cfg = shared_config()
        if isinstance(cfg.get("feature"), dict) and "streaming" in cfg["feature"]:
            sdk = TempmailApi2SDK.test(
                seed, {"feature": {"streaming": {"active": True}}})
            got = []
            for item in sdk.Domain(None).stream("list", None, None):
                if isinstance(item, list):
                    got.extend(item)
                else:
                    got.append(item)
            assert len(got) == 3

    def test_should_report_a_failed_stream(self):
        offline = {"net": {"offline": True}}
        with pytest.raises(Exception, match="offline"):
            list(TempmailApi2SDK.test(offline, None).Domain(None).stream("list", None, None))

        quiet = {"ctrl": {"throw": False}}
        list(TempmailApi2SDK.test(offline, None).Domain(None).stream("list", None, quiet))

        if "rbac" in (shared_config().get("feature") or {}):
            denied = TempmailApi2SDK.test(
                None, {"feature": {"rbac": {"active": True, "deny": True}}})
            with pytest.raises(Exception) as err:
                list(denied.Domain(None).stream("list", None, None))
            assert "rbac_denied" == getattr(err.value, "code", None)

    def test_should_leave_the_callers_ctrl(self):
        explain = {}
        ctrl = {"explain": explain}
        list(TempmailApi2SDK.test(None, None).Domain(None).stream("list", None, {"ctrl": ctrl}))
        assert ["explain"] == list(ctrl.keys())
        assert explain is ctrl["explain"] and 0 < len(explain)

    def test_should_fire_pre_unexpected(self):
        hook = _FailHook()
        client = TempmailApi2SDK({"feature": {"test": {"active": True}}, "extend": [hook]})
        with pytest.raises(Exception, match="hook failed"):
            client.Domain(None).list(None, None)
        assert 0 < hook.unexpected

        fired = hook.unexpected
        assert client.Domain(None).list(None, {"throw": False}) is None
        assert fired < hook.unexpected

    def test_should_validate_each_listed_record(self):
        if "validate" not in (shared_config().get("feature") or {}):
            pytest.skip("feature not present in this SDK: validate")
        opts = {"feature": {"validate": {"active": True, "request": False, "response": True}}}
        listed = TempmailApi2SDK.test({"entity": {"domain": {"v1": {}}}}, opts).Domain(None).list(None, None)
        assert ["v1"] == [ent.data_get().get("id") for ent in listed]

    def test_should_run_basic_flow(self):
        setup = _domain_basic_setup(None)
        # Per-op sdk-test-control.json skip — basic test exercises a flow with
        # multiple ops; skipping any one skips the whole flow (steps depend
        # on each other).
        _live = setup.get("live", False)
        for _op in ["list"]:
            _skip, _reason = runner.is_control_skipped("entityOp", "domain." + _op, "live" if _live else "unit")
            if _skip:
                pytest.skip(_reason or "skipped via sdk-test-control.json")
                return
        client = setup["client"]

        # Bootstrap entity data from existing test data.
        domain_ref01_data_raw = vs.items(helpers.to_map(
            vs.getpath(setup["data"], "existing.domain")))
        domain_ref01_data = None
        if len(domain_ref01_data_raw) > 0:
            domain_ref01_data = helpers.to_map(domain_ref01_data_raw[0][1])

        # LIST
        domain_ref01_ent = client.Domain(None)
        domain_ref01_match = {}

        domain_ref01_list_result = domain_ref01_ent.list(domain_ref01_match, None)
        assert isinstance(domain_ref01_list_result, list)



def _domain_basic_setup(extra):
    runner.load_env_local()

    entity_data_file = os.path.join(_TEST_DIR, "../../.sdk/test/entity/domain/DomainTestData.json")
    with open(entity_data_file, "r", encoding="utf-8") as f:
        entity_data_source = f.read()

    entity_data = json.loads(entity_data_source)

    options = {}
    options["entity"] = entity_data.get("existing")

    client = TempmailApi2SDK.test(options, extra)

    # Generate idmap via transform.
    idmap = vs.transform(
        ["domain01", "domain02", "domain03"],
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
        "TEMPMAIL_API2_TEST_DOMAIN_ENTID")
    _idmap_overridden = _entid_env_raw is not None and _entid_env_raw.strip().startswith("{")

    env = runner.env_override({
        "TEMPMAIL_API2_TEST_DOMAIN_ENTID": idmap,
        "TEMPMAIL_API2_TEST_LIVE": "FALSE",
        "TEMPMAIL_API2_TEST_EXPLAIN": "FALSE",
    })

    idmap_resolved = helpers.to_map(
        env.get("TEMPMAIL_API2_TEST_DOMAIN_ENTID"))
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
