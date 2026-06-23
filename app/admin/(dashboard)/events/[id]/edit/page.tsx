import { notFound } from "next/navigation";
import EventForm from "@/components/admin/event-form";
import { PageHeader } from "@/components/admin/ui";
import { getEventById } from "@/lib/data/events";
import { listSocietiesAdmin } from "@/lib/data/societies";

type Params = Promise<{ id: string }>;

export default async function EditEventPage({ params }: { params: Params }) {
  const { id } = await params;
  const [event, societies] = await Promise.all([
    getEventById(id),
    listSocietiesAdmin(),
  ]);
  if (!event) notFound();

  return (
    <div>
      <PageHeader title="Edit event" />
      <EventForm
        event={event}
        societies={societies.map((s) => ({ id: s.id, name: s.name }))}
      />
    </div>
  );
}
