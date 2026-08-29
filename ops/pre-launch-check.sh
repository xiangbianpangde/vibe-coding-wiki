#!/usr/bin/env bash
# Pre-launch acceptance gate — one command full QA.
# Usage: ops/pre-launch-check.sh [--full] [--live]
#   --full   run e2e on all configured playwright projects (needs firefox/webkit installed)
#   --live   also smoke-check the deployed site (https://xiangbianpangde.github.io/vibe-coding-wiki)
# Exit 0 = all gates passed. Safe to run anytime; read-only except test artifacts.

set -uo pipefail
cd "$(dirname "$0")/.."
ROOT="$PWD"
PASS=0; FAIL=0; FAILED_GATES=()

gate() {  # gate <name> <cmd...>
  local name="$1"; shift
  echo "── $name"
  if "$@" > /tmp/plc-last.log 2>&1; then
    echo "   ✅ PASS"; PASS=$((PASS+1))
  else
    echo "   ❌ FAIL — tail of output:"; tail -8 /tmp/plc-last.log | sed 's/^/      /'
    FAIL=$((FAIL+1)); FAILED_GATES+=("$name")
  fi
}

E2E_PROJECTS=(chromium)
[ "${1:-}" = "--full" ] || [ "${2:-}" = "--full" ] && E2E_PROJECTS=(chromium firefox mobile-safari)
LIVE=0; [[ " $* " == *" --live "* ]] && LIVE=1

echo "=== Pre-launch acceptance · $(date -u +%Y-%m-%dT%H:%M:%SZ) ==="

# 1. Data integrity: every terms JSON parses, index count matches
gate "data: JSON validity + index consistency" python3 - <<'EOF'
import json, glob
total = 0
for f in sorted(glob.glob('website/data/terms-L*.json')):
    d = json.load(open(f))
    total += len(d)
idx = json.load(open('website/data/terms-index.json'))
n = len(idx['summaries']) if isinstance(idx, dict) else len(idx)
assert total == n, f"index mismatch: layers={total} index={n}"
print(f"   {total} terms, index consistent")
EOF

# 2. Unit tests
gate "unit tests (vitest)" npm test --prefix website

# 3. Example syntax guardrail (strict: any FAIL fails the gate)
gate "example syntax check (--strict)" node website/scripts/example-check.cjs --strict

# 4. Citation stale audit (report mode; gate fails only if script errors)
gate "citation stale audit" node website/scripts/citation-stale-audit.cjs

# 5. E2E (playwright, auto-starts local server)
for p in "${E2E_PROJECTS[@]}"; do
  gate "e2e [$p]" bash -c "cd website && npx playwright test --project=$p"
done

# 6. Sitemap freshness: URL set must match a fresh rebuild (lastmod dates ignored)
gate "sitemap up-to-date" bash -c '
  cp website/sitemap.xml /tmp/plc-sitemap-old.xml
  node website/scripts/build-sitemap.cjs >/dev/null 2>&1
  grep -o "<loc>[^<]*</loc>" /tmp/plc-sitemap-old.xml > /tmp/plc-old.locs
  grep -o "<loc>[^<]*</loc>" website/sitemap.xml > /tmp/plc-new.locs
  diff -q /tmp/plc-old.locs /tmp/plc-new.locs'

# 7. Optional live smoke
if [ "$LIVE" = 1 ]; then
  gate "live site smoke" bash -c '
    base=https://xiangbianpangde.github.io/vibe-coding-wiki
    for path in / /term.html?id=vibe-coding /pages/glossary.html /sitemap.xml /rss.xml /manifest.webmanifest; do
      code=$(curl -s -o /dev/null -w "%{http_code}" "$base$path")
      [ "$code" = 200 ] || { echo "$path -> $code"; exit 1; }
    done'
fi

echo "=== Result: $PASS passed, $FAIL failed ==="
if [ "$FAIL" -gt 0 ]; then
  printf '   failed gates: %s\n' "${FAILED_GATES[*]}"
  exit 1
fi
echo "🚀 READY FOR LAUNCH"
