import { FLOW_PLAYER_HELP_URL, PRODUCER_PACK_PATCHES } from "@/lib/digital/pack";

export default function DigitalPackNotice({ fileReady }: { fileReady: boolean }) {
  return (
    <div className="rounded-xl border border-light-300 bg-light-100 p-4 text-body text-dark-700">
      <p className="text-body-medium text-dark-900">€20 digital pack</p>
      <p className="mt-2">
        The €20 is for the NAGA .fmx patches and the royalty-free drum-kit one-shots:{" "}
        {PRODUCER_PACK_PATCHES.join(", ")}. The patches were made in Google Flow Music.
        The zip includes the installation guide. Google&apos;s Flow Instrument / Flow Effect
        installer is not included.
      </p>
      <p className="mt-2">
        Install that player yourself from Google Flow Music (Use in DAW → Download plugin):{" "}
        <a
          href={FLOW_PLAYER_HELP_URL}
          className="underline"
          target="_blank"
          rel="noreferrer"
        >
          {FLOW_PLAYER_HELP_URL}
        </a>
        . Then drag each .fmx onto Flow Instrument or Flow Effect.
      </p>
      {!fileReady && (
        <p className="mt-3 text-body-medium text-dark-900">
          The zip is not on the server yet, so this pack cannot be purchased.
        </p>
      )}
    </div>
  );
}
