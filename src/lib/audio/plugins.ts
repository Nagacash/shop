/**
 * Naga Audio DSP plugin catalog — add a third entry here when ready.
 */

export type PluginDownloadKey =
  | "macVst3Au"
  | "winVst3"
  | "standalone";

export type NagaPluginDownloads = Partial<Record<PluginDownloadKey, string>>;

export type NagaPluginPricing =
  | { kind: "free" }
  | { kind: "paid"; priceEur: number; purchaseEnvKey: string };

export type NagaPluginScreenshot = {
  src: string;
  alt: string;
};

export type NagaPlugin = {
  slug: string;
  name: string;
  tagline: string;
  version: string;
  maker: string;
  formats: readonly string[];
  pricing: NagaPluginPricing;
  /** Env keys for hosted binaries — resolved server-side; never commit .vst3/.component files. */
  downloadEnvKeys: Partial<Record<PluginDownloadKey, string>>;
  purchaseEnvKey?: string;
  ogImage: string;
  screenshots: readonly NagaPluginScreenshot[];
  shortDescription: readonly string[];
  features: readonly string[];
  controls: readonly string[];
  uiFeatures: readonly string[];
  systemRequirements: readonly string[];
  installNotes: readonly string[];
};

export const NAGA_PLUGINS: readonly NagaPlugin[] = [
  {
    slug: "naga-glue-vol-1",
    name: "Naga Glue Vol. 1",
    tagline: "VCA bus glue for tight, cohesive mixes",
    version: "1.0.0",
    maker: "Naga Audio DSP",
    formats: ["VST3", "AU (macOS)"],
    pricing: { kind: "paid", priceEur: 19, purchaseEnvKey: "NEXT_PUBLIC_NAGA_GLUE_V1_PURCHASE_URL" },
    purchaseEnvKey: "NEXT_PUBLIC_NAGA_GLUE_V1_PURCHASE_URL",
    ogImage: "/images/vst/naga-glue-vol1-ui.png",
    downloadEnvKeys: {
      macVst3Au: "NEXT_PUBLIC_NAGA_GLUE_V1_DOWNLOAD_MAC_VST3AU",
      winVst3: "NEXT_PUBLIC_NAGA_GLUE_V1_DOWNLOAD_WIN_VST3",
    },
    screenshots: [
      {
        src: "/images/vst/naga-glue-vol1-ui.png",
        alt: "Naga Glue Vol. 1 plugin interface on a dark studio background",
      },
      {
        src: "/images/vst/naga-glue-vol1-curve.png",
        alt: "Compression curve display in Naga Glue Vol. 1",
      },
    ],
    shortDescription: [
      "Lock your buses together without squashing the life out of them.",
      "Vol. 1 is the straight VCA glue: fast to set, musical on drums and vocals, and built for everyday mix duties.",
    ],
    features: [
      "Class-style VCA compression tuned for mix buses and instrument groups",
      "Clean makeup gain and mix knob for parallel glue without a second plugin",
      "Low CPU — leave instances on every bus",
    ],
    controls: [
      "Threshold",
      "Ratio",
      "Attack",
      "Release",
      "Mix",
      "Output",
      "Bypass",
      "10 factory presets",
    ],
    uiFeatures: ["Live compression curve", "VU gain-reduction meter"],
    systemRequirements: [
      "macOS 12+ (Apple Silicon or Intel) — VST3 and AU",
      "Windows 10/11 64-bit — VST3",
      "DAW with VST3/AU hosting (Ableton Live, Logic Pro, FL Studio, Reaper, etc.)",
    ],
    installNotes: [
      "macOS VST3: copy the .vst3 bundle to ~/Library/Audio/Plug-Ins/VST3/",
      "macOS AU: copy the .component to ~/Library/Audio/Plug-Ins/Components/",
      "Windows VST3: copy the .vst3 folder to C:\\Program Files\\Common Files\\VST3\\",
      "Rescan plugins in your DAW after installing.",
      "If macOS blocks the installer (“unidentified developer”), right-click the app or plugin → Open once to approve.",
    ],
  },
  {
    slug: "naga-glue-vol-2",
    name: "Naga Glue Vol. 2",
    tagline: "VCA bus compressor with harmonic drive and wide mode",
    version: "2.0.0",
    maker: "Naga Audio DSP",
    formats: ["VST3", "AU (macOS)", "Standalone app"],
    pricing: { kind: "free" },
    ogImage: "/images/vst/naga-glue-vol2-ui.png",
    downloadEnvKeys: {
      macVst3Au: "NEXT_PUBLIC_NAGA_GLUE_V2_DOWNLOAD_MAC_VST3AU",
      winVst3: "NEXT_PUBLIC_NAGA_GLUE_V2_DOWNLOAD_WIN_VST3",
      standalone: "NEXT_PUBLIC_NAGA_GLUE_V2_DOWNLOAD_STANDALONE",
    },
    screenshots: [
      {
        src: "/images/vst/naga-glue-vol2-ui.png",
        alt: "Naga Glue Vol. 2 plugin interface with VU meters and compression curve",
      },
      {
        src: "/images/vst/naga-glue-vol2-meters.png",
        alt: "LED output meters and gain reduction in Naga Glue Vol. 2",
      },
    ],
    shortDescription: [
      "Everything in Vol. 1, plus harmonic drive and a wide bus mode when you want glue that still breathes.",
      "Free download — same Naga DSP lineage, built for urban productions that need weight without mud.",
    ],
    features: [
      "VCA bus compression with optional harmonic drive for edge on drums and bass",
      "Sidechain high-pass filter keeps kick and sub from pumping the whole mix",
      "Wide mode for stereo buses — glue without collapsing your field",
      "20 factory presets covering gentle glue, drum smash, and vocal ride",
    ],
    controls: [
      "Threshold",
      "Ratio",
      "Attack",
      "Release",
      "Sidechain HPF",
      "Drive",
      "Mix",
      "Output",
      "Bypass",
      "20 factory presets",
    ],
    uiFeatures: [
      "Live compression curve",
      "VU gain-reduction meter",
      "LED output meters",
    ],
    systemRequirements: [
      "macOS 12+ (Apple Silicon or Intel) — VST3, AU, and Standalone",
      "Windows 10/11 64-bit — VST3 and Standalone",
      "DAW with VST3/AU hosting (Ableton Live, Logic Pro, FL Studio, Reaper, etc.)",
      "Standalone: audio interface recommended for low-latency monitoring",
    ],
    installNotes: [
      "macOS VST3: copy the .vst3 bundle to ~/Library/Audio/Plug-Ins/VST3/",
      "macOS AU: copy the .component to ~/Library/Audio/Plug-Ins/Components/",
      "Windows VST3: copy the .vst3 folder to C:\\Program Files\\Common Files\\VST3\\",
      "Standalone: drag the app to Applications (macOS) or run the installer (Windows).",
      "Rescan plugins in your DAW after installing.",
      "If macOS blocks the build (“unidentified developer”), right-click the plugin or app → Open once until the build is notarized.",
    ],
  },
] as const;

export function getNagaPlugin(slug: string): NagaPlugin | undefined {
  return NAGA_PLUGINS.find((p) => p.slug === slug);
}

export function getOtherNagaPlugins(slug: string): NagaPlugin[] {
  return NAGA_PLUGINS.filter((p) => p.slug !== slug);
}