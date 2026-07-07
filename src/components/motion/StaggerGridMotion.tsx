"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  inViewScrollTrigger,
  NAGA_EASE,
  prefersReducedMotion,
} from "@/lib/animations/motion";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type StaggerGridMotionProps = {
  children: ReactNode;
  className?: string;
  /** Re-run when grid content changes (filters, search). */
  refreshKey?: string;
};

export default function StaggerGridMotion({
  children,
  className = "",
  refreshKey = "",
}: StaggerGridMotionProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;

      // Animate grid cells — never translate .product-card (breaks row alignment).
      const items = root.querySelectorAll(":scope > *");
      if (!items.length) return;

      gsap.set(root.querySelectorAll(".product-card"), { clearProps: "transform,opacity" });

      if (prefersReducedMotion()) {
        gsap.set(items, { opacity: 1, scale: 1 });
        return;
      }

      gsap.from(items, {
        opacity: 0,
        scale: 0.98,
        duration: 0.76,
        stagger: 0.08,
        ease: NAGA_EASE,
        scrollTrigger: inViewScrollTrigger(root, "top 90%"),
        onComplete: () => {
          gsap.set(items, { clearProps: "transform,opacity" });
        },
      });
    },
    { scope, dependencies: [refreshKey], revertOnUpdate: true },
  );

  return (
    <div ref={scope} className={className}>
      {children}
    </div>
  );
}
