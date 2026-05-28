#!/bin/zsh
set -euo pipefail

SCRIPT_DIR="${0:A:h}"
MODULE_CACHE="${TMPDIR:-/tmp}/talking-pets-swift-module-cache"

mkdir -p "$MODULE_CACHE"
export CLANG_MODULE_CACHE_PATH="$MODULE_CACHE"

exec /usr/bin/swift "$SCRIPT_DIR/pet-rollout-monitor.swift" "$@"
