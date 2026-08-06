#!/usr/bin/env bash
# Create (or reuse) a date-stamped working branch for the current day,
# commit pending changes, push, and open a PR to main.
# Usage: ./scripts/new-day.sh "commit message"
set -euo pipefail

DATE="$(date +%Y-%m-%d)"
BRANCH="daily/${DATE}"
MSG="${1:-daily changes (${DATE})}"
REMOTE="${REMOTE:-origin}"
MAIN="${MAIN:-main}"

base=$(git rev-parse "${REMOTE}/${MAIN}" 2>/dev/null || git rev-parse HEAD)
git fetch "${REMOTE}" "${MAIN}:${MAIN}" 2>/dev/null || true

# Create the daily branch from main (reset to main so history stays clean)
git branch -f "${BRANCH}" "${MAIN}" 2>/dev/null || git checkout -b "${BRANCH}" "${MAIN}"
git checkout "${BRANCH}"
git reset --soft "${base}"

# Stage and commit current changes
git add -A
git commit -m "${MSG}" || echo "Nothing to commit"

# Push branch (force, since it is date-scoped) and open a PR
git push "${REMOTE}" "${BRANCH}" --force

if command -v gh >/dev/null 2>&1 && gh auth status >/dev/null 2>&1; then
  gh pr create --repo "${REMOTE#*:}" \
    --base "${MAIN}" --head "${BRANCH}" \
    --title "Daily changes (${DATE})" \
    --body "Automated daily snapshot for ${DATE}." \
    --fill || gh pr create --repo "$(basename "$(pwd)")" --base "${MAIN}" --head "${BRANCH}" --fill
fi

echo "On ${BRANCH} ($(git rev-parse --abbrev-ref HEAD))"
