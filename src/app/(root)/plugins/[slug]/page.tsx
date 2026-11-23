import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import CollapsibleSection from "@/components/CollapsibleSection";
import JsonLd from "@/components/JsonLd";
import PluginScreenshotGallery from "@/components/plugins/PluginScreenshotGallery";
import PluginDownloadActions from "@/components/plugins/PluginDownloadActions";
import MoreFromNagaPlugins from "@/components/plugins/MoreFromNagaPlugins";
import { formatPrice } from "@/lib/utils/currency";
import { getNagaPlugin, getOtherNagaPlugins, NAGA_PLUGINS } from "@/lib/audio/plugins";
import { resolvePluginDownloads, resolvePluginPurchaseUrl } from "@/lib/audio/downloads";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd, softwareApplicationJsonLd } from "@/lib/seo/jsonld";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return NAGA_PLUGINS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const plugin = getNagaPlugin(slug);
  if (!plugin) {
    return buildPageMetadata({ title: "Plugin not found", path: `/plugins/${slug}`, noIndex: true });
  }
  return buildPageMetadata({
    title: plugin.name,
    description: [plugin.tagline, ...plugin.shortDescription].join(" "),
    path: `/plugins/${plugin.slug}`,
    image: plugin.ogImage,
  });
}

export default async function PluginDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const plugin = getNagaPlugin(slug);
  if (!plugin) notFound();

  const downloads = resolvePluginDownloads(plugin);
  const purchaseUrl = resolvePluginPurchaseUrl(plugin);
  const isFree = plugin.pricing.kind === "free";
  const priceSchema = isFree ? 0 : plugin.pricing.priceEur;
  const priceLabel =
    plugin.pricing.kind === "paid" ? formatPrice(plugin.pricing.priceEur) : "Free";

  const descriptionPlain = plugin.shortDescription.join(" ");

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Plugins", path: "/plugins" },
            { name: plugin.name, path: `/plugins/${plugin.slug}` },
          ]),
          softwareApplicationJsonLd({
            name: plugin.name,
            description: descriptionPlain,
            path: `/plugins/${plugin.slug}`,
            image: plugin.ogImage,
            version: plugin.version,
            price: priceSchema,
            operatingSystem: "macOS, Windows",
            author: plugin.maker,
          }),
        ]}
      />

      <PageHero
        imageSrc={plugin.ogImage}
        imageFit="contain"
        eyebrow={plugin.maker}
        title={plugin.name}
        subtitle={plugin.tagline}
        size="slim"
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <nav className="text-caption text-dark-700">
          <Link href="/" className="hover:underline">
            Home
          </Link>{" "}
          /{" "}
          <Link href="/plugins" className="hover:underline">
            Plugins
          </Link>{" "}
          / <span className="text-dark-900">{plugin.name}</span>
        </nav>

        <section className="mt-10 grid grid-cols-1 items-start gap-10 lg:grid-cols-[1fr_400px]">
          <div className="space-y-10">
            <PluginScreenshotGallery screenshots={plugin.screenshots} productName={plugin.name} />

            <div className="space-y-4">
              {plugin.shortDescription.map((para) => (
                <p key={para.slice(0, 32)} className="text-body leading-relaxed text-dark-700">
                  {para}
                </p>
              ))}
            </div>

            <div>
              <h2 className="naga-display text-heading-3 font-bold tracking-tighter text-dark-900">Features</h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-body text-dark-700">
                {plugin.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="naga-display text-heading-3 font-bold tracking-tighter text-dark-900">Controls</h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {plugin.controls.map((c) => (
                  <li
                    key={c}
                    className="rounded-full border border-light-300 bg-light-200/80 px-3 py-1 text-caption text-dark-900"
                  >
                    {c}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="naga-display text-heading-3 font-bold tracking-tighter text-dark-900">Interface</h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-body text-dark-700">
                {plugin.uiFeatures.map((u) => (
                  <li key={u}>{u}</li>
                ))}
              </ul>
            </div>
          </div>

          <aside className="flex flex-col gap-6 lg:sticky lg:top-6">
            <div className="rounded-2xl border border-light-300 bg-light-100 p-6">
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-lead text-dark-900">{priceLabel}</p>
                {isFree && (
                  <span className="rounded-full border border-[--color-naga-sage]/40 bg-[--color-naga-sage]/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[--color-naga-sage-light]">
                    Free
                  </span>
                )}
              </div>
              <p className="mt-2 text-caption text-dark-700">
                v{plugin.version} · {plugin.formats.join(" · ")}
              </p>

              <div className="mt-6">
                <PluginDownloadActions
                  pluginSlug={plugin.slug}
                  pluginName={plugin.name}
                  free={isFree}
                  downloads={downloads}
                  purchaseUrl={purchaseUrl}
                  priceLabel={priceLabel}
                />
              </div>
            </div>
          </aside>
        </section>

        <div className="mt-12 space-y-2 border-t border-light-300 pt-8">
          <CollapsibleSection title="System requirements" defaultOpen>
            <ul className="list-disc space-y-2 pl-5 text-body text-dark-700">
              {plugin.systemRequirements.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </CollapsibleSection>

          <CollapsibleSection title="Installation">
            <ul className="list-disc space-y-2 pl-5 text-body text-dark-700">
              {plugin.installNotes.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </CollapsibleSection>
        </div>

        <MoreFromNagaPlugins others={getOtherNagaPlugins(plugin.slug)} />
      </main>
    </>
  );
}