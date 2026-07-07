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
        gsap.set("[data-hero-item]", {
          opacity: 1,
          y: 0,
          clipPath: "inset(0% 0% 0% 0%)",
        });
        return;
      }

      const section = root.closest("section");
      const bg = section?.querySelector("[data-hero-bg]");

      const tl = gsap.timeline({ defaults: { ease: NAGA_EASE } });

      tl.from("[data-hero-panel]", {
        clipPath: "inset(100% 0% 0% 0%)",
        duration: 1.05,
        ease: NAGA_EASE_SNAP,
      });

      tl.from(
        "[data-hero-item]",
        {
          y: 44,
          opacity: 0,
          duration: 0.82,
          stagger: 0.085,
        },
        "-=0.58",
      );

      if (bg && section) {
        gsap.to(bg, {
          yPercent: 14,
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
    <div ref={scope} className="relative w-full">
      {children}
    </div>
  );
}
