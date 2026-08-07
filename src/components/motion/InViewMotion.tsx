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

type InViewMotionProps = {
  children: ReactNode;
  className?: string;
  /** Split left/right column entrance */
  columns?: boolean;
  /** Stagger `[data-motion-stagger]` children */
  stagger?: boolean;
  /** Reveal `[data-motion-reveal]` block */
  reveal?: boolean;
};

export default function InViewMotion({
  children,
  className = "",
  columns = false,
  stagger = false,
  reveal = false,
}: InViewMotionProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      if (prefersReducedMotion()) return;

      const trigger = inViewScrollTrigger(root);

      if (columns) {
        gsap.from("[data-motion-left]", {
          x: -72,
          opacity: 0,
          duration: 1,
          ease: NAGA_EASE_SNAP,
          scrollTrigger: trigger,
          clearProps: "transform",
        });
        gsap.from("[data-motion-right]", {
          x: 72,
          opacity: 0,
          duration: 1,
          ease: NAGA_EASE_SNAP,
          scrollTrigger: trigger,
          clearProps: "transform",
        });
        gsap.from("[data-motion-stagger]", {
          y: 28,
          opacity: 0,
          duration: 0.65,
          stagger: 0.09,
          ease: NAGA_EASE,
          scrollTrigger: inViewScrollTrigger(root, "top 88%"),
          clearProps: "transform",
        });
      }

      if (stagger) {
        gsap.from("[data-motion-stagger]", {
          y: 48,
          opacity: 0,
          duration: 0.78,
          stagger: 0.1,
          ease: NAGA_EASE,
          scrollTrigger: trigger,
          // Leave no transform behind — breaks iframe hit-testing (YouTube embeds).
          clearProps: "transform",
        });
      }

      if (reveal) {
        gsap.from("[data-motion-reveal]", {
          y: 40,
          opacity: 0,
          duration: 0.88,
          ease: NAGA_EASE,
          scrollTrigger: trigger,
          clearProps: "transform",
        });
      }
    },
    { scope },
  );

  return (
    <div ref={scope} className={className}>
      {children}
    </div>
  );
}
