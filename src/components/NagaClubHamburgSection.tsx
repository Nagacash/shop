import Image from "next/image";
import { Bebas_Neue, Space_Mono } from "next/font/google";
import InViewMotion from "@/components/motion/InViewMotion";
import SectionChapterLabel from "@/components/SectionChapterLabel";

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-naga-club-display",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-naga-club-mono",
});

const IMG = "/new/img/naga-club";

const HERO_IMAGE = `${IMG}/hero.png`;

const PHOTO_GRID = [
  {
    src: `${IMG}/venue.png`,
    alt: "Naga Club Hamburg — disco ball and DJ booth at Steintorwall 4",
    slot: "main",
  },
  {
    src: `${IMG}/crowd.png`,
    alt: "Naga Club Hamburg — packed dance floor under the disco ball",
    slot: "a",
  },
  {
    src: `${IMG}/stage.png`,
    alt: "Naga Club Hamburg — live set with the crowd reaching the stage",
    slot: "b",
  },
  {
    src: `${IMG}/entrance.png`,
    alt: "Naga Club Hamburg — night outside the Steintorwall entrance",
    slot: "c",
  },
  {
    src: `${IMG}/crew.png`,
    alt: "Naga Club Hamburg — artists and crew backstage",
    slot: "d",
  },
  {
    src: `${IMG}/lounge.png`,
    alt: "Naga Club Hamburg — guests in the lounge",
    slot: "e",
  },
  {
    src: `${IMG}/staff.png`,
    alt: "Naga Club Hamburg — staff energy backstage",
    slot: "f",
  },
  {
    src: `${IMG}/guests.png`,
    alt: "Naga Club Hamburg — night guests in the room",
    slot: "g",
  },
  {
    src: `${IMG}/crowd-portrait.png`,
    alt: "Naga Club Hamburg — crowd portrait from the floor",
    slot: "h",
  },
  {
    src: `${IMG}/backstage.png`,
    alt: "Naga Club Hamburg — behind the scenes prep",
    slot: "i",
  },
  {
    src: `${IMG}/skolim-flyer.png`,
    alt: "Naga Club Hamburg — Skolim live flyer, Steintorwall 4",
    slot: "j",
  },
] as const;

const STATS = [
  { value: "50+", label: "Events run" },
  { value: "350+", label: "Per night" },
  { value: "7+", label: "Years running" },
  { value: "95%", label: "Satisfaction" },
] as const;

const META_ROWS = [
  {
    key: "Started",
    value: "2016 — Naga Jam, monthly on the Reeperbahn / Cascadas, Ferdinandstrasse, Hamburg",
  },
  { key: "COVID", value: "March 2020 — forced pause. Two years dark." },
  { key: "Relaunch", value: "July 2022 — Naga Club, Steintorwall 4, Hamburg" },
  {
    key: "Reeperbahn",
    value:
      "NoLay (London) · Big Twins (Queensbridge, NYC) · Kitty Kat (Berlin) · Dalila · Kama & OTW · Kero City · Ivo Divo · King Kolera · Sudi · Chilombiano · Nerima Groove · PetiFree · Klikk99 · Mandrill",
  },
  {
    key: "Naga Club",
    value: "Rowdy Rebel (Brooklyn) · Skolim · Sobato (Poland) · Warrior Rapper School (Lima)",
  },
  {
    key: "Nearly",
    value: "Devin the Dude (Houston, Rap-A-Lot) — booked, cancelled. Passport issues.",
  },
  { key: "Sponsors", value: "Dithmarscher Beer (Hamburg) · Red Bull" },
  { key: "Total run", value: "2016 — 2024 · 7+ years · monthly · 2 venues" },
] as const;

const HEADLINERS = [
  { name: "NOLAY", origin: "UK Grime · London" },
  { name: "BIG TWINS", origin: "Queensbridge NYC" },
  { name: "ROWDY REBEL", origin: "Brooklyn NY" },
] as const;

const REGULARS = [
  { name: "KITTY KAT", origin: "Berlin" },
  { name: "DALILA", origin: "Hamburg" },
  { name: "KAMA & OTW", origin: "Hamburg" },
  { name: "KERO CITY", origin: "STLZHD" },
  { name: "IVO DIVO", origin: "Hamburg" },
  { name: "KING KOLERA", origin: "Hamburg" },
  { name: "SUDI", origin: "Hamburg" },
  { name: "CHILOMBIANO", origin: "Hamburg" },
  { name: "NERIMA GROOVE", origin: "Hamburg" },
  { name: "SKOLIM", origin: "Poland" },
  { name: "SOBATO", origin: "Poland" },
  { name: "WARRIOR RAPPER SCHOOL", origin: "Lima Peru" },
  { name: "PETIFREE", origin: "Hamburg" },
  { name: "KLIKK99", origin: "Hamburg" },
  { name: "MANDRILL", origin: "Hamburg" },
] as const;

const CANCELLED = [
  { name: "DEVIN THE DUDE", origin: "Houston TX — cancelled" },
] as const;

const TOUR_STOPS = [
  {
    title: "UK Tour",
    detail: "Rowdy Rebel · 2023",
    note: "United Kingdom leg of the European run",
  },
  {
    title: "Hamburg",
    detail: "Germany headline · Stw. 4",
    note: "Rowdy Rebel Germany date · 350+ in the room",
  },
  {
    title: "PL + DE",
    detail: "Skolim · Sobato · 2023",
    note: "Polish crossover nights — Hamburg bridge",
  },
] as const;

const SPONSORS = ["Dithmarscher Beer", "Red Bull"] as const;

const SECTION_LINKS = [
  { href: "#naga-club", label: "Start" },
  { href: "#naga-club-stats", label: "Stats" },
  { href: "#naga-club-story", label: "Story" },
  { href: "#naga-club-artists", label: "Artists" },
  { href: "#naga-club-tours", label: "Tours" },
  { href: "#naga-club-photos", label: "Photos" },
  { href: "#naga-club-partners", label: "Partners" },
  { href: "#naga-club-close", label: "Close" },
] as const;

function ArtistChip({
  name,
  origin,
  tone,
}: {
  name: string;
  origin: string;
  tone: "headliner" | "regular" | "cancelled";
}) {
  return (
    <li className={`naga-club-chip naga-club-chip--${tone}`}>
      <span className="naga-club-chip-name">{name}</span>
      <span className="naga-club-chip-origin">{origin}</span>
    </li>
  );
}

export default function NagaClubHamburgSection() {
  return (
    <div
      id="naga-club"
      className={`naga-club-legacy ${bebas.variable} ${spaceMono.variable}`}
    >
      {/* 1 — Hero */}
      <section
        id="naga-club-start"
        className="naga-club-hero scroll-layer naga-club-anchor"
        aria-labelledby="naga-club-heading"
        data-cursor-section
        data-cursor-index="05"
        data-cursor-label="Naga Club Hamburg"
      >
        <div className="naga-club-hero-media">
          <Image
            src={HERO_IMAGE}
            alt="Naga Club Hamburg night — crowd and stage at Steintorwall 4"
            fill
            unoptimized
            priority={false}
            className="object-cover object-[center_30%] sm:object-center"
            sizes="100vw"
          />
          <div className="naga-club-hero-fade" aria-hidden="true" />
        </div>
        <div className="naga-club-hero-copy">
          <SectionChapterLabel
            index="05"
            title="Legacy"
            tone="dark"
            className="mb-4"
          />
          <p className="naga-club-label naga-club-label--hero">
            <span>NAGA CLUB HAMBURG</span>
            <span className="naga-club-label-sep" aria-hidden="true">
              ·
            </span>
            <span>STEINTORWALL 4</span>
            <span className="naga-club-label-sep" aria-hidden="true">
              ·
            </span>
            <span>2022 — 2024</span>
          </p>
          <h2 id="naga-club-heading" className="naga-club-headline">
            <span className="naga-club-headline-white">Where it</span>
            <br />
            <span className="naga-club-headline-gold">started.</span>
          </h2>
        </div>
      </section>

      {/* Jump tags */}
      <nav className="naga-club-index scroll-layer" aria-label="Naga Club Hamburg sections">
        <div className="naga-club-wrap">
          <p className="naga-club-label">Jump to</p>
          <ul className="naga-club-index-list">
            {SECTION_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="naga-club-index-tag">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* 2 — Stats */}
      <section
        id="naga-club-stats"
        className="naga-club-stats scroll-layer naga-club-anchor"
        aria-labelledby="naga-club-stats-heading"
      >
        <div className="naga-club-wrap">
          <h3 id="naga-club-stats-heading" className="sr-only">
            Naga Club Hamburg stats
          </h3>
          <InViewMotion stagger className="naga-club-stats-grid">
            {STATS.map((stat) => (
              <div key={stat.label} data-motion-stagger className="naga-club-stat">
                <p className="naga-club-stat-value">{stat.value}</p>
                <p className="naga-club-stat-label">{stat.label}</p>
              </div>
            ))}
          </InViewMotion>
        </div>
      </section>

      {/* 3 — Body + meta */}
      <section
        id="naga-club-story"
        className="naga-club-story scroll-layer naga-club-anchor"
        aria-labelledby="naga-club-story-heading"
      >
        <div className="naga-club-wrap">
          <InViewMotion reveal className="naga-club-story-grid">
            <div data-motion-reveal>
              <p className="naga-club-label">Story</p>
              <h3 id="naga-club-story-heading" className="naga-club-artist-heading mt-2">
                The run
              </h3>
              <p className="naga-club-body">
                Naga Jam started on the Reeperbahn in 2016. Monthly. NoLay — Queen of UK Grime —
                flew in from London, twice. Big Twins came from Queensbridge, New York. Dithmarscher
                Beer poured. Red Bull backed it. Four years of monthly shows before COVID shut it all
                down.
              </p>
              <p className="naga-club-body naga-club-body--follow">
                We came back in 2022 at Steintorwall 4. Booked Rowdy Rebel on his UK and Germany run.
                Flew in Skolim and Sobato from Poland. Had Devin the Dude on the calendar. His
                passport said no. The attempt tells you the level.
              </p>
            </div>
            <dl data-motion-reveal className="naga-club-meta" id="naga-club-meta">
              {META_ROWS.map((row) => (
                <div key={row.key} className="naga-club-meta-row">
                  <dt>{row.key}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
            </dl>
          </InViewMotion>
        </div>
      </section>

      {/* 4 — Artists (static sections, no marquee) */}
      <section
        id="naga-club-artists"
        className="naga-club-artists scroll-layer naga-club-anchor"
        aria-labelledby="naga-club-artists-heading"
      >
        <div className="naga-club-wrap">
          <InViewMotion reveal>
            <p data-motion-reveal className="naga-club-label" id="naga-club-artists-heading">
              ARTISTS ON STAGE
            </p>
            <ul data-motion-reveal className="naga-club-subnav" aria-label="Artist groups">
              <li>
                <a href="#naga-club-headliners" className="naga-club-index-tag">
                  Headliners
                </a>
              </li>
              <li>
                <a href="#naga-club-regulars" className="naga-club-index-tag">
                  Regulars
                </a>
              </li>
              <li>
                <a href="#naga-club-cancelled" className="naga-club-index-tag">
                  Cancelled
                </a>
              </li>
            </ul>
          </InViewMotion>

          <InViewMotion
            reveal
            className="naga-club-artist-block naga-club-anchor"
          >
            <div id="naga-club-headliners">
              <h3 data-motion-reveal className="naga-club-artist-heading">
                Headliners
              </h3>
              <ul data-motion-reveal className="naga-club-chip-grid">
                {HEADLINERS.map((artist) => (
                  <ArtistChip key={artist.name} {...artist} tone="headliner" />
                ))}
              </ul>
            </div>
          </InViewMotion>

          <InViewMotion
            reveal
            className="naga-club-artist-block naga-club-anchor"
          >
            <div id="naga-club-regulars">
              <h3 data-motion-reveal className="naga-club-artist-heading">
                Regulars
              </h3>
              <ul data-motion-reveal className="naga-club-chip-grid">
                {REGULARS.map((artist) => (
                  <ArtistChip key={artist.name} {...artist} tone="regular" />
                ))}
              </ul>
            </div>
          </InViewMotion>

          <InViewMotion
            reveal
            className="naga-club-artist-block naga-club-anchor"
          >
            <div id="naga-club-cancelled">
              <h3 data-motion-reveal className="naga-club-artist-heading">
                Booked · cancelled
              </h3>
              <ul data-motion-reveal className="naga-club-chip-grid">
                {CANCELLED.map((artist) => (
                  <ArtistChip key={artist.name} {...artist} tone="cancelled" />
                ))}
              </ul>
            </div>
          </InViewMotion>
        </div>
      </section>

      {/* 5 — Tour stops */}
      <section
        id="naga-club-tours"
        className="naga-club-tours scroll-layer naga-club-anchor"
        aria-labelledby="naga-club-tours-heading"
      >
        <div className="naga-club-wrap">
          <InViewMotion reveal>
            <p data-motion-reveal className="naga-club-label" id="naga-club-tours-heading">
              TOUR STOPS
            </p>
          </InViewMotion>
          <InViewMotion stagger className="naga-club-tours-grid">
            {TOUR_STOPS.map((stop) => (
              <article key={stop.title} data-motion-stagger className="naga-club-tour">
                <p className="naga-club-tour-title">{stop.title}</p>
                <p className="naga-club-tour-detail">{stop.detail}</p>
                <p className="naga-club-tour-note">{stop.note}</p>
              </article>
            ))}
          </InViewMotion>
        </div>
      </section>

      {/* 6 — Photo grid */}
      <section
        id="naga-club-photos"
        className="naga-club-photos scroll-layer naga-club-anchor"
        aria-labelledby="naga-club-photos-heading"
      >
        <div className="naga-club-wrap naga-club-photos-head">
          <h3 id="naga-club-photos-heading" className="naga-club-label">
            Archive photos
          </h3>
        </div>
        <div className="naga-club-photo-grid">
          {PHOTO_GRID.map((photo) => (
            <figure
              key={photo.src}
              className={`naga-club-photo naga-club-photo--${photo.slot}`}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                unoptimized
                className="object-cover"
                sizes={
                  photo.slot === "main"
                    ? "(max-width: 768px) 100vw, 55vw"
                    : "(max-width: 768px) 50vw, 25vw"
                }
              />
            </figure>
          ))}
        </div>
      </section>

      {/* 7 — Sponsors */}
      <section
        id="naga-club-partners"
        className="naga-club-sponsors scroll-layer naga-club-anchor"
        aria-labelledby="naga-club-sponsors-heading"
      >
        <div className="naga-club-wrap naga-club-sponsors-row">
          <p className="naga-club-label" id="naga-club-sponsors-heading">
            PARTNERS
          </p>
          <ul className="naga-club-sponsor-chips">
            {SPONSORS.map((sponsor) => (
              <li key={sponsor} className="naga-club-sponsor-chip">
                {sponsor}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 8 — Closing */}
      <section
        id="naga-club-close"
        className="naga-club-close scroll-layer naga-club-anchor"
        aria-labelledby="naga-club-close-heading"
      >
        <div className="naga-club-wrap naga-club-close-row">
          <p className="naga-club-close-line" id="naga-club-close-heading">
            The cobra was always the mark. Now it&apos;s the collection.
          </p>
          <p className="naga-club-close-meta">
            Hamburg · Steintorwall 4
            <br />
            2016 — 2024 · 2 venues · 7+ years
          </p>
        </div>
      </section>
    </div>
  );
}
