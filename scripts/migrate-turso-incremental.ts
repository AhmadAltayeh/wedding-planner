/**
 * Apply incremental SQL to Turso (columns/tables added after first deploy).
 * Requires TURSO_DATABASE_URL and TURSO_AUTH_TOKEN in the environment or .env.
 *
 *   npm run db:migrate:turso
 */
import { createClient } from "@libsql/client";
import { readFileSync } from "fs";
import path from "path";

function loadEnvFile() {
  try {
    const envPath = path.join(process.cwd(), ".env");
    const text = readFileSync(envPath, "utf8");
    for (const line of text.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let val = trimmed.slice(eq + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = val;
    }
  } catch {
    // no .env
  }
}

function isIgnorableError(message: string): boolean {
  const m = message.toLowerCase();
  return (
    m.includes("duplicate column") ||
    m.includes("already exists") ||
    m.includes("duplicate column name")
  );
}

async function main() {
  loadEnvFile();
  const url = process.env.TURSO_DATABASE_URL?.trim();
  const authToken = process.env.TURSO_AUTH_TOKEN?.trim();
  if (!url || !authToken) {
    console.error("Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN (in .env or shell).");
    process.exit(1);
  }

  const sqlPath = path.join(process.cwd(), "scripts", "turso-add-media.sql");
  const file = readFileSync(sqlPath, "utf8");
  const statements = file
    .split(";")
    .map((s) => s.replace(/--[^\n]*/g, "").trim())
    .filter((s) => s.length > 0);

  const client = createClient({ url, authToken });

  for (const statement of statements) {
    const preview = statement.replace(/\s+/g, " ").slice(0, 72);
    try {
      await client.execute(statement);
      console.log("OK:", preview);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (isIgnorableError(msg)) {
        console.log("SKIP (already applied):", preview);
      } else {
        console.error("FAIL:", preview);
        console.error(msg);
        process.exit(1);
      }
    }
  }

  console.log("\nTurso incremental migration finished.");
}

main();
