"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  BRAND_CLIPS,
  type BrandClipId,
} from "@/lib/brand/marketing-images";

type NetworkInformation = {
  saveData?: boolean;
  addEventListener?(type: "change", listener: () => void): void;
  removeEventListener?(type: "change", listener: () => void): void;
};

export type BrandVideoTone = "light" | "dark";

type BrandVideoBackdropProps = {
  clipId: BrandClipId;
  tone?: BrandVideoTone;
  /** Gradually reveal video from the top (for sections below a light hero) */
  revealTop?: boolean;
  poster?: string;
  className?: string;
};

export default function BrandVideoBackdrop({
  clipId,
  tone = "dark",
  revealTop = false,
  poster,
  className = "",
}: BrandVideoBackdropProps) {
  const [litePlayback, setLitePlayback] = useState(false);
  const [failed, setFailed] = useState(false);

  const clip = BRAND_CLIPS[clipId];
  const resolvedPoster = poster ?? clip.poster;

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

  const wrapperClass = [
    "pointer-events-none absolute inset-0 bg-dark-900",
    revealTop ? "brand-video-backdrop--reveal-top" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const overlayClass =
    tone === "light"
      ? "brand-video-overlay brand-video-overlay--light"
      : revealTop
        ? "brand-video-overlay brand-video-overlay--reveal-top"
        : "brand-video-overlay brand-video-overlay--dark";

  const mediaClass = revealTop ? "brand-video-media brand-video-media--reveal-top" : "brand-video-media";

  return (
    <div className={wrapperClass} aria-hidden="true">
      <Image
        src={resolvedPoster}
        alt=""
        fill
        unoptimized
        className={`${mediaClass} object-cover object-center`}
        sizes="100vw"
      />

      {!litePlayback && !failed && (
        <video
          className={`${mediaClass} absolute inset-0 h-full w-full object-cover`}
          style={{ objectPosition: clip.objectPosition ?? "center" }}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={resolvedPoster}
          onError={() => setFailed(true)}
        >
          {clip.webm && <source src={clip.webm} type="video/webm" />}
          <source src={clip.mp4} type="video/mp4" />
        </video>
      )}

      <div className={overlayClass} />
    </div>
  );
}
