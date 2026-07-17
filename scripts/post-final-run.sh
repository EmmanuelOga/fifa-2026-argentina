#!/bin/sh
# One-shot post-final pipeline run — scheduled via crontab for Sunday July 19,
# 2026 at 16:03 PT (about 90 minutes after the final should end, extra time and
# penalties included). Runs the full living loop (research grades the final,
# writes the post, republishes), logs to ~/.local/state/, then removes its own
# crontab entry so it never fires again.
#
# Installed with:  (crontab -l; echo '3 16 19 7 * <this script> # la-alegria-post-final') | crontab -
# Remove early with:  crontab -l | grep -v la-alegria-post-final | crontab -
export PATH="$HOME/.local/bin:/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin"
cd "$(dirname "$0")/.." || exit 1
LOG="$HOME/.local/state/la-alegria-post-final.log"
mkdir -p "$(dirname "$LOG")"
{
  echo "=== post-final run $(date) ==="
  mise exec -- node scripts/update.mjs
} >>"$LOG" 2>&1
crontab -l 2>/dev/null | grep -v la-alegria-post-final | crontab -
