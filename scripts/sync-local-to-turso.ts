/**
 * Copy all rows from local SQLite (prisma/dev.db) to Turso.
 * Requires DATABASE_URL=file:./dev.db in .env and TURSO_* exported in the shell.
 *
 * Photos/files in uploads/ are NOT copied — only DB rows for VenueMedia metadata.
 */
import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";

function createRemoteClient() {
  const url = process.env.TURSO_DATABASE_URL?.trim();
  const authToken = process.env.TURSO_AUTH_TOKEN?.trim();
  if (!url || !authToken) {
    throw new Error("Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN in the environment.");
  }
  const adapter = new PrismaLibSQL({ url, authToken });
  return new PrismaClient({ adapter });
}

const local = new PrismaClient();

async function main() {
  const remote = createRemoteClient();

  try {

  const settings = await local.weddingSettings.findMany();
  const venues = await local.venue.findMany({
    include: { availableDates: true, addons: true, media: true },
  });
  const planners = await local.planner.findMany();
  const vendors = await local.vendor.findMany();
  const budgetItems = await local.budgetItem.findMany();
  const tasks = await local.task.findMany();

  console.log(
    `Found: ${settings.length} settings, ${venues.length} venues, ${planners.length} planners, ` +
      `${vendors.length} vendors, ${budgetItems.length} budget lines, ${tasks.length} tasks`
  );

  if (
    settings.length === 0 &&
    venues.length === 0 &&
    planners.length === 0 &&
    vendors.length === 0 &&
    budgetItems.length === 0 &&
    tasks.length === 0
  ) {
    console.log("Local database is empty — nothing to copy. Add venues on the Vercel site instead.");
    return;
  }

  console.log("Writing to Turso…");

  for (const s of settings) {
    await remote.weddingSettings.upsert({
      where: { id: s.id },
      create: s,
      update: s,
    });
  }

  for (const v of venues) {
    const { availableDates, addons, media, ...venue } = v;
    await remote.venue.upsert({
      where: { id: venue.id },
      create: venue,
      update: venue,
    });
    for (const d of availableDates) {
      await remote.venueDate.upsert({
        where: { id: d.id },
        create: d,
        update: d,
      });
    }
    for (const a of addons) {
      await remote.venueAddon.upsert({
        where: { id: a.id },
        create: a,
        update: a,
      });
    }
    for (const m of media) {
      await remote.venueMedia.upsert({
        where: { id: m.id },
        create: m,
        update: m,
      });
    }
  }

  for (const p of planners) {
    await remote.planner.upsert({ where: { id: p.id }, create: p, update: p });
  }
  for (const v of vendors) {
    await remote.vendor.upsert({ where: { id: v.id }, create: v, update: v });
  }
  for (const b of budgetItems) {
    await remote.budgetItem.upsert({ where: { id: b.id }, create: b, update: b });
  }
  for (const t of tasks) {
    await remote.task.upsert({ where: { id: t.id }, create: t, update: t });
  }

  console.log("Done. Turso now has your local data (except uploaded image files on disk).");
  } finally {
    await remote.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await local.$disconnect();
  });
