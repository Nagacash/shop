import Image from "next/image";
import { getPageHeroUrl, getHeroImageUrl } from "@/lib/brand/assets";
import type { PageHeroKey } from "@/lib/brand/page-heroes";

type PageHeroProps = {
  page?: PageHeroKey;
  imageSrc?: string | null;
  title: string;
  subtitle?: string;
  eyebrow?: string;
  size?: "full" | "compact" | "slim";
  children?: React.ReactNode;
};

export default function PageHero({
  page,
  imageSrc,
  title,
  subtitle,
  eyebrow,
  size = "full",
  children,
}: PageHeroProps) {
  const resolved =
    imageSrc ?? (page ? getPageHeroUrl(page) : null) ?? getHeroImageUrl();

  const padding =
    size === "slim"
      ? "py-10 sm:py-12"
      : size === "compact"
        ? "py-10 sm:py-14"
        : "py-12 sm:py-16 lg:py-20";

  return (
    <section className="scroll-layer relative overflow-hidden bg-dark-900 text-light-100">
      {resolved && (
        <Image
          src={resolved}
          alt=""
          fill
          priority={size === "full"}
          loading={size === "full" ? undefined : "lazy"}
          decoding="async"
          unoptimized
          className="object-cover object-center opacity-75"
          sizes="100vw"
        />
      )}
      <div
        className="absolute inset-0 bg-gradient-to-r from-dark-900/95 via-dark-900/88 to-dark-900/65"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_75%_15%,rgba(201,162,39,0.22),transparent_50%)]"
        aria-hidden="true"
      />

      <div className={"relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 " + padding}>
        {eyebrow && (
          <p className="text-caption uppercase tracking-[0.22em] text-[--color-naga-gold]">
            {eyebrow}
          </p>
        )}
        <h1
          className={
            size === "slim"
              ? "mt-1 text-heading-3 text-balance"
              : "mt-2 text-heading-3 sm:text-heading-2 text-balance"
          }
        >
          {title}
        </h1>
        {subtitle && (
          <p className="mt-3 max-w-2xl text-body text-light-400 sm:text-lead">{subtitle}</p>
        )}
        {children}
      </div>
    </section>
  );
}
