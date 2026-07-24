import { getSettings } from "@/lib/actions/settings";
import { isAuthConfigured } from "@/lib/auth";
import { PageHeader } from "@/components/ui";
import { SettingsForm } from "@/components/settings-form";

export default async function SettingsPage() {
  const settings = await getSettings();
  return (
    <div>
      <PageHeader title="Settings" subtitle="Names, date, guests & budget" />
      <SettingsForm settings={settings} authEnabled={isAuthConfigured()} />
    </div>
  );
}
