import type { Metadata } from "next";
import ProtectedLogo from "@/components/ProtectedLogo";
import Image from "next/image";
import { getPageHeroUrl } from "@/lib/brand/assets";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const authImage = getPageHeroUrl("auth");

  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <section className="relative hidden lg:flex flex-col justify-between bg-dark-900 text-light-100 p-10 overflow-hidden">
        {authImage && (
          <Image
            src={authImage}
            alt=""
            fill
            unoptimized
            className="object-cover object-center opacity-45"
            sizes="50vw"
            priority
          />
        )}
        <div className="absolute inset-0 bg-dark-900/75" aria-hidden="true" />
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(201,162,39,0.25),transparent_50%)]"
          aria-hidden="true"
        />

        <div className="relative z-10 flex items-center gap-3">
          <ProtectedLogo className="h-11 w-11" />
          <span className="text-body-medium tracking-tight">Naga Apparel</span>
        </div>

        <div className="relative z-10 space-y-4">
          <h2 className="text-heading-2">Hustle Hard</h2>
          <p className="max-w-md text-lead text-light-300">
            Knowledge and quality over ignorance. Join the community and shop exclusive drops —
            hoodies, heavy tees, and headwear built for the grind.
          </p>
          <div className="flex gap-2" aria-hidden="true">
            <span className="h-2 w-2 rounded-full bg-[--color-naga-gold]" />
            <span className="h-2 w-2 rounded-full bg-light-100/50" />
            <span className="h-2 w-2 rounded-full bg-light-100/50" />
          </div>
        </div>

        <p className="relative z-10 text-footnote text-light-400">
          © 2025 Naga Apparel. All rights reserved.
        </p>
      </section>

      <section className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">{children}</div>
      </section>
    </main>
  );
}
