import Link from "next/link";
import ProductImage from "@/components/ProductImage";
import { formatPrice } from "@/lib/utils/currency";
import type { NagaPlugin } from "@/lib/audio/plugins";

type Props = {
  plugin: NagaPlugin;
};

function pricingBadge(plugin: NagaPlugin): { label: string; tone: string } {
  if (plugin.pricing.kind === "free") {
    return {
      label: "FREE",
      tone: "border-[--color-naga-sage]/40 bg-[--color-naga-sage]/15 text-[--color-naga-sage-light]",
    };
  }
  if (plugin.pricing.kind !== "paid") {
    return { label: "FREE", tone: "border-[--color-naga-sage]/40 bg-[--color-naga-sage]/15 text-[--color-naga-sage-light]" };
  }
  const paid = plugin.pricing;
  return {
    label: formatPrice(paid.priceEur) ?? `€${paid.priceEur}`,
    tone: "border-[--color-naga-gold]/40 bg-[--color-naga-gold]/10 text-[--color-naga-gold]",
  };
}

export default function PluginCard({ plugin }: Props) {
  const badge = pricingBadge(plugin);
  const hero = plugin.screenshots[0]?.src ?? plugin.ogImage;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-light-300 bg-light-100 ring-1 ring-light-300 transition hover:border-dark-500/30">
      <Link
        href={`/plugins/${plugin.slug}`}
        className="group relative block aspect-[16/10] overflow-hidden bg-[#12100e] focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-dark-500]"
      >
        <ProductImage
          src={hero}
          alt={plugin.screenshots[0]?.alt ?? `${plugin.name} interface`}
          fill
          sizes="(min-width:1024px) 400px, 90vw"
          className="object-contain transition duration-300 group-hover:scale-[1.02]"
        />
        <span
          className={`absolute right-3 top-3 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${badge.tone}`}
        >
          {badge.label}
        </span>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <p className="text-caption uppercase tracking-[0.14em] text-dark-700">{plugin.maker}</p>
          <h2 className="naga-display mt-1 text-heading-3 font-bold tracking-tighter text-dark-900">
            <Link href={`/plugins/${plugin.slug}`} className="hover:underline focus-ring focus-visible:outline-none">
              {plugin.name}
            </Link>
          </h2>
          <p className="mt-1 text-body text-dark-700">{plugin.tagline}</p>
        </div>
        <p className="text-caption text-dark-700">
          v{plugin.version} · {plugin.formats.join(" · ")}
        </p>
        <div className="mt-auto pt-2">
          <Link
            href={`/plugins/${plugin.slug}`}
            className="naga-btn naga-btn-ghost w-full justify-center focus-ring focus-visible:outline-none"
          >
            {plugin.pricing.kind === "free" ? "Free download" : "View plugin"}
          </Link>
        </div>
      </div>
    </article>
  );
}