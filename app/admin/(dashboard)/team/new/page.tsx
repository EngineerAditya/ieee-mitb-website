import TeamForm from "@/components/admin/team-form";
import { PageHeader } from "@/components/admin/ui";

export default function NewTeamMemberPage() {
  return (
    <div>
      <PageHeader title="New member" />
      <TeamForm />
    </div>
  );
}
