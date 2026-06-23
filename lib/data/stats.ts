import { eq, sql } from "drizzle-orm";
import { db } from "@/db/client";
import { articles, contactMessages, events, societies } from "@/db/schema";

export type DashboardStats = {
  events: number;
  publishedEvents: number;
  articles: number;
  societies: number;
  newMessages: number;
};

async function countRows(
  table: typeof events | typeof articles | typeof societies,
): Promise<number> {
  const rows = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(table);
  return rows[0]?.count ?? 0;
}

/** Aggregate counts for the admin dashboard home. */
export async function getDashboardStats(): Promise<DashboardStats> {
  const [eventCount, publishedEventRows, articleCount, societyCount, msgRows] =
    await Promise.all([
      countRows(events),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(events)
        .where(eq(events.status, "published")),
      countRows(articles),
      countRows(societies),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(contactMessages)
        .where(eq(contactMessages.status, "new")),
    ]);

  return {
    events: eventCount,
    publishedEvents: publishedEventRows[0]?.count ?? 0,
    articles: articleCount,
    societies: societyCount,
    newMessages: msgRows[0]?.count ?? 0,
  };
}
