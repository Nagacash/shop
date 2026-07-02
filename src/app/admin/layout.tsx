import Link from "next/link";
import { requireAdmin } from "@/lib/auth/admin";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="min-h-dvh bg-light-200">
      <header className="border-b border-light-300 bg-light-100">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/admin/orders" className="text-body-medium text-dark-900">
            Naga Admin
          </Link>
          <nav className="flex items-center gap-4 text-body text-dark-700">
            <Link href="/admin/orders" className="hover:text-dark-900">
              Orders
            </Link>
            <Link href="/" className="hover:text-dark-900">
              Store
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
