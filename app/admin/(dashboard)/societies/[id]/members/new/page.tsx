import MemberForm from "@/components/admin/member-form";
import { PageHeader } from "@/components/admin/ui";

type Params = Promise<{ id: string }>;

export default async function NewMemberPage({ params }: { params: Params }) {
  const { id } = await params;
  return (
    <div>
      <PageHeader title="New member" />
      <MemberForm societyId={id} />
    </div>
  );
}
