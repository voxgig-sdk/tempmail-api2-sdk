package sdktest

import (
	"encoding/json"
	"os"
	"path/filepath"
	"runtime"
	"strings"
	"testing"
	"time"

	sdk "github.com/voxgig-sdk/tempmail-api2-sdk/go"
	"github.com/voxgig-sdk/tempmail-api2-sdk/go/core"

	vs "github.com/voxgig-sdk/tempmail-api2-sdk/go/utility/struct"
)

func TestEmailEntity(t *testing.T) {
	t.Run("instance", func(t *testing.T) {
		testsdk := sdk.TestSDK(nil, nil)
		ent := testsdk.Email(nil)
		if ent == nil {
			t.Fatal("expected non-nil EmailEntity")
		}
	})

	t.Run("basic", func(t *testing.T) {
		setup := emailBasicSetup(nil)
		// Per-op sdk-test-control.json skip — basic test exercises a flow
		// with multiple ops; skipping any op skips the whole flow.
		_mode := "unit"
		if setup.live {
			_mode = "live"
		}
		for _, _op := range []string{"load"} {
			if _shouldSkip, _reason := isControlSkipped("entityOp", "email." + _op, _mode); _shouldSkip {
				if _reason == "" {
					_reason = "skipped via sdk-test-control.json"
				}
				t.Skip(_reason)
				return
			}
		}
		// The basic flow consumes synthetic IDs from the fixture. In live mode
		// without an *_ENTID env override, those IDs hit the live API and 4xx.
		if setup.syntheticOnly {
			t.Skip("live entity test uses synthetic IDs from fixture — set TEMPMAIL_API2_TEST_EMAIL_ENTID JSON to run live")
			return
		}
		client := setup.client

		// Bootstrap entity data from existing test data (no create step in flow).
		emailRef01DataRaw := vs.Items(core.ToMapAny(vs.GetPath("existing.email", setup.data)))
		var emailRef01Data map[string]any
		if len(emailRef01DataRaw) > 0 {
			emailRef01Data = core.ToMapAny(emailRef01DataRaw[0][1])
		}
		// Discard guards against Go's unused-var check when the flow's steps
		// happen not to consume the bootstrap data (e.g. list-only flows).
		_ = emailRef01Data

		// LOAD
		emailRef01Ent := client.Email(nil)
		emailRef01MatchDt0 := map[string]any{
			"id": emailRef01Data["id"],
		}
		emailRef01DataDt0Loaded, err := emailRef01Ent.Load(emailRef01MatchDt0, nil)
		if err != nil {
			t.Fatalf("load failed: %v", err)
		}
		emailRef01DataDt0LoadResult := core.ToMapAny(entityData(emailRef01DataDt0Loaded))
		if emailRef01DataDt0LoadResult == nil {
			t.Fatal("expected load result to be a map")
		}
		if emailRef01DataDt0LoadResult["id"] != emailRef01Data["id"] {
			t.Fatal("expected load result id to match")
		}

	})
}

func emailBasicSetup(extra map[string]any) *entityTestSetup {
	loadEnvLocal()

	_, filename, _, _ := runtime.Caller(0)
	dir := filepath.Dir(filename)

	entityDataFile := filepath.Join(dir, "..", "..", ".sdk", "test", "entity", "email", "EmailTestData.json")

	entityDataSource, err := os.ReadFile(entityDataFile)
	if err != nil {
		panic("failed to read email test data: " + err.Error())
	}

	var entityData map[string]any
	if err := json.Unmarshal(entityDataSource, &entityData); err != nil {
		panic("failed to parse email test data: " + err.Error())
	}

	options := map[string]any{}
	options["entity"] = entityData["existing"]

	client := sdk.TestSDK(options, extra)

	// Generate idmap via transform, matching TS pattern.
	idmap := vs.Transform(
		[]any{"email01", "email02", "email03", "inbox01", "inbox02", "inbox03", "token01"},
		map[string]any{
			"`$PACK`": []any{"", map[string]any{
				"`$KEY`": "`$COPY`",
				"`$VAL`": []any{"`$FORMAT`", "upper", "`$COPY`"},
			}},
		},
	)

	// Detect ENTID env override before envOverride consumes it. When live
	// mode is on without a real override, the basic test runs against synthetic
	// IDs from the fixture and 4xx's. Surface this so the test can skip.
	entidEnvRaw := os.Getenv("TEMPMAIL_API2_TEST_EMAIL_ENTID")
	idmapOverridden := entidEnvRaw != "" && strings.HasPrefix(strings.TrimSpace(entidEnvRaw), "{")

	env := envOverride(map[string]any{
		"TEMPMAIL_API2_TEST_EMAIL_ENTID": idmap,
		"TEMPMAIL_API2_TEST_LIVE":      "FALSE",
		"TEMPMAIL_API2_TEST_EXPLAIN":   "FALSE",
	})

	idmapResolved := core.ToMapAny(env["TEMPMAIL_API2_TEST_EMAIL_ENTID"])
	if idmapResolved == nil {
		idmapResolved = core.ToMapAny(idmap)
	}

	if env["TEMPMAIL_API2_TEST_LIVE"] == "TRUE" {
		mergedOpts := vs.Merge([]any{
			map[string]any{
			},
			extra,
		})
		client = sdk.NewTempmailApi2SDK(core.ToMapAny(mergedOpts))
	}

	live := env["TEMPMAIL_API2_TEST_LIVE"] == "TRUE"
	return &entityTestSetup{
		client:        client,
		data:          entityData,
		idmap:         idmapResolved,
		env:           env,
		explain:       env["TEMPMAIL_API2_TEST_EXPLAIN"] == "TRUE",
		live:          live,
		syntheticOnly: live && !idmapOverridden,
		now:           time.Now().UnixMilli(),
	}
}
