"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  inViewScrollTrigger,
  NAGA_EASE,
  NAGA_EASE_SNAP,
  prefersReducedMotion,
} from "@/lib/animations/motion";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type PageHeroMotionProps = {
  children: ReactNode;
};

export default function PageHeroMotion({ children }: PageHeroMotionProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      if (prefersReducedMotion()) return;

      const trigger = inViewScrollTrigger(root, "top 92%");

      gsap.from("[data-page-hero-eyebrow]", {
        y: 20,
        opacity: 0,
        duration: 0.65,
        ease: NAGA_EASE,
        scrollTrigger: trigger,
      });

      gsap.from("[data-page-hero-title]", {
        y: 36,
        opacity: 0,
        duration: 0.85,
        ease: NAGA_EASE_SNAP,
        scrollTrigger: trigger,
        delay: 0.06,
      });

      gsap.from("[data-page-hero-sub]", {
        y: 24,
        opacity: 0,
        duration: 0.75,
        ease: NAGA_EASE,
        scrollTrigger: trigger,
        delay: 0.14,
      });
    },
    { scope },
  );

  return (
    <div ref={scope}>
      {children}
    </div>
  );
}
