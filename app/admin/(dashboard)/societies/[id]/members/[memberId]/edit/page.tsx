import { notFound } from "next/navigation";
import MemberForm from "@/components/admin/member-form";
import { PageHeader } from "@/components/admin/ui";
import { getMemberById } from "@/lib/data/societies";

type Params = Promise<{ id: string; memberId: string }>;

export default async function EditMemberPage({ params }: { params: Params }) {
  const { id, memberId } = await params;
  const member = await getMemberById(memberId);
  if (!member) notFound();

  return (
    <div>
      <PageHeader title="Edit member" />
      <MemberForm societyId={id} member={member} />
    </div>
  );
}
