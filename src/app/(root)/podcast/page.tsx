import Link from "next/link";
import { ExternalLink } from "lucide-react";
import PageHero from "@/components/PageHero";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  NAGA_CODEX_URL,
  WOODLAND360_PODCAST,
  woodland360EmbedUrl,
} from "@/lib/brand/naga-network";
import { MARKETING_IMAGES, SECTION_CLIPS } from "@/lib/brand/marketing-images";

export const revalidate = 120;

export const metadata = buildPageMetadata({
  title: "Woodland 360 Podcast",
  description: `${WOODLAND360_PODCAST.name} — ${WOODLAND360_PODCAST.tagline}. Featured: Lyn T. Hosted by Maurice Holda on Naga Codex.`,
  path: "/podcast",
  image: MARKETING_IMAGES.productDust,
});

export default function PodcastPage() {
  const episode = WOODLAND360_PODCAST.featuredEpisode;

  return (
    <>
      <PageHero
        clipId={SECTION_CLIPS.contact}
        imageSrc={MARKETING_IMAGES.productDust}
        eyebrow="Hamburg // on air"
        title={WOODLAND360_PODCAST.name}
        subtitle={`feat. ${episode.guest} — ${episode.title}. ${WOODLAND360_PODCAST.description}`}
        headingAs="h1"
      />

      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <nav className="text-caption text-dark-700">
          <Link href="/" className="hover:underline">
            Home
          </Link>{" "}
          / <span className="text-dark-900">Podcast</span>
        </nav>

        <article className="mt-10 space-y-6">
          <div className="naga-bezel-light">
            <div className="naga-bezel-light-inner overflow-hidden p-3 sm:p-4">
              <div className="aspect-video overflow-hidden rounded-lg bg-dark-900">
                <iframe
                  src={woodland360EmbedUrl(episode.youtubeId)}
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
              {episode.part} · {WOODLAND360_PODCAST.name}
            </p>
            <p className="mt-4 text-body leading-relaxed text-dark-700">
              {WOODLAND360_PODCAST.description} This episode features {episode.guest} — a
              long-form conversation from the Woodland 360 round, hosted by {WOODLAND360_PODCAST.host}.
            </p>
            <a
              href={episode.watchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="naga-btn naga-btn-dark mt-6 inline-flex focus-ring focus-visible:outline-none"
            >
              Watch on YouTube
              <ExternalLink className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
            </a>
          </div>

          <section className="rounded-xl border border-light-300 bg-light-100 p-6">
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
        </article>
      </main>
    </>
  );
}
