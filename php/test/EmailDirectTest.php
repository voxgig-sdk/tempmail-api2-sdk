<?php
declare(strict_types=1);

// Email direct test

require_once __DIR__ . '/../tempmailapi2_sdk.php';
require_once __DIR__ . '/Runner.php';

use PHPUnit\Framework\TestCase;

class EmailDirectTest extends TestCase
{
    public function test_direct_list_email(): void
    {
        $setup = email_direct_setup([
            ["id" => "direct01"],
            ["id" => "direct02"],
        ]);
        [$_shouldSkip, $_reason] = Runner::is_control_skipped("direct", "direct-list-email", $setup["live"] ? "live" : "unit");
        if ($_shouldSkip) {
            $this->markTestSkipped($_reason ?? "skipped via sdk-test-control.json");
            return;
        }
        if ($setup["live"]) {
            foreach (["email01", "token01"] as $_liveKey) {
                if (!isset($setup["idmap"][$_liveKey]) || $setup["idmap"][$_liveKey] === null) {
                    $this->markTestSkipped("live test needs $_liveKey via *_ENTID env var (synthetic IDs only)");
                    return;
                }
            }
        }
        $client = $setup["client"];

        $params = [];
        if ($setup["live"]) {
            $params["email_id"] = $setup["idmap"]["email01"];
        } else {
            $params["email_id"] = "direct01";
        }
        if ($setup["live"]) {
            $params["token"] = $setup["idmap"]["token01"];
        } else {
            $params["token"] = "direct01";
        }

        [$result, $err] = $client->direct([
            "path" => "inbox/{token}/{email_id}",
            "method" => "GET",
            "params" => $params,
        ]);
        if ($setup["live"]) {
            // Live mode is lenient: synthetic IDs frequently 4xx and the
            // list-response shape varies wildly across public APIs. Skip
            // rather than fail when the call doesn't return a usable list.
            if ($err !== null) {
                $this->markTestSkipped("list call failed (likely synthetic IDs against live API): " . (string)$err);
                return;
            }
            if (empty($result["ok"])) {
                $this->markTestSkipped("list call not ok (likely synthetic IDs against live API)");
                return;
            }
            $status = Helpers::to_int($result["status"]);
            if ($status < 200 || $status >= 300) {
                $this->markTestSkipped("expected 2xx status, got " . $status);
                return;
            }
        } else {
            $this->assertNull($err);
            $this->assertTrue($result["ok"]);
            $this->assertEquals(200, Helpers::to_int($result["status"]));
            $this->assertIsArray($result["data"]);
            $this->assertCount(2, $result["data"]);
            $this->assertCount(1, $setup["calls"]);
        }
    }

}


function email_direct_setup($mockres)
{
    Runner::load_env_local();

    $calls = new \ArrayObject();

    $env = Runner::env_override([
        "TEMPMAILAPI__TEST_EMAIL_ENTID" => [],
        "TEMPMAILAPI__TEST_LIVE" => "FALSE",
        "TEMPMAILAPI__APIKEY" => "NONE",
    ]);

    $live = $env["TEMPMAILAPI__TEST_LIVE"] === "TRUE";

    if ($live) {
        $merged_opts = [
            "apikey" => $env["TEMPMAILAPI__APIKEY"],
        ];
        $client = new TempmailApi2SDK($merged_opts);
        return [
            "client" => $client,
            "calls" => $calls,
            "live" => true,
            "idmap" => [],
        ];
    }

    $mock_fetch = function ($url, $init) use ($calls, $mockres) {
        $calls[] = ["url" => $url, "init" => $init];
        return [
            [
                "status" => 200,
                "statusText" => "OK",
                "headers" => [],
                "json" => function () use ($mockres) {
                    if ($mockres !== null) {
                        return $mockres;
                    }
                    return ["id" => "direct01"];
                },
                "body" => "mock",
            ],
            null,
        ];
    };

    $client = new TempmailApi2SDK([
        "base" => "http://localhost:8080",
        "system" => [
            "fetch" => $mock_fetch,
        ],
    ]);

    return [
        "client" => $client,
        "calls" => $calls,
        "live" => false,
        "idmap" => [],
    ];
}
