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
		for _, _op := range []string{"list", "remove"} {
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
			t.Skip("live entity test uses synthetic IDs from fixture — set TEMPMAILAPI__TEST_EMAIL_ENTID JSON to run live")
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

		// LIST
		emailRef01Ent := client.Email(nil)
		emailRef01Match := map[string]any{
			"email_id": setup.idmap["email01"],
			"token": setup.idmap["token01"],
		}

		emailRef01ListResult, err := emailRef01Ent.List(emailRef01Match, nil)
		if err != nil {
			t.Fatalf("list failed: %v", err)
		}
		_, emailRef01ListOk := emailRef01ListResult.([]any)
		if !emailRef01ListOk {
			t.Fatalf("expected list result to be an array, got %T", emailRef01ListResult)
		}

		// REMOVE
		emailRef01MatchRm0 := map[string]any{
			"id": emailRef01Data["id"],
		}
		_, err = emailRef01Ent.Remove(emailRef01MatchRm0, nil)
		if err != nil {
			t.Fatalf("remove failed: %v", err)
		}

		// LIST
		emailRef01MatchRt0 := map[string]any{
			"email_id": setup.idmap["email01"],
			"token": setup.idmap["token01"],
		}

		emailRef01ListRt0Result, err := emailRef01Ent.List(emailRef01MatchRt0, nil)
		if err != nil {
			t.Fatalf("list failed: %v", err)
		}
		_, emailRef01ListRt0Ok := emailRef01ListRt0Result.([]any)
		if !emailRef01ListRt0Ok {
			t.Fatalf("expected list result to be an array, got %T", emailRef01ListRt0Result)
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
	entidEnvRaw := os.Getenv("TEMPMAILAPI__TEST_EMAIL_ENTID")
	idmapOverridden := entidEnvRaw != "" && strings.HasPrefix(strings.TrimSpace(entidEnvRaw), "{")

	env := envOverride(map[string]any{
		"TEMPMAILAPI__TEST_EMAIL_ENTID": idmap,
		"TEMPMAILAPI__TEST_LIVE":      "FALSE",
		"TEMPMAILAPI__TEST_EXPLAIN":   "FALSE",
		"TEMPMAILAPI__APIKEY":         "NONE",
	})

	idmapResolved := core.ToMapAny(env["TEMPMAILAPI__TEST_EMAIL_ENTID"])
	if idmapResolved == nil {
		idmapResolved = core.ToMapAny(idmap)
	}

	if env["TEMPMAILAPI__TEST_LIVE"] == "TRUE" {
		mergedOpts := vs.Merge([]any{
			map[string]any{
				"apikey": env["TEMPMAILAPI__APIKEY"],
			},
			extra,
		})
		client = sdk.NewTempmailApi2SDK(core.ToMapAny(mergedOpts))
	}

	live := env["TEMPMAILAPI__TEST_LIVE"] == "TRUE"
	return &entityTestSetup{
		client:        client,
		data:          entityData,
		idmap:         idmapResolved,
		env:           env,
		explain:       env["TEMPMAILAPI__TEST_EXPLAIN"] == "TRUE",
		live:          live,
		syntheticOnly: live && !idmapOverridden,
		now:           time.Now().UnixMilli(),
	}
}
