import { and, desc, eq, gte, ilike, lt, ne, or, sql } from "drizzle-orm";
import { db } from "@/db/client";
import { articles, societies } from "@/db/schema";
import type { ArticleInput } from "@/lib/validations/article";
import type { ListQuery, Paginated } from "@/lib/validations/common";
import { uniqueSlug } from "./helpers";

export type ArticleListItem = {
  id: string;
  slug: string;
  title: string;
  author: string | null;
  publication: string | null;
  publicationDate: string | null;
  externalUrl: string | null;
  imageUrl: string | null;
  excerpt: string | null;
  societyName: string | null;
  societySlug: string | null;
};

const listSelection = {
  id: articles.id,
  slug: articles.slug,
  title: articles.title,
  author: articles.author,
  publication: articles.publication,
  publicationDate: articles.publicationDate,
  externalUrl: articles.externalUrl,
  imageUrl: articles.imageUrl,
  excerpt: articles.excerpt,
  societyName: societies.name,
  societySlug: societies.slug,
};

function buildFilters(q: ListQuery) {
  const conds = [eq(articles.status, "published")];

  if (q.society) conds.push(eq(societies.slug, q.society));

  if (q.date) {
    conds.push(eq(articles.publicationDate, q.date));
  } else if (q.year && q.month) {
    conds.push(
      gte(articles.publicationDate, sql`make_date(${q.year}, ${q.month}, 1)`),
    );
    conds.push(
      lt(
        articles.publicationDate,
        sql`(make_date(${q.year}, ${q.month}, 1) + interval '1 month')`,
      ),
    );
  } else if (q.year) {
    conds.push(gte(articles.publicationDate, sql`make_date(${q.year}, 1, 1)`));
    conds.push(
      lt(articles.publicationDate, sql`make_date(${q.year + 1}, 1, 1)`),
    );
  }

  if (q.search) {
    const like = `%${q.search}%`;
    const match = or(
      ilike(articles.title, like),
      ilike(articles.author, like),
      ilike(articles.publication, like),
      ilike(articles.excerpt, like),
    );
    if (match) conds.push(match);
  }

  return and(...conds);
}

/** Paginated, filtered list of published articles (newest first). */
export async function listArticles(
  q: ListQuery,
): Promise<Paginated<ArticleListItem>> {
  const where = buildFilters(q);
  const offset = (q.page - 1) * q.pageSize;

  const [rows, countRows] = await Promise.all([
    db
      .select(listSelection)
      .from(articles)
      .leftJoin(societies, eq(articles.societyId, societies.id))
      .where(where)
      .orderBy(desc(articles.publicationDate))
      .limit(q.pageSize)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(articles)
      .leftJoin(societies, eq(articles.societyId, societies.id))
      .where(where),
  ]);

  const total = countRows[0]?.count ?? 0;
  return {
    rows,
    total,
    page: q.page,
    pageSize: q.pageSize,
    totalPages: Math.max(1, Math.ceil(total / q.pageSize)),
  };
}

// ── Admin ───────────────────────────────────────────────────────────────────

export async function listArticlesAdmin(page = 1, pageSize = 20) {
  const offset = (page - 1) * pageSize;
  const [rows, countRows] = await Promise.all([
    db
      .select({
        id: articles.id,
        title: articles.title,
        slug: articles.slug,
        publicationDate: articles.publicationDate,
        status: articles.status,
        societyName: societies.name,
      })
      .from(articles)
      .leftJoin(societies, eq(articles.societyId, societies.id))
      .orderBy(desc(articles.publicationDate))
      .limit(pageSize)
      .offset(offset),
    db.select({ count: sql<number>`count(*)::int` }).from(articles),
  ]);
  return { rows, total: countRows[0]?.count ?? 0 };
}

export async function getArticleById(id: string) {
  const rows = await db
    .select()
    .from(articles)
    .where(eq(articles.id, id))
    .limit(1);
  return rows[0] ?? null;
}

const slugExists = (slug: string, exceptId?: string) =>
  db
    .select({ id: articles.id })
    .from(articles)
    .where(
      exceptId
        ? and(eq(articles.slug, slug), ne(articles.id, exceptId))
        : eq(articles.slug, slug),
    )
    .limit(1)
    .then((r) => r.length > 0);

function toDateString(d: Date | null): string | null {
  if (!d) return null;
  return d.toISOString().slice(0, 10);
}

export async function createArticle(data: ArticleInput) {
  const slug = data.slug
    ? await uniqueSlug(data.slug, (s) => slugExists(s))
    : await uniqueSlug(data.title, (s) => slugExists(s));
  const rows = await db
    .insert(articles)
    .values({
      slug,
      societyId: data.societyId,
      title: data.title,
      author: data.author,
      publication: data.publication,
      publicationDate: toDateString(data.publicationDate),
      externalUrl: data.externalUrl,
      imageUrl: data.imageUrl,
      excerpt: data.excerpt,
      body: data.body,
      status: data.status,
    })
    .returning({ id: articles.id, slug: articles.slug });
  return rows[0]!;
}

export async function updateArticle(id: string, data: ArticleInput) {
  const slug = data.slug
    ? await uniqueSlug(data.slug, (s) => slugExists(s, id))
    : undefined;
  await db
    .update(articles)
    .set({
      ...(slug ? { slug } : {}),
      societyId: data.societyId,
      title: data.title,
      author: data.author,
      publication: data.publication,
      publicationDate: toDateString(data.publicationDate),
      externalUrl: data.externalUrl,
      imageUrl: data.imageUrl,
      excerpt: data.excerpt,
      body: data.body,
      status: data.status,
      updatedAt: new Date(),
    })
    .where(eq(articles.id, id));
}

export async function deleteArticle(id: string) {
  await db.delete(articles).where(eq(articles.id, id));
}
