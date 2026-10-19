"use client";

import { stopSiteMusic } from "@/lib/ambient/control";
import { PRODUCER_PACK_PROMO_POSTER, PRODUCER_PACK_PROMO_SRC } from "@/lib/digital/pack";

export default function PackPromoVideo() {
  return (
    <figure className="order-3 w-full lg:order-none">
      <video
        className="aspect-video w-full rounded-2xl bg-[#070605] ring-1 ring-light-300"
        controls
        playsInline
        preload="metadata"
        poster={PRODUCER_PACK_PROMO_POSTER}
        onPlay={stopSiteMusic}
      >
        <source src={PRODUCER_PACK_PROMO_SRC} type="video/mp4" />
      </video>
      <figcaption className="mt-2 text-caption text-dark-700">
        The beat in this clip was made with these plugins.
      </figcaption>
    </figure>
  );
}
