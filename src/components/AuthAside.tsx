import Image from "next/image";
import { getPageHeroUrl } from "@/lib/brand/assets";

export default function AuthAside() {
  const authImage = getPageHeroUrl("auth");

  return (
    <section className="relative hidden flex-col justify-between overflow-hidden bg-dark-900 p-10 text-light-100 lg:flex">
      {authImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={authImage}
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center opacity-45"
        />
      )}
      <div className="pointer-events-none absolute inset-0 bg-dark-900/75" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(201,162,39,0.25),transparent_50%)]"
        aria-hidden="true"
      />

      <div className="relative z-10 flex items-center gap-3">
        <Image
          src="/logo.png"
          alt="Naga Apparel"
          width={44}
          height={44}
          className="h-11 w-11 rounded-full object-cover"
          priority
        />
        <span className="naga-display text-body-medium tracking-tight">Naga Apparel</span>
      </div>

      <div className="relative z-10 space-y-4">
        <p className="naga-eyebrow border-light-100/15 bg-light-100/5 w-fit">
          <span className="naga-eyebrow-dot" aria-hidden="true" />
          Members
        </p>
        <h2 className="naga-display text-heading-2 font-bold tracking-tighter">Hustle Hard</h2>
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
  );
}
