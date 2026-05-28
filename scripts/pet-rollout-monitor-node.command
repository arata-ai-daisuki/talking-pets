#!/bin/zsh
set -euo pipefail

SCRIPT_DIR="${0:A:h}"

export NODE_NO_WARNINGS=1
exec node "$SCRIPT_DIR/pet-rollout-monitor.mjs" "$@"
