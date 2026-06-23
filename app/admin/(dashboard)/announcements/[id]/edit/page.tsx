import { notFound } from "next/navigation";
import AnnouncementForm from "@/components/admin/announcement-form";
import { PageHeader } from "@/components/admin/ui";
import { getAnnouncementById } from "@/lib/data/announcements";
import { listSocietiesAdmin } from "@/lib/data/societies";

type Params = Promise<{ id: string }>;

export default async function EditAnnouncementPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  const [announcement, societies] = await Promise.all([
    getAnnouncementById(id),
    listSocietiesAdmin(),
  ]);
  if (!announcement) notFound();

  return (
    <div>
      <PageHeader title="Edit announcement" />
      <AnnouncementForm
        announcement={announcement}
        societies={societies.map((s) => ({ id: s.id, name: s.name }))}
      />
    </div>
  );
}
