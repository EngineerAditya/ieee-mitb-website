import { notFound } from "next/navigation";
import SocietyForm from "@/components/admin/society-form";
import { PageHeader } from "@/components/admin/ui";
import { getSocietyById } from "@/lib/data/societies";

type Params = Promise<{ id: string }>;

export default async function EditSocietyPage({ params }: { params: Params }) {
  const { id } = await params;
  const society = await getSocietyById(id);
  if (!society) notFound();

  return (
    <div>
      <PageHeader title="Edit society" />
      <SocietyForm society={society} />
    </div>
  );
}
