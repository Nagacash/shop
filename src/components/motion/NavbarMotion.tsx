"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { NAGA_EASE, prefersReducedMotion } from "@/lib/animations/motion";

gsap.registerPlugin(useGSAP);

type NavbarMotionProps = {
  children: ReactNode;
};

export default function NavbarMotion({ children }: NavbarMotionProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      gsap.from("[data-nav-shell]", {
        y: -28,
        opacity: 0,
        duration: 0.95,
        ease: NAGA_EASE,
        delay: 0.08,
      });

      gsap.from("[data-nav-link-item]", {
        y: -10,
        opacity: 0,
        duration: 0.55,
        stagger: 0.04,
        ease: NAGA_EASE,
        delay: 0.22,
      });
    },
    { scope },
  );

  return (
    <div ref={scope} className="contents">
      {children}
    </div>
  );
}
