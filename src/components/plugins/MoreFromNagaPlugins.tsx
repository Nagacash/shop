import Link from "next/link";
import PluginCard from "@/components/plugins/PluginCard";
import type { NagaPlugin } from "@/lib/audio/plugins";

type Props = {
  others: readonly NagaPlugin[];
};

export default function MoreFromNagaPlugins({ others }: Props) {
  if (!others.length) return null;

  return (
    <section className="border-t border-light-300 pt-12" aria-labelledby="more-naga-plugins">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-caption uppercase tracking-[0.18em] text-[--color-naga-gold]">Naga Audio DSP</p>
          <h2 id="more-naga-plugins" className="naga-display mt-2 text-heading-3 font-bold tracking-tighter text-dark-900">
            More from Naga
          </h2>
        </div>
        <Link href="/plugins" className="text-body-medium text-dark-900 underline focus-ring focus-visible:outline-none">
          All plugins
        </Link>
      </div>
      <ul className="mt-8 grid gap-6 sm:grid-cols-2">
        {others.map((plugin) => (
          <li key={plugin.slug}>
            <PluginCard plugin={plugin} />
          </li>
        ))}
      </ul>
    </section>
  );
}