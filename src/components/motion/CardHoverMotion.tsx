"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "@/lib/animations/motion";

gsap.registerPlugin(useGSAP);

type CardHoverMotionProps = {
  children: ReactNode;
  className?: string;
};

/** Subtle lift + gold glow on product card hover. */
export default function CardHoverMotion({ children, className = "" }: CardHoverMotionProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    (context, contextSafe) => {
      const root = scope.current;
      if (!root || prefersReducedMotion()) return;

      const onEnter = contextSafe
        ? contextSafe(() => {
            gsap.to(root, {
              y: -6,
              scale: 1.015,
              duration: 0.45,
              ease: "power2.out",
            });
          })
        : () => {
            gsap.to(root, {
              y: -6,
              scale: 1.015,
              duration: 0.45,
              ease: "power2.out",
            });
          };

      const onLeave = contextSafe
        ? contextSafe(() => {
            gsap.to(root, {
              y: 0,
              scale: 1,
              duration: 0.5,
              ease: "power2.out",
            });
          })
        : () => {
            gsap.to(root, {
              y: 0,
              scale: 1,
              duration: 0.5,
              ease: "power2.out",
            });
          };

      root.addEventListener("mouseenter", onEnter);
      root.addEventListener("mouseleave", onLeave);

      return () => {
        root.removeEventListener("mouseenter", onEnter);
        root.removeEventListener("mouseleave", onLeave);
      };
    },
    { scope },
  );

  return (
    <div ref={scope} className={className}>
      {children}
    </div>
  );
}
