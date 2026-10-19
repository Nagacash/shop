import { FLOW_PLAYER_HELP_URL, PRODUCER_PACK_TAGLINE, PRODUCER_PACK_TOOLS } from "@/lib/digital/pack";

export default function DigitalPackNotice({ fileReady }: { fileReady: boolean }) {
  return (
    <div className="flex flex-col gap-8 text-body text-dark-700">
      <div className="flex flex-col gap-4">
        <p className="text-lead text-dark-900">{PRODUCER_PACK_TAGLINE}</p>
        <p>
          Built for real urban beatmakers chasing weight, groove, and character—not that flat,
          straight-out-of-the-DAW feel. From gritty drums and heavy 808s to warm dub textures and
          hard-clipped punch, this pack helps you give your beats a raw, full-bodied sound with
          attitude.
        </p>
        <p>
          Get five custom .fmx patches created in Google Flow Music, plus royalty-free drum-kit
          one-shots—all for €20.
        </p>
      </div>

      <section>
        <h2 className="text-body-medium text-dark-900">Meet the tools</h2>
        <dl className="mt-4 flex flex-col gap-4">
          {PRODUCER_PACK_TOOLS.map((tool) => (
            <div key={tool.name}>
              <dt className="text-body-medium text-dark-900">{tool.name}</dt>
              <dd className="mt-1">{tool.detail}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section>
        <h2 className="text-body-medium text-dark-900">What’s included</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5">
          <li>All five NAGA .fmx patches</li>
          <li>Royalty-free drum-kit one-shots</li>
          <li>Installation guide inside the ZIP</li>
        </ul>
      </section>

      <section>
        <h2 className="text-body-medium text-dark-900">Installation & requirements</h2>
        <p className="mt-3">
          The patches were created in Google Flow Music. They are not standalone VST/AU plugins:
          compatible .fmx files load inside Google’s Flow Instrument or Flow Effect host.
        </p>
        <p className="mt-3">
          Google’s host installer is not included. Download it directly from Google Flow Music via
          Use in DAW → Download plugin. Once installed, open the appropriate Flow host in your DAW
          and drag your .fmx file onto its window.
        </p>
        <p className="mt-3">
          <a href={FLOW_PLAYER_HELP_URL} className="underline" target="_blank" rel="noreferrer">
            View Google’s installation instructions
          </a>
        </p>
      </section>

      <section>
        <h2 className="text-body-medium text-dark-900">Compatibility notice</h2>
        <p className="mt-3">
          Google’s current plugin support is macOS only. Sample-based instruments are subject to
          export limitations. DAW compatibility for NPC2026 and the sample-loading features in NAGA
          808 has not been confirmed here—check the included installation guide and confirm support
          for your intended workflow before purchasing.
        </p>
      </section>

      {!fileReady && (
        <p className="text-body-medium text-dark-900">
          The zip is not on the server yet, so this pack cannot be purchased.
        </p>
      )}
    </div>
  );
}
