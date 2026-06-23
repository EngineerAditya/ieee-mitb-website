import AnnouncementForm from "@/components/admin/announcement-form";
import { PageHeader } from "@/components/admin/ui";
import { listSocietiesAdmin } from "@/lib/data/societies";

export default async function NewAnnouncementPage() {
  const societies = await listSocietiesAdmin();
  return (
    <div>
      <PageHeader title="New announcement" />
      <AnnouncementForm
        societies={societies.map((s) => ({ id: s.id, name: s.name }))}
      />
    </div>
  );
}
