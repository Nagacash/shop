import Image from "next/image";
import BrandVideoBackdrop from "@/components/BrandVideoBackdrop";
import PageHeroMotion from "@/components/motion/PageHeroMotion";
import { getPageHeroUrl, getHeroImageUrl } from "@/lib/brand/assets";
import type { PageHeroKey } from "@/lib/brand/page-heroes";
import type { BrandClipId } from "@/lib/brand/marketing-images";

type PageHeroProps = {
  page?: PageHeroKey;
  imageSrc?: string | null;
  clipId?: BrandClipId;
  title: string;
  subtitle?: string;
  eyebrow?: string;
  size?: "full" | "compact" | "slim";
  imageFit?: "cover" | "contain";
  /** Use h2 when this hero sits below the page’s primary h1 (e.g. homepage sections). */
  headingAs?: "h1" | "h2";
  children?: React.ReactNode;
};

export default function PageHero({
  page,
  imageSrc,
  clipId,
  title,
  subtitle,
  eyebrow,
  size = "full",
  imageFit = "cover",
  headingAs = "h1",
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
      {clipId ? (
        <BrandVideoBackdrop clipId={clipId} poster={resolved ?? undefined} />
      ) : (
        resolved && (
          <Image
            src={resolved}
            alt=""
            fill
            priority={size === "full"}
            loading={size === "full" ? undefined : "lazy"}
            decoding="async"
            unoptimized
            className={
              imageFit === "contain"
                ? "object-contain object-center p-8 opacity-90 sm:p-12"
                : "object-cover object-center opacity-75"
            }
            sizes="100vw"
          />
        )
      )}

      {!clipId && (
        <>
          <div
            className="absolute inset-0 bg-gradient-to-r from-dark-900/95 via-dark-900/88 to-dark-900/65"
            aria-hidden="true"
          />
          <div className="hero-gold-glow pointer-events-none absolute inset-0" aria-hidden="true" />
        </>
      )}

      <div className={"relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 " + padding}>
        <PageHeroMotion>
          {eyebrow && (
            <p data-page-hero-eyebrow className="naga-eyebrow">
              <span className="naga-eyebrow-dot" aria-hidden="true" />
              {eyebrow}
            </p>
          )}
          {headingAs === "h2" ? (
            <h2
              data-page-hero-title
              className={
                (size === "slim"
                  ? "mt-2 naga-display text-heading-3 text-balance"
                  : "mt-3 naga-display text-heading-3 sm:text-heading-2 text-balance") +
                " font-bold tracking-tighter"
              }
            >
              {title}
            </h2>
          ) : (
            <h1
              data-page-hero-title
              className={
                (size === "slim"
                  ? "mt-2 naga-display text-heading-3 text-balance"
                  : "mt-3 naga-display text-heading-3 sm:text-heading-2 text-balance") +
                " font-bold tracking-tighter"
              }
            >
              {title}
            </h1>
          )}
          {subtitle && (
            <p data-page-hero-sub className="mt-3 max-w-2xl text-body text-light-400 sm:text-lead">
              {subtitle}
            </p>
          )}
          {children}
        </PageHeroMotion>
      </div>
    </section>
  );
}
