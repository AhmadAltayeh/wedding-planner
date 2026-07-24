import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

function getTursoConfig(): { url: string; authToken: string } | null {
  let url = process.env.TURSO_DATABASE_URL?.trim();
  let authToken = process.env.TURSO_AUTH_TOKEN?.trim();

  if (!url) return null;

  if (url.includes("authToken=")) {
    try {
      const parsed = new URL(url);
      const fromUrl = parsed.searchParams.get("authToken");
      if (fromUrl && !authToken) authToken = fromUrl;
      parsed.searchParams.delete("authToken");
      url = parsed.toString();
    } catch {
      // keep url as-is
    }
  }

  if (!authToken) return null;
  return { url, authToken };
}

function createPrismaClient() {
  const log =
    process.env.NODE_ENV === "development" ? (["error", "warn"] as const) : (["error"] as const);

  const turso = getTursoConfig();

  if (process.env.VERCEL === "1" && !turso) {
    console.error(
      "[prisma] On Vercel you must set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN. " +
        "Do not use file:./dev.db in production."
    );
  }

  if (turso) {
    const adapter = new PrismaLibSQL({
      url: turso.url,
      authToken: turso.authToken,
    });
    return new PrismaClient({ adapter, log: [...log] });
  }

  return new PrismaClient({ log: [...log] });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

globalForPrisma.prisma = prisma;

export function isProductionDatabaseConfigured(): boolean {
  if (process.env.VERCEL !== "1") return true;
  return getTursoConfig() !== null;
}
