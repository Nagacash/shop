"use client";

import { Download, ExternalLink } from "lucide-react";
import type { NagaPluginDownloads } from "@/lib/audio/plugins";
import { trackPluginDownload } from "@/lib/audio/analytics";

type Props = {
  pluginSlug: string;
  pluginName: string;
  free: boolean;
  downloads: NagaPluginDownloads;
  purchaseUrl: string | null;
  priceLabel?: string;
};

const DOWNLOAD_LABELS: { key: keyof NagaPluginDownloads; label: string; format: string }[] = [
  { key: "macVst3Au", label: "macOS — VST3 + AU (ZIP)", format: "mac-vst3-au" },
  { key: "winVst3", label: "Windows — VST3", format: "win-vst3" },
  { key: "standalone", label: "Standalone app", format: "standalone" },
];

function DownloadLink({
  href,
  label,
  pluginSlug,
  format,
  free,
}: {
  href: string;
  label: string;
  pluginSlug: string;
  format: string;
  free: boolean;
}) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : { download: true })}
      className="naga-btn naga-btn-dark flex w-full items-center justify-center gap-2 focus-ring focus-visible:outline-none"
      onClick={() => trackPluginDownload({ pluginSlug, format, free })}
    >
      <Download className="h-4 w-4" aria-hidden />
      {label}
    </a>
  );
}

export default function PluginDownloadActions({
  pluginSlug,
  pluginName,
  free,
  downloads,
  purchaseUrl,
  priceLabel,
}: Props) {
  const readyLinks = DOWNLOAD_LABELS.filter(({ key }) => Boolean(downloads[key]));

  if (free) {
    return (
      <div className="space-y-3">
        <p className="text-caption uppercase tracking-[0.14em] text-dark-700">Free download</p>
        {readyLinks.length > 0 ? (
          readyLinks.map(({ key, label, format }) => (
            <DownloadLink
              key={key}
              href={downloads[key]!}
              label={label}
              pluginSlug={pluginSlug}
              format={format}
              free
            />
          ))
        ) : (
          <p className="rounded-lg border border-light-300 bg-light-200/80 px-4 py-3 text-body text-dark-700">
            Download links are being wired up. Check back soon — or set the{" "}
            <code className="text-caption">NEXT_PUBLIC_NAGA_GLUE_V2_*</code> URLs in your env.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-caption uppercase tracking-[0.14em] text-dark-700">Get {pluginName}</p>
      {purchaseUrl ? (
        <a
          href={purchaseUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="naga-btn naga-btn-dark inline-flex w-full items-center justify-center gap-2 focus-ring focus-visible:outline-none"
          onClick={() => trackPluginDownload({ pluginSlug, format: "purchase", free: false })}
        >
          Buy — {priceLabel}
          <ExternalLink className="h-4 w-4" aria-hidden />
        </a>
      ) : (
        <p className="rounded-lg border border-light-300 bg-light-200/80 px-4 py-3 text-body text-dark-700">
          Set <code className="text-caption">NEXT_PUBLIC_NAGA_GLUE_V1_PURCHASE_URL</code> to your checkout or
          Stripe Payment Link.
        </p>
      )}
      {readyLinks.length > 0 && (
        <div className="space-y-2 border-t border-light-300 pt-4">
          <p className="text-caption text-dark-700">Licensed download (after purchase)</p>
          {readyLinks.map(({ key, label, format }) => (
            <DownloadLink
              key={key}
              href={downloads[key]!}
              label={label}
              pluginSlug={pluginSlug}
              format={format}
              free={false}
            />
          ))}
        </div>
      )}
    </div>
  );
}