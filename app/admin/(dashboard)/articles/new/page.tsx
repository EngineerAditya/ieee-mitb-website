import ArticleForm from "@/components/admin/article-form";
import { PageHeader } from "@/components/admin/ui";
import { listSocietiesAdmin } from "@/lib/data/societies";

export default async function NewArticlePage() {
  const societies = await listSocietiesAdmin();
  return (
    <div>
      <PageHeader title="New article" />
      <ArticleForm
        societies={societies.map((s) => ({ id: s.id, name: s.name }))}
      />
    </div>
  );
}
