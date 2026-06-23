import SocietyForm from "@/components/admin/society-form";
import { PageHeader } from "@/components/admin/ui";

export default function NewSocietyPage() {
  return (
    <div>
      <PageHeader title="New society" />
      <SocietyForm />
    </div>
  );
}
