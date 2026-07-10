"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { BRAND_CLIPS } from "@/lib/brand/marketing-images";

const HERO_CLIP = BRAND_CLIPS.goldDust;

type NetworkInformation = {
  saveData?: boolean;
  addEventListener?(type: "change", listener: () => void): void;
  removeEventListener?(type: "change", listener: () => void): void;
};

export default function HeroCinematicBackdrop() {
  const [litePlayback, setLitePlayback] = useState(false);
  const [failed, setFailed] = useState(false);

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

  return (
    <div className="hero-cinematic-media" aria-hidden="true">
      <Image
        src={HERO_CLIP.poster}
        alt=""
        fill
        priority
        unoptimized
        className="hero-cinematic-poster object-cover object-center"
        sizes="100vw"
      />

      {!litePlayback && !failed && (
        <video
          className="hero-cinematic-video absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: HERO_CLIP.objectPosition ?? "center" }}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={HERO_CLIP.poster}
          onError={() => setFailed(true)}
        >
          {HERO_CLIP.webm && <source src={HERO_CLIP.webm} type="video/webm" />}
          <source src={HERO_CLIP.mp4} type="video/mp4" />
        </video>
      )}

      <div className="hero-cinematic-vignette" />
      <div className="hero-cinematic-leak" />
    </div>
  );
}
