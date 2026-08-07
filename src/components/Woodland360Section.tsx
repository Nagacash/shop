import Link from "next/link";
import { ArrowRight, ExternalLink, Mic2, Radio } from "lucide-react";
import InViewMotion from "@/components/motion/InViewMotion";
import {
  NAGA_CODEX_URL,
  WOODLAND360_PODCAST,
  woodland360EmbedUrl,
} from "@/lib/brand/naga-network";

type Props = {
  showCodexCredit?: boolean;
  className?: string;
};

export default function Woodland360Section({ showCodexCredit = true, className = "" }: Props) {
  const episode = WOODLAND360_PODCAST.featuredEpisode;

  return (
    <section
      id="woodland-360"
      className={`scroll-layer border-t border-dark-900/8 bg-dark-900 text-light-100 ${className}`}
      aria-labelledby="woodland360-heading"
      data-cursor-section
      data-cursor-index="06"
      data-cursor-label="Woodland 360"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 pb-28 sm:px-6 lg:px-8 lg:py-24 lg:pb-28">
        <InViewMotion reveal className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-14 lg:items-start">
          <div>
            <p data-motion-reveal className="naga-eyebrow border-light-100/15 bg-light-100/5">
              <span className="naga-eyebrow-dot" aria-hidden="true" />
              <Radio className="inline h-3 w-3 text-[--color-naga-gold]" strokeWidth={1.75} aria-hidden="true" />
              {" "}
              Our podcast
            </p>

            <h2
              id="woodland360-heading"
              data-motion-reveal
              className="naga-display mt-4 text-heading-3 font-bold tracking-tighter text-light-100 text-balance sm:text-heading-2 md:text-heading-1"
            >
              {WOODLAND360_PODCAST.name}
            </h2>

            <p data-motion-reveal className="mt-2 text-caption uppercase tracking-[0.18em] text-[--color-naga-gold]">
              {WOODLAND360_PODCAST.tagline}
            </p>

            <p data-motion-reveal className="mt-5 max-w-lg text-body leading-relaxed text-light-400">
              {WOODLAND360_PODCAST.description}
            </p>

            <ul data-motion-reveal className="mt-6 flex flex-wrap gap-2">
              {WOODLAND360_PODCAST.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-light-100/10 bg-light-100/5 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-light-400"
                >
                  {tag}
                </li>
              ))}
            </ul>

            <p data-motion-reveal className="mt-8 flex items-center gap-2 text-caption text-light-400">
              <Mic2 className="h-3.5 w-3.5 text-[--color-naga-gold]" strokeWidth={1.75} aria-hidden="true" />
              Hosted by {WOODLAND360_PODCAST.host}
              {" · "}
              {WOODLAND360_PODCAST.studio}
            </p>

            <div data-motion-reveal className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/podcast"
                className="naga-btn naga-btn-gold focus-ring focus-visible:outline-none"
              >
                Full episode
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
              </Link>
              <a
                href={episode.watchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="naga-btn naga-btn-outline-light focus-ring focus-visible:outline-none"
              >
                Watch on YouTube
                <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
              </a>
            </div>

            {showCodexCredit && (
              <p data-motion-reveal className="mt-10 max-w-md border-t border-light-100/10 pt-6 text-caption leading-relaxed text-light-400">
                This store is designed and engineered by{" "}
                <a
                  href={NAGA_CODEX_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[--color-naga-gold] underline-offset-2 transition-colors duration-[var(--duration-normal)] ease-[var(--ease-premium)] hover:underline"
                >
                  Naga Codex
                </a>
                {" — "}
                custom web development, AI workflows, and cybersecurity from Hamburg.
              </p>
            )}
          </div>

          <div className="naga-bezel-dark">
            <div className="naga-bezel-dark-inner overflow-hidden p-3 sm:p-4">
              <div data-motion-reveal className="mb-3 flex items-start justify-between gap-3 px-1">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[--color-naga-gold]">
                    Featured episode
                  </p>
                  <p className="mt-1 naga-display text-body-medium text-light-100">
                    feat. {episode.guest}
                  </p>
                  <p className="mt-1 text-caption text-light-400">
                    {episode.title}
                  </p>
                  <p className="text-caption text-light-100/50">{episode.part}</p>
                </div>
                <span className="shrink-0 rounded-full border border-[--color-naga-gold]/30 bg-[--color-naga-gold]/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-[--color-naga-gold]">
                  On air
                </span>
              </div>

              {/* Keep iframe outside transformed/motion parents — CSS transform kills YouTube click hit-testing */}
              <div className="naga-podcast-embed aspect-video overflow-hidden rounded-lg border border-light-100/10 bg-black">
                <iframe
                  src={woodland360EmbedUrl(episode.youtubeId)}
                  title={`${WOODLAND360_PODCAST.name} — ${episode.guest}: ${episode.title}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className="relative z-[1] h-full w-full"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </InViewMotion>
      </div>
    </section>
  );
}
