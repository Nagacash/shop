import Link from "next/link";
import PageHero from "@/components/PageHero";
import PluginCard from "@/components/plugins/PluginCard";
import JsonLd from "@/components/JsonLd";
import { NAGA_PLUGINS } from "@/lib/audio/plugins";
import { MARKETING_IMAGES } from "@/lib/brand/marketing-images";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";

export const revalidate = 120;

export const metadata = buildPageMetadata({
  title: "Naga Audio DSP Plugins",
  description:
    "Bus glue compressors from Naga Audio DSP — Vol. 1 for paid mix cohesion, Vol. 2 free with harmonic drive and wide mode. VST3, AU, and Standalone.",
  path: "/plugins",
  image: NAGA_PLUGINS[0]?.ogImage ?? MARKETING_IMAGES.productDust,
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
        imageSrc={NAGA_PLUGINS[0]?.ogImage ?? MARKETING_IMAGES.productDust}
        eyebrow="Naga Audio DSP"
        title="Plugins"
        subtitle="VCA bus glue built for urban mixes — one paid foundation, one free upgrade with drive and width."
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
          Standalone VST3/AU tools from the same DSP lineage as the Naga Producer Pack — built in Hamburg,
          tuned for weight and groove on real beats.
        </p>

        <ul className="mt-10 grid gap-6 sm:grid-cols-2">
          {NAGA_PLUGINS.map((plugin) => (
            <li key={plugin.slug}>
              <PluginCard plugin={plugin} />
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}