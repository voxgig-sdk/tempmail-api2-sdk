<?php
declare(strict_types=1);

// Inbox entity test

require_once __DIR__ . '/../tempmailapi2_sdk.php';
require_once __DIR__ . '/Runner.php';

use PHPUnit\Framework\TestCase;
use Voxgig\Struct\Struct as Vs;

class InboxEntityTest extends TestCase
{
    public function test_create_instance(): void
    {
        $testsdk = TempmailApi2SDK::test(null, null);
        $ent = $testsdk->Inbox(null);
        $this->assertNotNull($ent);
    }

    public function test_basic_flow(): void
    {
        $setup = inbox_basic_setup(null);
        // Per-op sdk-test-control.json skip.
        $_live = !empty($setup["live"]);
        foreach (["create", "load", "remove"] as $_op) {
            [$_shouldSkip, $_reason] = Runner::is_control_skipped("entityOp", "inbox." . $_op, $_live ? "live" : "unit");
            if ($_shouldSkip) {
                $this->markTestSkipped($_reason ?? "skipped via sdk-test-control.json");
                return;
            }
        }
        // The basic flow consumes synthetic IDs from the fixture. In live mode
        // without an *_ENTID env override, those IDs hit the live API and 4xx.
        if (!empty($setup["synthetic_only"])) {
            $this->markTestSkipped("live entity test uses synthetic IDs from fixture — set TEMPMAIL_API2_TEST_INBOX_ENTID JSON to run live");
            return;
        }
        $client = $setup["client"];

        // CREATE
        $inbox_ref01_ent = $client->Inbox(null);
        $inbox_ref01_data = Helpers::to_map(Vs::getprop(
            Vs::getpath($setup["data"], "new.inbox"), "inbox_ref01"));

        $inbox_ref01_data_result = $inbox_ref01_ent->create($inbox_ref01_data, null);
        $inbox_ref01_data = Helpers::to_map(is_object($inbox_ref01_data_result) && method_exists($inbox_ref01_data_result, 'data_get') ? $inbox_ref01_data_result->data_get() : $inbox_ref01_data_result);
        $this->assertNotNull($inbox_ref01_data);

        // LOAD
        $inbox_ref01_match_dt0 = [];
        $inbox_ref01_data_dt0_loaded = $inbox_ref01_ent->load($inbox_ref01_match_dt0, null);
        $this->assertNotNull($inbox_ref01_data_dt0_loaded);


    }
}

function inbox_basic_setup($extra)
{
    Runner::load_env_local();

    $entity_data_file = __DIR__ . '/../../.sdk/test/entity/inbox/InboxTestData.json';
    $entity_data_source = file_get_contents($entity_data_file);
    $entity_data = json_decode($entity_data_source, true);

    $options = [];
    $options["entity"] = $entity_data["existing"];

    $client = TempmailApi2SDK::test($options, $extra);

    // Generate idmap.
    $idmap = [];
    foreach (["inbox01", "inbox02", "inbox03"] as $k) {
        $idmap[$k] = strtoupper($k);
    }

    // Detect ENTID env override before envOverride consumes it. When live
    // mode is on without a real override, the basic test runs against synthetic
    // IDs from the fixture and 4xx's. Surface this so the test can skip.
    $entid_env_raw = getenv("TEMPMAIL_API2_TEST_INBOX_ENTID");
    $idmap_overridden = $entid_env_raw !== false && str_starts_with(trim($entid_env_raw), "{");

    $env = Runner::env_override([
        "TEMPMAIL_API2_TEST_INBOX_ENTID" => $idmap,
        "TEMPMAIL_API2_TEST_LIVE" => "FALSE",
        "TEMPMAIL_API2_TEST_EXPLAIN" => "FALSE",
    ]);

    $idmap_resolved = Helpers::to_map(
        $env["TEMPMAIL_API2_TEST_INBOX_ENTID"]);
    if ($idmap_resolved === null) {
        $idmap_resolved = Helpers::to_map($idmap);
    }

    if ($env["TEMPMAIL_API2_TEST_LIVE"] === "TRUE") {
        $merged_opts = Vs::merge([
            [
            ],
            $extra ?? [],
        ]);
        $client = new TempmailApi2SDK(Helpers::to_map($merged_opts));
    }

    $live = $env["TEMPMAIL_API2_TEST_LIVE"] === "TRUE";
    return [
        "client" => $client,
        "data" => $entity_data,
        "idmap" => $idmap_resolved,
        "env" => $env,
        "explain" => $env["TEMPMAIL_API2_TEST_EXPLAIN"] === "TRUE",
        "live" => $live,
        "synthetic_only" => $live && !$idmap_overridden,
        "now" => (int)(microtime(true) * 1000),
    ];
}
