import Link from "next/link";
import { ExternalLink } from "lucide-react";
import PageHero from "@/components/PageHero";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  NAGA_CODEX_URL,
  type Woodland360Episode,
  WOODLAND360_PODCAST,
  woodland360EmbedUrl,
} from "@/lib/brand/naga-network";
import { MARKETING_IMAGES, SECTION_CLIPS } from "@/lib/brand/marketing-images";

export const revalidate = 120;

function episodeJumpLabel(ep: Woodland360Episode): string {
  if (ep.youtubeId === "kFymYp734yk") return "Lyn T — Part 1";
  if (ep.youtubeId === "BsEP785EpBE") return "Lyn T — Part 2";
  return ep.guest;
}

export const metadata = buildPageMetadata({
  title: "Woodland 360 Podcast — Hamburg Urban Culture",
  description: `${WOODLAND360_PODCAST.name} — ${WOODLAND360_PODCAST.tagline}. Watch Haji Brown, Lyn T (Parts 1 & 2), and more in-page. Creative sovereignty, counter-culture, and city life from Naga Apparel.`,
  path: "/podcast",
  image: MARKETING_IMAGES.productDust,
});

function EpisodeBlock({
  episode,
  label,
}: {
  episode: Woodland360Episode;
  label?: string;
}) {
  const host = episode.episodeHost ?? WOODLAND360_PODCAST.host;

  return (
    <section className="scroll-mt-24 space-y-4 border-t border-light-300 pt-10 first:border-t-0 first:pt-0" id={episode.youtubeId}>
      {label ? (
        <p className="text-caption uppercase tracking-[0.14em] text-[--color-naga-gold]">{label}</p>
      ) : null}

      <div className="naga-bezel-light">
        <div className="naga-bezel-light-inner overflow-hidden p-3 sm:p-4">
          <div className="aspect-video overflow-hidden rounded-lg bg-dark-900">
            <iframe
              src={woodland360EmbedUrl(episode.youtubeId, episode.youtubeStartSeconds)}
              title={`${WOODLAND360_PODCAST.name} — ${episode.guest}: ${episode.title}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="h-full w-full"
            />
          </div>
        </div>
      </div>

      <div>
        <h2 className="naga-display text-heading-3 font-bold tracking-tighter text-dark-900">
          {episode.guest}: {episode.title}
        </h2>
        <p className="mt-2 text-caption uppercase tracking-[0.14em] text-dark-700">
          {episode.part} · {WOODLAND360_PODCAST.name} · {host}
        </p>
        <a
          href={episode.watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1.5 text-caption text-dark-700 underline focus-ring focus-visible:outline-none"
        >
          YouTube
          <ExternalLink className="h-3.5 w-3.5" aria-hidden />
        </a>
      </div>
    </section>
  );
}

export default function PodcastPage() {
  const [latest, ...rest] = WOODLAND360_PODCAST.episodes;

  return (
    <>
      <PageHero
        clipId={SECTION_CLIPS.contact}
        imageSrc={MARKETING_IMAGES.productDust}
        eyebrow="Hamburg // on air"
        title={WOODLAND360_PODCAST.name}
        subtitle={`${WOODLAND360_PODCAST.tagline}. ${WOODLAND360_PODCAST.episodes.length} episodes on this page — play in place.`}
        headingAs="h1"
      />

      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <nav className="text-caption text-dark-700">
          <Link href="/" className="hover:underline">
            Home
          </Link>{" "}
          / <span className="text-dark-900">Podcast</span>
        </nav>

        <p className="mt-8 text-body leading-relaxed text-dark-700">{WOODLAND360_PODCAST.description}</p>

        {WOODLAND360_PODCAST.episodes.length > 1 && (
          <nav
            className="mt-6 flex flex-wrap gap-2"
            aria-label="Jump to episode"
          >
            {WOODLAND360_PODCAST.episodes.map((ep) => (
              <a
                key={ep.youtubeId}
                href={`#${ep.youtubeId}`}
                className="rounded-full border border-light-300 bg-light-100 px-3 py-1.5 text-caption text-dark-900 transition hover:border-dark-500 focus-ring focus-visible:outline-none"
              >
                {episodeJumpLabel(ep)}
              </a>
            ))}
          </nav>
        )}

        <article className="mt-10 space-y-0">
          <EpisodeBlock episode={latest} label="Latest episode" />
          {rest.map((episode) => (
            <EpisodeBlock key={episode.youtubeId} episode={episode} label="Also on Woodland 360" />
          ))}
        </article>

        <section className="mt-12 rounded-xl border border-light-300 bg-light-100 p-6">
          <h3 className="naga-display text-body-medium text-dark-900">About the show</h3>
          <p className="mt-3 text-body leading-relaxed text-dark-700">
            {WOODLAND360_PODCAST.name} is the urban podcast from {WOODLAND360_PODCAST.studio} in
            Hamburg — street culture, creative tech, and city life on long-form frequency.
          </p>
          <p className="mt-4 text-body leading-relaxed text-dark-700">
            The Naga Apparel store and this podcast sit under the same creative umbrella. Site
            design, checkout, and security hardening by{" "}
            <a
              href={NAGA_CODEX_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-dark-900 underline"
            >
              Naga Codex
            </a>
            .
          </p>
        </section>
      </main>
    </>
  );
}