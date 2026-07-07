/** Shared GSAP easing + reduced-motion guard. */

export const NAGA_EASE = "power3.out";
export const NAGA_EASE_SNAP = "power4.out";

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function inViewScrollTrigger(
  trigger: Element | null | undefined,
  start = "top 82%",
) {
  return {
    trigger: trigger ?? undefined,
    start,
    toggleActions: "play none none none" as const,
    once: true,
  };
}
