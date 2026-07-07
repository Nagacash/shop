import Image from "next/image";
import { LEGACY_MARKETING_IMAGES } from "@/lib/brand/marketing-images";

export default function AuthAside() {
  const authImage = LEGACY_MARKETING_IMAGES.berlinLifestyle;

  return (
    <section className="relative hidden flex-col justify-between overflow-hidden bg-dark-900 p-10 text-light-100 lg:flex">
      {authImage && (
        <Image
          src={authImage}
          alt=""
          fill
          unoptimized
          className="pointer-events-none object-cover object-center opacity-45"
          sizes="50vw"
          priority
        />
      )}
      <div className="pointer-events-none absolute inset-0 bg-dark-900/75" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(201,162,39,0.25),transparent_50%)]"
        aria-hidden="true"
      />

      <div className="relative z-10 flex items-center gap-3">
        <span className="naga-nav-wordmark naga-nav-wordmark--solo naga-nav-wordmark--light">
          <span className="naga-display block text-[1rem] font-bold leading-none tracking-tighter text-light-100">
            Naga
          </span>
          <span className="mt-1 block text-[0.5625rem] font-medium uppercase tracking-[0.28em] text-[--color-naga-gold]">
            Apparel
          </span>
        </span>
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
