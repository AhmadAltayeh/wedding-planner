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
    await prisma.venue.findFirst({ select: { id: true, contactName: true } });
    return Response.json({ ok: true, database: "connected" });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    let hint = "Check Turso URL/token and redeploy.";
    if (message.includes("no such table")) {
      hint = "Tables missing on Turso. On your Mac: npm run db:push:turso -- wedding-planner";
    } else if (message.includes("contactName") || message.includes("blobUrl") || message.includes("PlannerMedia")) {
      hint =
        "Schema is behind the app. On your Mac: npm run db:migrate:turso (not turso shell < file.sql)";
    }

    return Response.json({ ok: false, error: message, hint }, { status: 500 });
  }
}
