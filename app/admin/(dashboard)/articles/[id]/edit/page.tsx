import { notFound } from "next/navigation";
import ArticleForm from "@/components/admin/article-form";
import { PageHeader } from "@/components/admin/ui";
import { getArticleById } from "@/lib/data/articles";
import { listSocietiesAdmin } from "@/lib/data/societies";

type Params = Promise<{ id: string }>;

export default async function EditArticlePage({ params }: { params: Params }) {
  const { id } = await params;
  const [article, societies] = await Promise.all([
    getArticleById(id),
    listSocietiesAdmin(),
  ]);
  if (!article) notFound();

  return (
    <div>
      <PageHeader title="Edit article" />
      <ArticleForm
        article={article}
        societies={societies.map((s) => ({ id: s.id, name: s.name }))}
      />
    </div>
  );
}
