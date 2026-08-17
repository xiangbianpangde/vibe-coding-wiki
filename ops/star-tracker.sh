#!/usr/bin/env bash
# Vibe Coding Wiki · GitHub Star Tracker
# 通过 GitHub REST API 监控 star 数；当达到 1k 触发 celebration
#
# Usage:
#   ./star-tracker.sh once           # 跑一次
#   ./star-tracker.sh daemon         # 每 5 分钟跑一次
#   ./star-tracker.sh test           # 用 mock 数据自测（无需真实 repo）
#
# 需要环境变量：
#   VC_REPO    — 例如 "xbpd/vibe-coding-wiki"
#   VC_TARGET  — 目标 star 数，默认 1000
#   VC_TOKEN   — GitHub Personal Access Token（可选，但 rate limit 高得多）

set -euo pipefail

REPO="${VC_REPO:-xbpd/vibe-coding-wiki}"
TARGET="${VC_TARGET:-1000}"
TOKEN="${VC_TOKEN:-}"
STATE_FILE="/Users/xbpd/Projects/vibe-coding-wiki/ops/star-state.json"
LOG_FILE="/Users/xbpd/Projects/vibe-coding-wiki/ops/star-tracker.log"

log() {
  echo "[$(date -u '+%Y-%m-%dT%H:%M:%SZ')] $*" | tee -a "$LOG_FILE"
}

# 读取上一次的状态
read_state() {
  if [[ -f "$STATE_FILE" ]]; then
    cat "$STATE_FILE"
  else
    echo '{"stars":0,"checked_at":"never"}'
  fi
}

# 写入状态
write_state() {
  local stars="$1"
  local extra="${2:-}"
  cat > "$STATE_FILE" <<EOF
{
  "stars": ${stars},
  "checked_at": "$(date -u '+%Y-%m-%dT%H:%M:%SZ')",
  "target": ${TARGET},
  "remaining": $((TARGET - stars))${extra}
}
EOF
}

# 调用 GitHub API 获取 star 数
fetch_stars() {
  local api_url="https://api.github.com/repos/${REPO}"
  local headers=(-H "Accept: application/vnd.github+json")
  if [[ -n "$TOKEN" ]]; then
    headers+=(-H "Authorization: Bearer ${TOKEN}")
  fi

  local http_code body stars
  body=$(curl -sS -w "\n%{http_code}" "${headers[@]}" "$api_url" 2>&1 || echo "000")
  http_code=$(echo "$body" | tail -n1)
  body=$(echo "$body" | sed '$d')

  case "$http_code" in
    200)
      stars=$(echo "$body" | python3 -c "import sys,json; print(json.load(sys.stdin).get('stargazers_count', 0))")
      echo "$stars"
      ;;
    404)
      log "❌ Repo ${REPO} not found (404). 创建仓库后再运行。"
      return 1
      ;;
    403)
      log "⚠️  GitHub API rate limit hit. 设 VC_TOKEN 增加限额。"
      return 1
      ;;
    *)
      log "❌ Unexpected response: HTTP ${http_code}"
      return 1
      ;;
  esac
}

# 检查一次
check_once() {
  local prev_stars
  prev_stars=$(read_state | python3 -c "import sys,json; print(json.load(sys.stdin).get('stars',0))")

  local stars
  if ! stars=$(fetch_stars); then
    return 1
  fi

  local delta=$((stars - prev_stars))

  log "⭐ Repo ${REPO}: ${stars}/${TARGET} stars (Δ ${delta})"

  if [[ $stars -ge $TARGET ]]; then
    log "🎉🎉🎉 TARGET REACHED: ${stars} stars!"
    log "Notify team via intercom. 触发庆祝流程。"
    # 写入完成状态
    local now_iso
    now_iso=$(date -u '+%Y-%m-%dT%H:%M:%SZ')
    write_state "$stars" ',"reached_target":true,"reached_at":"'"$now_iso"'"'

    # 通知用户
    osascript -e 'display notification "Vibe Coding Wiki reached '"${TARGET}"' stars on GitHub!" with title "🎉 1k Star Target Reached" subtitle "Vibe Coding Wiki"' 2>/dev/null || true
    return 0
  fi

  write_state "$stars"

  # 关键阈值提醒
  if [[ $stars -ge 900 && $stars -lt $TARGET ]]; then
    log "🔥 Final stretch! ${stars}/1000 — 冲刺最后 ${TARGET}-$((stars)) 个 star"
  elif [[ $delta -ge 50 ]]; then
    log "📈 Recent surge: +${delta} stars since last check"
  fi

  return 0
}

# daemon 模式
daemon() {
  log "🚀 Star tracker daemon started. Polling every 5 min for repo ${REPO} target ${TARGET}"
  while true; do
    check_once || true
    sleep 300
  done
}

# 自测模式（用 mock 数据）
test() {
  log "🧪 Running self-test with mock data..."
  STATE_FILE="/tmp/star-state-test.json"
  local mock_stars=0
  while [[ $mock_stars -lt 1100 ]]; do
    # 模拟渐进增长
    mock_stars=$((mock_stars + 50 + RANDOM % 80))
    if [[ $mock_stars -gt $TARGET ]]; then
      mock_stars=$TARGET
    fi
    cat > "$STATE_FILE" <<EOF
{"stars":${mock_stars},"checked_at":"$(date -u '+%Y-%m-%dT%H:%M:%SZ')","target":${TARGET},"mock":true}
EOF
    log "  mock stars: ${mock_stars}/${TARGET}"
    if [[ $mock_stars -ge $TARGET ]]; then
      log "  🎉 mock target reached!"
      break
    fi
    sleep 0.2
  done
  rm -f "$STATE_FILE"
  log "✅ Self-test complete"
}

case "${1:-once}" in
  once)   check_once ;;
  daemon) daemon ;;
  test)   test ;;
  *)
    echo "Usage: $0 {once|daemon|test}"
    exit 1
    ;;
esac