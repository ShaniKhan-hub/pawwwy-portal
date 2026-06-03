#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# Pawwwy — one-click local launcher (macOS / Linux)
#
# Starts:
#   1. Portal backend  — Spring Boot on :8090
#   2. Portal frontend — Vite dev server on :5173
#
# Strategy:
#   • If `tmux` is available, run both in a single tmux session ("pawwwy").
#   • Else on macOS, open two Terminal.app tabs via osascript.
#   • Else on Linux, try gnome-terminal / x-terminal-emulator / konsole.
#   • Worst case: run both in the background and tail their logs.
#
# Once both are up, open http://localhost:5173 in your browser.
#
# Prerequisites: JDK 17+, Maven, Node.js 20+, npm
# ─────────────────────────────────────────────────────────────────────────────

set -e

cd "$(dirname "$0")"

echo
echo "  Pawwwy"
echo "  ======"
echo

# ── Sanity-check tools ────────────────────────────────────────────────────────

require() {
    local cmd="$1" hint="$2"
    if ! command -v "$cmd" >/dev/null 2>&1; then
        echo "  ERROR: $cmd is not on PATH."
        [ -n "$hint" ] && echo "         $hint"
        exit 1
    fi
}

require java "Install JDK 17+."
require mvn  "Install Maven 3.8+."
require npm  "Install Node.js 20+."

# ── Install frontend deps on first run ────────────────────────────────────────

if [ ! -d "portal-frontend/node_modules" ]; then
    echo "  First run: installing frontend dependencies . . ."
    ( cd portal-frontend && npm install )
    echo
fi

# ── Decide how to launch ──────────────────────────────────────────────────────

BACKEND_CMD='cd portal-backend && mvn spring-boot:run'
FRONTEND_CMD='cd portal-frontend && npm run dev'

launch_tmux() {
    echo "  Launching in tmux session 'pawwwy' . . ."
    tmux new-session -d -s pawwwy -n backend "bash -c \"$BACKEND_CMD; exec bash\""
    tmux new-window  -t pawwwy   -n frontend "bash -c \"$FRONTEND_CMD; exec bash\""
    echo
    echo "  Attach with:  tmux attach -t pawwwy"
    echo "  Kill it with: tmux kill-session -t pawwwy"
}

launch_macos_terminal() {
    echo "  Opening two Terminal.app tabs . . ."
    local cwd; cwd="$(pwd)"
    osascript <<EOF >/dev/null
tell application "Terminal"
    activate
    do script "cd '$cwd' && $BACKEND_CMD"
    do script "cd '$cwd' && $FRONTEND_CMD"
end tell
EOF
}

launch_linux_terminal() {
    local term
    for term in gnome-terminal konsole xfce4-terminal x-terminal-emulator xterm; do
        if command -v "$term" >/dev/null 2>&1; then
            echo "  Opening two $term windows . . ."
            case "$term" in
                gnome-terminal)
                    "$term" -- bash -c "$BACKEND_CMD; exec bash"  >/dev/null 2>&1 &
                    "$term" -- bash -c "$FRONTEND_CMD; exec bash" >/dev/null 2>&1 &
                    ;;
                konsole)
                    "$term" -e bash -c "$BACKEND_CMD; exec bash"  >/dev/null 2>&1 &
                    "$term" -e bash -c "$FRONTEND_CMD; exec bash" >/dev/null 2>&1 &
                    ;;
                *)
                    "$term" -e "bash -c '$BACKEND_CMD; exec bash'"  >/dev/null 2>&1 &
                    "$term" -e "bash -c '$FRONTEND_CMD; exec bash'" >/dev/null 2>&1 &
                    ;;
            esac
            return 0
        fi
    done
    return 1
}

launch_background() {
    echo "  No terminal-spawning tool found. Running in the background . . ."
    mkdir -p .pawwwy-logs
    bash -c "$BACKEND_CMD"  > .pawwwy-logs/backend.log  2>&1 &
    echo $! > .pawwwy-logs/backend.pid
    bash -c "$FRONTEND_CMD" > .pawwwy-logs/frontend.log 2>&1 &
    echo $! > .pawwwy-logs/frontend.pid
    echo
    echo "  Logs:           .pawwwy-logs/backend.log  .pawwwy-logs/frontend.log"
    echo "  Stop the services:"
    echo "      kill \$(cat .pawwwy-logs/backend.pid) \$(cat .pawwwy-logs/frontend.pid)"
}

if   command -v tmux >/dev/null 2>&1; then
    launch_tmux
elif [ "$(uname)" = "Darwin" ] && command -v osascript >/dev/null 2>&1; then
    launch_macos_terminal
elif launch_linux_terminal; then
    : # done
else
    launch_background
fi

echo
echo "  Once both services show 'ready', open: http://localhost:5173"
echo
