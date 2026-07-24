#!/usr/bin/env bash
# Push Prisma schema to a Turso database (creates tables only if empty).
set -euo pipefail
cd "$(dirname "$0")/.."

if [[ -z "${TURSO_DATABASE_URL:-}" || -z "${TURSO_AUTH_TOKEN:-}" ]]; then
  echo "Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN in the environment."
  echo "Example:"
  echo '  export TURSO_DATABASE_URL="libsql://your-db-org.turso.io"'
  echo '  export TURSO_AUTH_TOKEN="..."'
  exit 1
fi

if [[ -z "${1:-}" ]]; then
  echo "Usage: npm run db:push:turso -- YOUR_TURSO_DB_NAME"
  echo "  (DB name from: turso db list)"
  exit 1
fi

DB_NAME="$1"

export PATH="${PATH}:${HOME}/.turso"

if ! command -v turso >/dev/null 2>&1; then
  echo "Turso CLI not found. Install: curl -sSfL https://get.tur.so/install.sh | bash"
  exit 1
fi

EXISTING=$(turso db shell "$DB_NAME" "SELECT COUNT(*) FROM sqlite_master WHERE type='table' AND name='WeddingSettings';" 2>/dev/null | tail -1 | tr -d '[:space:]' || echo "0")

if [[ "$EXISTING" == "1" ]]; then
  echo "Tables already exist on Turso (WeddingSettings found). Nothing to do."
  echo "Add data on Vercel, or copy from your Mac: npm run db:sync:turso"
  exit 0
fi

SQL_FILE="$(mktemp).sql"

npx prisma migrate diff \
  --from-empty \
  --to-schema-datamodel prisma/schema.prisma \
  --script > "$SQL_FILE"

echo "Applying schema to Turso database: $DB_NAME"
if turso db shell "$DB_NAME" < "$SQL_FILE"; then
  echo "Done."
else
  echo "If you see 'already exists', tables were created earlier — you can ignore and run: npm run db:sync:turso"
  exit 1
fi
rm -f "$SQL_FILE"
