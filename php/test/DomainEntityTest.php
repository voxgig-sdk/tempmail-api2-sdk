<?php
declare(strict_types=1);

// Domain entity test

require_once __DIR__ . '/../tempmailapi2_sdk.php';
require_once __DIR__ . '/Runner.php';

use PHPUnit\Framework\TestCase;
use Voxgig\Struct\Struct as Vs;

class DomainEntityTest extends TestCase
{
    public function test_create_instance(): void
    {
        $testsdk = TempmailApi2SDK::test(null, null);
        $ent = $testsdk->Domain(null);
        $this->assertNotNull($ent);
    }

    public function test_basic_flow(): void
    {
        $setup = domain_basic_setup(null);
        // Per-op sdk-test-control.json skip.
        $_live = !empty($setup["live"]);
        foreach (["list"] as $_op) {
            [$_shouldSkip, $_reason] = Runner::is_control_skipped("entityOp", "domain." . $_op, $_live ? "live" : "unit");
            if ($_shouldSkip) {
                $this->markTestSkipped($_reason ?? "skipped via sdk-test-control.json");
                return;
            }
        }
        // The basic flow consumes synthetic IDs from the fixture. In live mode
        // without an *_ENTID env override, those IDs hit the live API and 4xx.
        if (!empty($setup["synthetic_only"])) {
            $this->markTestSkipped("live entity test uses synthetic IDs from fixture — set TEMPMAILAPI__TEST_DOMAIN_ENTID JSON to run live");
            return;
        }
        $client = $setup["client"];

        // Bootstrap entity data from existing test data.
        $domain_ref01_data_raw = Vs::items(Helpers::to_map(
            Vs::getpath($setup["data"], "existing.domain")));
        $domain_ref01_data = null;
        if (count($domain_ref01_data_raw) > 0) {
            $domain_ref01_data = Helpers::to_map($domain_ref01_data_raw[0][1]);
        }

        // LIST
        $domain_ref01_ent = $client->Domain(null);
        $domain_ref01_match = [];

        [$domain_ref01_list_result, $err] = $domain_ref01_ent->list($domain_ref01_match, null);
        $this->assertNull($err);
        $this->assertIsArray($domain_ref01_list_result);

    }
}

function domain_basic_setup($extra)
{
    Runner::load_env_local();

    $entity_data_file = __DIR__ . '/../../.sdk/test/entity/domain/DomainTestData.json';
    $entity_data_source = file_get_contents($entity_data_file);
    $entity_data = json_decode($entity_data_source, true);

    $options = [];
    $options["entity"] = $entity_data["existing"];

    $client = TempmailApi2SDK::test($options, $extra);

    // Generate idmap.
    $idmap = [];
    foreach (["domain01", "domain02", "domain03"] as $k) {
        $idmap[$k] = strtoupper($k);
    }

    // Detect ENTID env override before envOverride consumes it. When live
    // mode is on without a real override, the basic test runs against synthetic
    // IDs from the fixture and 4xx's. Surface this so the test can skip.
    $entid_env_raw = getenv("TEMPMAILAPI__TEST_DOMAIN_ENTID");
    $idmap_overridden = $entid_env_raw !== false && str_starts_with(trim($entid_env_raw), "{");

    $env = Runner::env_override([
        "TEMPMAILAPI__TEST_DOMAIN_ENTID" => $idmap,
        "TEMPMAILAPI__TEST_LIVE" => "FALSE",
        "TEMPMAILAPI__TEST_EXPLAIN" => "FALSE",
        "TEMPMAILAPI__APIKEY" => "NONE",
    ]);

    $idmap_resolved = Helpers::to_map(
        $env["TEMPMAILAPI__TEST_DOMAIN_ENTID"]);
    if ($idmap_resolved === null) {
        $idmap_resolved = Helpers::to_map($idmap);
    }

    if ($env["TEMPMAILAPI__TEST_LIVE"] === "TRUE") {
        $merged_opts = Vs::merge([
            [
                "apikey" => $env["TEMPMAILAPI__APIKEY"],
            ],
            $extra ?? [],
        ]);
        $client = new TempmailApi2SDK(Helpers::to_map($merged_opts));
    }

    $live = $env["TEMPMAILAPI__TEST_LIVE"] === "TRUE";
    return [
        "client" => $client,
        "data" => $entity_data,
        "idmap" => $idmap_resolved,
        "env" => $env,
        "explain" => $env["TEMPMAILAPI__TEST_EXPLAIN"] === "TRUE",
        "live" => $live,
        "synthetic_only" => $live && !$idmap_overridden,
        "now" => (int)(microtime(true) * 1000),
    ];
}
