"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { WeddingSettings } from "@prisma/client";
import { updateSettings } from "@/lib/actions/settings";
import { logoutAction } from "@/lib/actions/auth";
import { Button, Card, Field, Input, Textarea } from "@/components/ui";

export function SettingsForm({
  settings,
  authEnabled,
}: {
  settings: WeddingSettings;
  authEnabled: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [partnerOne, setPartnerOne] = useState(settings.partnerOne ?? "");
  const [partnerTwo, setPartnerTwo] = useState(settings.partnerTwo ?? "");
  const [weddingDate, setWeddingDate] = useState(
    settings.weddingDate ? settings.weddingDate.toISOString().slice(0, 10) : ""
  );
  const [guestEstimate, setGuestEstimate] = useState(String(settings.guestEstimate));
  const [totalBudgetJod, setTotalBudgetJod] = useState(
    settings.totalBudgetJod != null ? String(settings.totalBudgetJod) : ""
  );
  const [notes, setNotes] = useState(settings.notes ?? "");

  return (
    <Card>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          startTransition(async () => {
            await updateSettings({
              partnerOne,
              partnerTwo,
              weddingDate: weddingDate || null,
              guestEstimate: Number(guestEstimate) || 150,
              totalBudgetJod: totalBudgetJod === "" ? null : Number(totalBudgetJod),
              notes,
            });
            router.refresh();
          });
        }}
      >
        <Field label="Groom">
          <Input value={partnerOne} onChange={(e) => setPartnerOne(e.target.value)} placeholder="Ahmad" />
        </Field>
        <Field label="Bride">
          <Input value={partnerTwo} onChange={(e) => setPartnerTwo(e.target.value)} placeholder="Nour" />
        </Field>
        <Field label="Wedding date">
          <Input type="date" value={weddingDate} onChange={(e) => setWeddingDate(e.target.value)} />
        </Field>
        <Field label="Guest estimate (for venue math)">
          <Input
            type="number"
            inputMode="numeric"
            value={guestEstimate}
            onChange={(e) => setGuestEstimate(e.target.value)}
          />
        </Field>
        <Field label="Total budget (JOD)">
          <Input
            type="number"
            value={totalBudgetJod}
            onChange={(e) => setTotalBudgetJod(e.target.value)}
          />
        </Field>
        <Field label="General notes">
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
        </Field>
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Saving…" : "Save settings"}
        </Button>
      </form>
      {authEnabled && (
        <form action={logoutAction} className="mt-6">
          <Button type="submit" variant="secondary" className="w-full">
            Sign out
          </Button>
        </form>
      )}
      <p className="mt-6 text-xs leading-relaxed text-slate-500">
        {authEnabled
          ? "Only people with your shared password can open this app. Share the same password with your fiancé — change it in .env (APP_PASSWORD)."
          : "To lock the app, set APP_PASSWORD and SESSION_TOKEN in .env (see README)."}
      </p>
      <p className="mt-2 text-xs leading-relaxed text-slate-500">
        Data is stored in your database. For Vercel, connect Turso and set DATABASE_URL — see README.
      </p>
    </Card>
  );
}
