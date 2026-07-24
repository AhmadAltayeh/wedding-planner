import Link from "next/link";
import { Card, Button } from "@/components/ui";

export function DatabaseSetupHelp({ detail }: { detail?: string }) {
  return (
    <Card className="mt-6 border-gold/40">
      <h2 className="font-serif text-xl font-semibold text-ink">Database not ready</h2>
      <p className="mt-2 text-sm text-ink-muted">
        Login works, but the app cannot read your wedding data on Vercel yet. This is almost always
        Turso setup (not your password).
      </p>
      <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-ink">
        <li>
          Vercel → <strong>Settings → Environment Variables</strong>: set{" "}
          <code className="rounded bg-blush px-1">TURSO_DATABASE_URL</code> and{" "}
          <code className="rounded bg-blush px-1">TURSO_AUTH_TOKEN</code>, then <strong>Redeploy</strong>.
        </li>
        <li>
          On your Mac, push tables once:{" "}
          <code className="block mt-1 rounded bg-blush p-2 text-xs">
            export TURSO_DATABASE_URL=&quot;libsql://…&quot;
            <br />
            export TURSO_AUTH_TOKEN=&quot;…&quot;
            <br />
            npm run db:push:turso -- wedding-planner
          </code>
        </li>
        <li>
          Open{" "}
          <Link href="/api/health" className="font-semibold text-sage underline">
            /api/health
          </Link>{" "}
          — should show <code>{`{"ok":true}`}</code>.
        </li>
      </ol>
      {detail && (
        <p className="mt-4 rounded-lg bg-blush/50 p-3 font-mono text-xs text-sage-dark">{detail}</p>
      )}
      <Link href="/api/health" className="mt-4 inline-block">
        <Button type="button">Check database</Button>
      </Link>
    </Card>
  );
}
