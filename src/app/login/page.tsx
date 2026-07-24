import { loginAction } from "@/lib/actions/auth";
import { isAuthConfigured } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CoupleHero } from "@/components/couple-hero";
import { COUPLE } from "@/lib/brand";
import { Button, Card, Field, Input } from "@/components/ui";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; from?: string }>;
}) {
  if (!isAuthConfigured()) {
    redirect("/");
  }

  const { error, from } = await searchParams;
  const returnTo = from && from.startsWith("/") ? from : "/";

  return (
    <div className="flex min-h-[75dvh] flex-col justify-center">
      <CoupleHero groom={COUPLE.groom} bride={COUPLE.bride} />
      <Card className="mt-2">
        <p className="mb-4 text-center text-sm text-ink-muted">
          Private space for {COUPLE.groom} & {COUPLE.bride} only
        </p>
        <form action={loginAction}>
          <input type="hidden" name="from" value={returnTo} />
          <Field label="Password">
            <Input
              type="password"
              name="password"
              autoComplete="current-password"
              required
              placeholder="Shared password"
            />
          </Field>
          {error && (
            <p className="mb-4 text-sm font-medium text-sage-dark">Wrong password — try again.</p>
          )}
          <Button type="submit" className="w-full">
            Enter
          </Button>
        </form>
      </Card>
    </div>
  );
}
