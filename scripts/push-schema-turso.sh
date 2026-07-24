#!/usr/bin/env bash
# Push Prisma schema to a Turso database (tables only — does not copy local data).
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
SQL_FILE="$(mktemp).sql"

npx prisma migrate diff \
  --from-empty \
  --to-schema-datamodel prisma/schema.prisma \
  --script > "$SQL_FILE"

echo "Applying schema to Turso database: $DB_NAME"
turso db shell "$DB_NAME" < "$SQL_FILE"
rm -f "$SQL_FILE"
echo "Done."
