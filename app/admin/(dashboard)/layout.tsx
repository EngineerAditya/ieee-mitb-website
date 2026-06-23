import AdminShell from "@/components/admin/shell";
import { requireAdmin } from "@/lib/auth/require-admin";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Authorization (role === 'admin'). Middleware does the coarse logged-in gate;
  // this enforces the actual admin role and redirects otherwise.
  const profile = await requireAdmin();
  return <AdminShell email={profile.email ?? ""}>{children}</AdminShell>;
}
