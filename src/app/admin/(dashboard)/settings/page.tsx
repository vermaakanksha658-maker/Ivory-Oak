import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminNotice } from "@/components/admin/admin-notice";
import { SettingsForm } from "@/components/admin/forms/settings-form";
import { getSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const settings = await getSettings();

  return (
    <div>
      <AdminPageHeader
        title="Site content"
        description="The words and images that shape your public website."
      />
      <AdminNotice
        saved={saved}
        message="Site content saved. Your public pages are up to date."
      />
      <SettingsForm settings={settings} />
    </div>
  );
}
