import EventForm from "@/components/admin/event-form";
import { PageHeader } from "@/components/admin/ui";
import { listSocietiesAdmin } from "@/lib/data/societies";

export default async function NewEventPage() {
  const societies = await listSocietiesAdmin();
  return (
    <div>
      <PageHeader title="New event" />
      <EventForm
        societies={societies.map((s) => ({ id: s.id, name: s.name }))}
      />
    </div>
  );
}
