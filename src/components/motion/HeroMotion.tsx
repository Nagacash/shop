"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  NAGA_EASE,
  NAGA_EASE_SNAP,
  prefersReducedMotion,
} from "@/lib/animations/motion";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type HeroMotionProps = {
  children: ReactNode;
};

export default function HeroMotion({ children }: HeroMotionProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      if (prefersReducedMotion()) {
        gsap.set("[data-hero-word], [data-hero-stat], [data-hero-copy]", {
          opacity: 1,
          y: 0,
        });
        return;
      }

      const section = root.closest("section");
      const media = section?.querySelector(".hero-cinematic-media");

      const tl = gsap.timeline({ defaults: { ease: NAGA_EASE } });

      tl.from("[data-hero-word]", {
        y: 80,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: NAGA_EASE_SNAP,
      });

      tl.from(
        "[data-hero-copy]",
        {
          y: 24,
          opacity: 0,
          duration: 0.72,
        },
        "-=0.55",
      );

      tl.from(
        "[data-hero-stat]",
        {
          y: 20,
          opacity: 0,
          duration: 0.6,
          stagger: 0.08,
        },
        "-=0.45",
      );

      if (media && section) {
        gsap.to(media, {
          yPercent: 10,
          scale: 1.06,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
          },
        });
      }
    },
    { scope },
  );

  return (
    <div ref={scope} className="relative h-full w-full">
      {children}
    </div>
  );
}
