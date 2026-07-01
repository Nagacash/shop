"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  HERO_BACKGROUND_VIDEO,
  type HeroBackgroundClip,
} from "@/lib/brand/marketing-images";

type NetworkInformation = {
  saveData?: boolean;
  addEventListener?(type: "change", listener: () => void): void;
  removeEventListener?(type: "change", listener: () => void): void;
};

function HeroVideoPanel({
  clip,
  poster,
  hiddenOnMobile,
}: {
  clip: HeroBackgroundClip;
  poster: string;
  hiddenOnMobile?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={[
        "relative h-full overflow-hidden",
        hiddenOnMobile ? "hidden md:block" : "",
        clip.offsetClass ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {!failed && (
        <video
          className="hero-video-panel absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: clip.objectPosition }}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={poster}
          onError={() => setFailed(true)}
        >
          {clip.webm && <source src={clip.webm} type="video/webm" />}
          <source src={clip.mp4} type="video/mp4" />
        </video>
      )}
      <div
        className="hero-panel-tint pointer-events-none absolute inset-0"
        aria-hidden="true"
      />
    </div>
  );
}

export default function HeroBackgroundMedia() {
  const [litePlayback, setLitePlayback] = useState(false);

  useEffect(() => {
    const connection = (navigator as Navigator & { connection?: NetworkInformation })
      .connection;

    const syncLiteMode = () => {
      setLitePlayback(Boolean(connection?.saveData));
    };

    syncLiteMode();
    connection?.addEventListener?.("change", syncLiteMode);
    return () => connection?.removeEventListener?.("change", syncLiteMode);
  }, []);

  const { poster, clips } = HERO_BACKGROUND_VIDEO;

  return (
    <div className="absolute inset-0" aria-hidden="true">
      <Image
        src={poster}
        alt=""
        fill
        priority
        unoptimized
        className="object-cover object-center"
        sizes="100vw"
      />

      {!litePlayback && (
        <div className="hero-mosaic absolute inset-0 grid-cols-1 gap-px bg-dark-900/90 md:grid-cols-[1.1fr_0.95fr_1.05fr]">
          {clips.map((clip, index) => (
            <HeroVideoPanel
              key={clip.mp4}
              clip={clip}
              poster={poster}
              hiddenOnMobile={index < clips.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
