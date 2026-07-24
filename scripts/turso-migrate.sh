#!/usr/bin/env bash
# Apply schema updates to an existing Turso DB (one statement per shell call).
set -euo pipefail
cd "$(dirname "$0")/.."

DB_NAME="${1:-wedding-planner}"
export PATH="${PATH}:${HOME}/.turso}"

if ! command -v turso >/dev/null 2>&1; then
  echo "Install Turso CLI: curl -sSfL https://get.tur.so/install.sh | bash"
  exit 1
fi

run() {
  local sql="$1"
  echo "→ $sql"
  local out
  if out=$(turso db shell "$DB_NAME" "$sql" 2>&1); then
    [[ -n "$out" ]] && echo "$out"
    return 0
  fi
  if echo "$out" | grep -qiE 'duplicate column|already exists'; then
    echo "  (already applied, skipping)"
    return 0
  fi
  echo "$out" >&2
  return 1
}

run "ALTER TABLE VenueMedia ADD COLUMN blobUrl TEXT;"
run "ALTER TABLE Venue ADD COLUMN contactName TEXT;"
run "ALTER TABLE Planner ADD COLUMN contactName TEXT;"
run "ALTER TABLE Vendor ADD COLUMN contactName TEXT;"

run "CREATE TABLE IF NOT EXISTS PlannerMedia (
  id TEXT NOT NULL PRIMARY KEY,
  plannerId TEXT NOT NULL,
  kind TEXT NOT NULL DEFAULT 'photo',
  storagePath TEXT NOT NULL DEFAULT '',
  blobUrl TEXT,
  originalName TEXT NOT NULL,
  mimeType TEXT NOT NULL,
  sizeBytes INTEGER NOT NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT PlannerMedia_plannerId_fkey FOREIGN KEY (plannerId) REFERENCES Planner (id) ON DELETE CASCADE ON UPDATE CASCADE
);"

echo ""
echo "Done. Venue.contactName:"
turso db shell "$DB_NAME" "PRAGMA table_info(Venue);" | grep -i contactName || true
