"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { HERO_BACKGROUND_VIDEO } from "@/lib/brand/marketing-images";

export default function HeroBackgroundMedia() {
  const [reduceMotion, setReduceMotion] = useState(true);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const poster = HERO_BACKGROUND_VIDEO.poster;

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

      {!reduceMotion && (
        <video
          className="absolute inset-0 h-full w-full object-cover object-center"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={poster}
        >
          <source src={HERO_BACKGROUND_VIDEO.webm} type="video/webm" />
          <source src={HERO_BACKGROUND_VIDEO.mp4} type="video/mp4" />
        </video>
      )}
    </div>
  );
}
