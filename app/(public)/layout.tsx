import Footer from "@/components/public/footer";
import Navbar from "@/components/public/navbar";
import { listSocieties } from "@/lib/data/societies";

// Rendered per request: content is DB-backed and always-fresh. (Opt into
// caching later with `use cache` once a real Supabase project is connected.)
export const dynamic = "force-dynamic";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const societies = await listSocieties();
  const nav = societies.map((s) => ({
    slug: s.slug,
    name: s.name,
    type: s.type,
  }));

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar societies={nav} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
