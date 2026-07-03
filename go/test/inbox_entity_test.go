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

func TestInboxEntity(t *testing.T) {
	t.Run("instance", func(t *testing.T) {
		testsdk := sdk.TestSDK(nil, nil)
		ent := testsdk.Inbox(nil)
		if ent == nil {
			t.Fatal("expected non-nil InboxEntity")
		}
	})

	t.Run("basic", func(t *testing.T) {
		setup := inboxBasicSetup(nil)
		// Per-op sdk-test-control.json skip — basic test exercises a flow
		// with multiple ops; skipping any op skips the whole flow.
		_mode := "unit"
		if setup.live {
			_mode = "live"
		}
		for _, _op := range []string{"create", "load", "remove"} {
			if _shouldSkip, _reason := isControlSkipped("entityOp", "inbox." + _op, _mode); _shouldSkip {
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
			t.Skip("live entity test uses synthetic IDs from fixture — set TEMPMAILAPI__TEST_INBOX_ENTID JSON to run live")
			return
		}
		client := setup.client

		// CREATE
		inboxRef01Ent := client.Inbox(nil)
		inboxRef01Data := core.ToMapAny(vs.GetProp(
			vs.GetPath([]any{"new", "inbox"}, setup.data), "inbox_ref01"))

		inboxRef01DataResult, err := inboxRef01Ent.Create(inboxRef01Data, nil)
		if err != nil {
			t.Fatalf("create failed: %v", err)
		}
		inboxRef01Data = core.ToMapAny(inboxRef01DataResult)
		if inboxRef01Data == nil {
			t.Fatal("expected create result to be a map")
		}

		// LOAD
		inboxRef01MatchDt0 := map[string]any{}
		inboxRef01DataDt0Loaded, err := inboxRef01Ent.Load(inboxRef01MatchDt0, nil)
		if err != nil {
			t.Fatalf("load failed: %v", err)
		}
		if inboxRef01DataDt0Loaded == nil {
			t.Fatal("expected load result to be non-nil")
		}

		// REMOVE
		inboxRef01MatchRm0 := map[string]any{
			"id": inboxRef01Data["id"],
		}
		_, err = inboxRef01Ent.Remove(inboxRef01MatchRm0, nil)
		if err != nil {
			t.Fatalf("remove failed: %v", err)
		}

	})
}

func inboxBasicSetup(extra map[string]any) *entityTestSetup {
	loadEnvLocal()

	_, filename, _, _ := runtime.Caller(0)
	dir := filepath.Dir(filename)

	entityDataFile := filepath.Join(dir, "..", "..", ".sdk", "test", "entity", "inbox", "InboxTestData.json")

	entityDataSource, err := os.ReadFile(entityDataFile)
	if err != nil {
		panic("failed to read inbox test data: " + err.Error())
	}

	var entityData map[string]any
	if err := json.Unmarshal(entityDataSource, &entityData); err != nil {
		panic("failed to parse inbox test data: " + err.Error())
	}

	options := map[string]any{}
	options["entity"] = entityData["existing"]

	client := sdk.TestSDK(options, extra)

	// Generate idmap via transform, matching TS pattern.
	idmap := vs.Transform(
		[]any{"inbox01", "inbox02", "inbox03"},
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
	entidEnvRaw := os.Getenv("TEMPMAILAPI__TEST_INBOX_ENTID")
	idmapOverridden := entidEnvRaw != "" && strings.HasPrefix(strings.TrimSpace(entidEnvRaw), "{")

	env := envOverride(map[string]any{
		"TEMPMAILAPI__TEST_INBOX_ENTID": idmap,
		"TEMPMAILAPI__TEST_LIVE":      "FALSE",
		"TEMPMAILAPI__TEST_EXPLAIN":   "FALSE",
		"TEMPMAILAPI__APIKEY":         "NONE",
	})

	idmapResolved := core.ToMapAny(env["TEMPMAILAPI__TEST_INBOX_ENTID"])
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
