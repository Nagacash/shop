import Link from "next/link";
import PageHero from "@/components/PageHero";
import PluginCard from "@/components/plugins/PluginCard";
import JsonLd from "@/components/JsonLd";
import { NAGA_PLUGINS_PUBLISHED } from "@/lib/audio/plugins";
import { MARKETING_IMAGES } from "@/lib/brand/marketing-images";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 120;

export const metadata = buildPageMetadata({
  title: "Naga Audio DSP Plugins",
  description:
    "Naga Glue Vol. 2 — free VCA bus compressor with harmonic drive and wide mode. VST3, AU, and Standalone from Naga Audio DSP.",
  path: "/plugins",
  image: NAGA_PLUGINS_PUBLISHED[0]?.ogImage ?? MARKETING_IMAGES.productDust,
});

export default function PluginsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Plugins", path: "/plugins" },
        ])}
      />
      <PageHero
        imageSrc={
          NAGA_PLUGINS_PUBLISHED[0]?.screenshots[0]?.src ??
          NAGA_PLUGINS_PUBLISHED[0]?.ogImage ??
          MARKETING_IMAGES.productDust
        }
        imageFit="contain"
        eyebrow="Naga Audio DSP"
        title="Plugins"
        subtitle="Naga Glue Vol. 2 — free VCA bus compression with harmonic drive, sidechain HPF, and 20 factory presets."
        size="slim"
      />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <nav className="text-caption text-dark-700">
          <Link href="/" className="hover:underline">
            Home
          </Link>{" "}
          / <span className="text-dark-900">Plugins</span>
        </nav>

        <p className="mt-8 max-w-2xl text-body leading-relaxed text-dark-700">
          Standalone VST3/AU tools from Naga Audio DSP — same Hamburg lineage as the store, tuned for weight
          and groove on real beats.
        </p>

        <ul
          className={`mt-10 grid gap-6 ${NAGA_PLUGINS_PUBLISHED.length === 1 ? "mx-auto max-w-md" : "sm:grid-cols-2"}`}
        >
          {NAGA_PLUGINS_PUBLISHED.map((plugin) => (
            <li key={plugin.slug}>
              <PluginCard plugin={plugin} />
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}