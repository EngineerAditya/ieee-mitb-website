import { and, asc, desc, eq, gte, ilike, lt, ne, or, sql } from "drizzle-orm";
import { db } from "@/db/client";
import { eventGalleryPhotos, events, societies } from "@/db/schema";
import type { EventInput } from "@/lib/validations/event";
import type {
  EventScope,
  EventsQuery,
  Paginated,
} from "@/lib/validations/common";
import { uniqueSlug } from "./helpers";

export type EventListItem = {
  id: string;
  slug: string;
  title: string;
  description: string;
  startAt: Date;
  endAt: Date | null;
  venue: string | null;
  imageUrl: string | null;
  registrationUrl: string | null;
  eventType: string | null;
  societyName: string | null;
  societySlug: string | null;
};

const listSelection = {
  id: events.id,
  slug: events.slug,
  title: events.title,
  description: events.description,
  startAt: events.startAt,
  endAt: events.endAt,
  venue: events.venue,
  imageUrl: events.imageUrl,
  registrationUrl: events.registrationUrl,
  eventType: events.eventType,
  societyName: societies.name,
  societySlug: societies.slug,
};

function buildFilters(q: EventsQuery, scope: EventScope) {
  const conds = [eq(events.status, "published")];
  const now = sql`now()`;

  if (scope === "upcoming") conds.push(gte(events.startAt, now));
  else if (scope === "past") conds.push(lt(events.startAt, now));

  if (q.society) conds.push(eq(societies.slug, q.society));

  if (q.date) {
    conds.push(gte(events.startAt, sql`${q.date}::date`));
    conds.push(lt(events.startAt, sql`(${q.date}::date + interval '1 day')`));
  } else if (q.year && q.month) {
    conds.push(gte(events.startAt, sql`make_date(${q.year}, ${q.month}, 1)`));
    conds.push(
      lt(
        events.startAt,
        sql`(make_date(${q.year}, ${q.month}, 1) + interval '1 month')`,
      ),
    );
  } else if (q.year) {
    conds.push(gte(events.startAt, sql`make_date(${q.year}, 1, 1)`));
    conds.push(lt(events.startAt, sql`make_date(${q.year + 1}, 1, 1)`));
  }

  if (q.search) {
    const like = `%${q.search}%`;
    const match = or(
      ilike(events.title, like),
      ilike(events.description, like),
    );
    if (match) conds.push(match);
  }

  return and(...conds);
}

/**
 * Paginated, filtered list of published events. Real DB-side `LIMIT/OFFSET` +
 * `count(*)` — replaces the legacy "fetch all then .slice()" anti-pattern.
 */
export async function listEvents(
  scope: EventScope,
  q: EventsQuery,
): Promise<Paginated<EventListItem>> {
  const where = buildFilters(q, scope);
  const orderBy = scope === "past" ? desc(events.startAt) : asc(events.startAt);
  const offset = (q.page - 1) * q.pageSize;

  const [rows, countRows] = await Promise.all([
    db
      .select(listSelection)
      .from(events)
      .leftJoin(societies, eq(events.societyId, societies.id))
      .where(where)
      .orderBy(orderBy)
      .limit(q.pageSize)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(events)
      .leftJoin(societies, eq(events.societyId, societies.id))
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

/** Total count of published events (home stats). */
export async function countPublishedEvents(): Promise<number> {
  const rows = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(events)
    .where(eq(events.status, "published"));
  return rows[0]?.count ?? 0;
}

/** The next `limit` upcoming published events (home page). */
export async function getUpcomingEvents(limit = 2): Promise<EventListItem[]> {
  return db
    .select(listSelection)
    .from(events)
    .leftJoin(societies, eq(events.societyId, societies.id))
    .where(and(eq(events.status, "published"), gte(events.startAt, sql`now()`)))
    .orderBy(asc(events.startAt))
    .limit(limit);
}

export type EventDetail = EventListItem & {
  gallery: { id: string; imageUrl: string; caption: string | null }[];
};

/** A single published event by slug, with its gallery. */
export async function getEventBySlug(
  slug: string,
): Promise<EventDetail | null> {
  const rows = await db
    .select(listSelection)
    .from(events)
    .leftJoin(societies, eq(events.societyId, societies.id))
    .where(and(eq(events.slug, slug), eq(events.status, "published")))
    .limit(1);
  const event = rows[0];
  if (!event) return null;

  const gallery = await db
    .select({
      id: eventGalleryPhotos.id,
      imageUrl: eventGalleryPhotos.imageUrl,
      caption: eventGalleryPhotos.caption,
    })
    .from(eventGalleryPhotos)
    .where(eq(eventGalleryPhotos.eventId, event.id))
    .orderBy(asc(eventGalleryPhotos.displayOrder));

  return { ...event, gallery };
}

// ── Admin ───────────────────────────────────────────────────────────────────

/** Admin list — all statuses, newest first. */
export async function listEventsAdmin(page = 1, pageSize = 20) {
  const offset = (page - 1) * pageSize;
  const [rows, countRows] = await Promise.all([
    db
      .select({
        id: events.id,
        title: events.title,
        slug: events.slug,
        startAt: events.startAt,
        status: events.status,
        societyName: societies.name,
      })
      .from(events)
      .leftJoin(societies, eq(events.societyId, societies.id))
      .orderBy(desc(events.startAt))
      .limit(pageSize)
      .offset(offset),
    db.select({ count: sql<number>`count(*)::int` }).from(events),
  ]);
  return { rows, total: countRows[0]?.count ?? 0 };
}

export async function getEventById(id: string) {
  const rows = await db.select().from(events).where(eq(events.id, id)).limit(1);
  return rows[0] ?? null;
}

const slugExists = (slug: string, exceptId?: string) =>
  db
    .select({ id: events.id })
    .from(events)
    .where(
      exceptId
        ? and(eq(events.slug, slug), ne(events.id, exceptId))
        : eq(events.slug, slug),
    )
    .limit(1)
    .then((r) => r.length > 0);

export async function createEvent(data: EventInput) {
  const slug = data.slug
    ? await uniqueSlug(data.slug, (s) => slugExists(s))
    : await uniqueSlug(data.title, (s) => slugExists(s));
  const rows = await db
    .insert(events)
    .values({
      slug,
      societyId: data.societyId,
      title: data.title,
      description: data.description,
      startAt: data.startAt,
      endAt: data.endAt,
      venue: data.venue,
      imageUrl: data.imageUrl,
      registrationUrl: data.registrationUrl,
      eventType: data.eventType,
      status: data.status,
    })
    .returning({ id: events.id, slug: events.slug });
  return rows[0]!;
}

export async function updateEvent(id: string, data: EventInput) {
  const slug = data.slug
    ? await uniqueSlug(data.slug, (s) => slugExists(s, id))
    : undefined;
  await db
    .update(events)
    .set({
      ...(slug ? { slug } : {}),
      societyId: data.societyId,
      title: data.title,
      description: data.description,
      startAt: data.startAt,
      endAt: data.endAt,
      venue: data.venue,
      imageUrl: data.imageUrl,
      registrationUrl: data.registrationUrl,
      eventType: data.eventType,
      status: data.status,
      updatedAt: new Date(),
    })
    .where(eq(events.id, id));
}

export async function deleteEvent(id: string) {
  await db.delete(events).where(eq(events.id, id));
}
