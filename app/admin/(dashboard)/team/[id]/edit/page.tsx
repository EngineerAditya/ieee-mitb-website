import { notFound } from "next/navigation";
import TeamForm from "@/components/admin/team-form";
import { PageHeader } from "@/components/admin/ui";
import { getTeamMemberById } from "@/lib/data/team";

type Params = Promise<{ id: string }>;

export default async function EditTeamMemberPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  const member = await getTeamMemberById(id);
  if (!member) notFound();

  return (
    <div>
      <PageHeader title="Edit member" />
      <TeamForm member={member} />
    </div>
  );
}
