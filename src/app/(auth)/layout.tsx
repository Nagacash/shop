import type { Metadata } from "next";
import AuthAside from "@/components/AuthAside";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative isolate min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <AuthAside />

      <section className="relative z-10 flex items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">{children}</div>
      </section>
    </main>
  );
}
