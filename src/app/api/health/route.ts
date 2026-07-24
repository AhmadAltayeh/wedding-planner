import { prisma, isProductionDatabaseConfigured } from "@/lib/prisma";

export async function GET() {
  if (!isProductionDatabaseConfigured()) {
    return Response.json(
      {
        ok: false,
        error:
          "Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN on Vercel. Add both in Project → Settings → Environment Variables, then redeploy.",
      },
      { status: 503 }
    );
  }

  try {
    await prisma.weddingSettings.findUnique({ where: { id: "default" } });
    return Response.json({ ok: true, database: "connected" });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const hint = message.includes("no such table")
      ? "Tables missing on Turso. On your Mac run: npm run db:push:turso -- YOUR_DB_NAME"
      : "Check Turso URL/token and redeploy.";

    return Response.json({ ok: false, error: message, hint }, { status: 500 });
  }
}
