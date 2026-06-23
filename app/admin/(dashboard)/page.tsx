import Link from "next/link";
import { getDashboardStats } from "@/lib/data/stats";
import { PageHeader } from "@/components/admin/ui";

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const cards = [
    {
      label: "Events",
      value: stats.events,
      sub: `${stats.publishedEvents} published`,
      href: "/admin/events",
    },
    { label: "Articles", value: stats.articles, href: "/admin/articles" },
    { label: "Societies", value: stats.societies, href: "/admin/societies" },
    { label: "New messages", value: stats.newMessages, href: "/admin/inbox" },
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Manage IEEE MIT Bengaluru content."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="rounded-[4px] border border-[var(--line)] bg-[var(--surface)] p-6 transition-colors hover:border-[var(--accent)]/50 hover:bg-[var(--surface-2)]"
          >
            <p className="kicker">{c.label}</p>
            <p className="mt-3 font-display text-4xl text-[var(--ink)]">
              {c.value}
            </p>
            {c.sub && (
              <p className="mt-1 font-mono text-xs text-[var(--faint)]">
                {c.sub}
              </p>
            )}
          </Link>
        ))}
      </div>

      <div className="mt-10">
        <h2 className="mb-4 text-xl text-[var(--ink)]">Quick actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/events/new"
            className="rounded-[3px] bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--on-accent)] hover:bg-[var(--accent-bright)]"
          >
            + New event
          </Link>
          <Link
            href="/admin/articles/new"
            className="rounded-[3px] border border-[var(--line-strong)] px-4 py-2 text-sm font-semibold text-[var(--ink)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            + New article
          </Link>
          <Link
            href="/admin/announcements/new"
            className="rounded-[3px] border border-[var(--line-strong)] px-4 py-2 text-sm font-semibold text-[var(--ink)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            + New announcement
          </Link>
        </div>
      </div>
    </div>
  );
}
