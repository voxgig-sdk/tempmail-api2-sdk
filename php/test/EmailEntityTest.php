<?php
declare(strict_types=1);

// Email entity test

require_once __DIR__ . '/../tempmailapi2_sdk.php';
require_once __DIR__ . '/Runner.php';

use PHPUnit\Framework\TestCase;
use Voxgig\Struct\Struct as Vs;

class EmailEntityTest extends TestCase
{
    public function test_create_instance(): void
    {
        $testsdk = TempmailApi2SDK::test(null, null);
        $ent = $testsdk->Email(null);
        $this->assertNotNull($ent);
    }

    public function test_basic_flow(): void
    {
        $setup = email_basic_setup(null);
        // Per-op sdk-test-control.json skip.
        $_live = !empty($setup["live"]);
        foreach (["list", "remove"] as $_op) {
            [$_shouldSkip, $_reason] = Runner::is_control_skipped("entityOp", "email." . $_op, $_live ? "live" : "unit");
            if ($_shouldSkip) {
                $this->markTestSkipped($_reason ?? "skipped via sdk-test-control.json");
                return;
            }
        }
        // The basic flow consumes synthetic IDs from the fixture. In live mode
        // without an *_ENTID env override, those IDs hit the live API and 4xx.
        if (!empty($setup["synthetic_only"])) {
            $this->markTestSkipped("live entity test uses synthetic IDs from fixture — set TEMPMAILAPI__TEST_EMAIL_ENTID JSON to run live");
            return;
        }
        $client = $setup["client"];

        // Bootstrap entity data from existing test data.
        $email_ref01_data_raw = Vs::items(Helpers::to_map(
            Vs::getpath($setup["data"], "existing.email")));
        $email_ref01_data = null;
        if (count($email_ref01_data_raw) > 0) {
            $email_ref01_data = Helpers::to_map($email_ref01_data_raw[0][1]);
        }

        // LIST
        $email_ref01_ent = $client->Email(null);
        $email_ref01_match = [
            "email_id" => $setup["idmap"]["email01"],
            "token" => $setup["idmap"]["token01"],
        ];

        [$email_ref01_list_result, $err] = $email_ref01_ent->list($email_ref01_match, null);
        $this->assertNull($err);
        $this->assertIsArray($email_ref01_list_result);

        // REMOVE
        $email_ref01_match_rm0 = [
            "id" => $email_ref01_data["id"],
        ];
        [$_, $err] = $email_ref01_ent->remove($email_ref01_match_rm0, null);
        $this->assertNull($err);

        // LIST
        $email_ref01_match_rt0 = [
            "email_id" => $setup["idmap"]["email01"],
            "token" => $setup["idmap"]["token01"],
        ];

        [$email_ref01_list_rt0_result, $err] = $email_ref01_ent->list($email_ref01_match_rt0, null);
        $this->assertNull($err);
        $this->assertIsArray($email_ref01_list_rt0_result);

    }
}

function email_basic_setup($extra)
{
    Runner::load_env_local();

    $entity_data_file = __DIR__ . '/../../.sdk/test/entity/email/EmailTestData.json';
    $entity_data_source = file_get_contents($entity_data_file);
    $entity_data = json_decode($entity_data_source, true);

    $options = [];
    $options["entity"] = $entity_data["existing"];

    $client = TempmailApi2SDK::test($options, $extra);

    // Generate idmap.
    $idmap = [];
    foreach (["email01", "email02", "email03", "inbox01", "inbox02", "inbox03", "token01"] as $k) {
        $idmap[$k] = strtoupper($k);
    }

    // Detect ENTID env override before envOverride consumes it. When live
    // mode is on without a real override, the basic test runs against synthetic
    // IDs from the fixture and 4xx's. Surface this so the test can skip.
    $entid_env_raw = getenv("TEMPMAILAPI__TEST_EMAIL_ENTID");
    $idmap_overridden = $entid_env_raw !== false && str_starts_with(trim($entid_env_raw), "{");

    $env = Runner::env_override([
        "TEMPMAILAPI__TEST_EMAIL_ENTID" => $idmap,
        "TEMPMAILAPI__TEST_LIVE" => "FALSE",
        "TEMPMAILAPI__TEST_EXPLAIN" => "FALSE",
        "TEMPMAILAPI__APIKEY" => "NONE",
    ]);

    $idmap_resolved = Helpers::to_map(
        $env["TEMPMAILAPI__TEST_EMAIL_ENTID"]);
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
