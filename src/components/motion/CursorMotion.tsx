"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "@/lib/animations/motion";

type CursorMode = "default" | "link" | "acquire" | "lock" | "sector" | "click";

const LINK =
  'a, button, [role="button"], summary, [data-cursor="hover"], .cursor-pointer, .naga-nav-link';
const ACQUIRE =
  '.naga-btn-gold, [data-cursor="acquire"], button[type="submit"], .naga-nav-bag';
const LOCK =
  '[data-cursor="lock"], .naga-bezel-dark a, .naga-bezel-light a, a:has(img), a:has(video)';
const SECTOR = "[data-cursor-section]";

function isFinePointer(): boolean {
  return window.matchMedia("(pointer: fine)").matches && window.matchMedia("(hover: hover)").matches;
}

export default function CursorMotion() {
  const rootRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const crossRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const bloomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion() || !isFinePointer()) return;

    const root = rootRef.current;
    const ring = ringRef.current;
    const cross = crossRef.current;
    const dot = dotRef.current;
    const label = labelRef.current;
    const bloom = bloomRef.current;
    if (!root || !ring || !cross || !dot || !label || !bloom) return;

    document.documentElement.classList.add("naga-has-cursor");

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const target = { x: pos.x, y: pos.y };
    const scroll = { vy: 0, lastY: window.scrollY, lastT: performance.now() };

    let mode: CursorMode = "default";
    let baseRing = 1;
    let visible = false;
    let raf = 0;
    let sectionLabel = "";
    let stretched = false;
    let crossSpin: gsap.core.Tween | null = null;

    const setVisible = (on: boolean) => {
      if (visible === on) return;
      visible = on;
      gsap.to(root, {
        opacity: on ? 1 : 0,
        duration: 0.2,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    const setLabel = (text: string) => {
      if (sectionLabel === text) return;
      sectionLabel = text;
      label.textContent = text;
      gsap.to(label, {
        opacity: text ? 1 : 0,
        y: text ? 0 : 4,
        duration: 0.18,
        ease: "power3.out",
        overwrite: "auto",
      });
    };

    const setCross = (on: boolean, spin = false) => {
      gsap.to(cross, {
        opacity: on ? 1 : 0,
        scale: on ? 1 : 0.6,
        duration: 0.22,
        ease: "power3.out",
        overwrite: "auto",
      });
      crossSpin?.kill();
      if (on && spin) {
        crossSpin = gsap.to(cross, {
          rotation: "+=360",
          duration: 8,
          ease: "none",
          repeat: -1,
        });
      } else {
        gsap.set(cross, { rotation: 0 });
      }
    };

    const applyMode = (next: CursorMode) => {
      if (mode === next) return;
      mode = next;

      const presets: Record<
        CursorMode,
        {
          ring: number;
          dot: number;
          border: string;
          fill: string;
          mix: string;
          dashed: boolean;
          cross: boolean;
          spin: boolean;
        }
      > = {
        default: {
          ring: 1,
          dot: 1,
          border: "rgba(230, 25, 25, 0.9)",
          fill: "rgba(234, 234, 234, 0.95)",
          mix: "difference",
          dashed: false,
          cross: false,
          spin: false,
        },
        link: {
          ring: 1.55,
          dot: 0.55,
          border: "rgba(234, 234, 234, 0.85)",
          fill: "rgba(230, 25, 25, 1)",
          mix: "difference",
          dashed: false,
          cross: false,
          spin: false,
        },
        acquire: {
          ring: 1.85,
          dot: 0.4,
          border: "rgba(230, 25, 25, 1)",
          fill: "rgba(230, 25, 25, 1)",
          mix: "difference",
          dashed: false,
          cross: true,
          spin: false,
        },
        lock: {
          ring: 2.05,
          dot: 0.3,
          border: "rgba(234, 234, 234, 0.7)",
          fill: "rgba(230, 25, 25, 1)",
          mix: "difference",
          dashed: false,
          cross: true,
          spin: true,
        },
        sector: {
          ring: 1.4,
          dot: 0.7,
          border: "rgba(230, 25, 25, 0.75)",
          fill: "rgba(234, 234, 234, 0.9)",
          mix: "normal",
          dashed: true,
          cross: false,
          spin: false,
        },
        click: {
          ring: 0.75,
          dot: 1.35,
          border: "rgba(255, 42, 42, 1)",
          fill: "rgba(230, 25, 25, 1)",
          mix: "difference",
          dashed: false,
          cross: false,
          spin: false,
        },
      };

      const p = presets[next];
      baseRing = p.ring;
      ring.style.borderStyle = p.dashed ? "dashed" : "solid";
      setCross(p.cross, p.spin);

      gsap.to(ring, {
        scaleX: p.ring,
        scaleY: p.ring,
        skewX: 0,
        borderColor: p.border,
        duration: 0.28,
        ease: "power3.out",
        overwrite: "auto",
      });
      gsap.to(dot, {
        scaleX: p.dot,
        scaleY: p.dot,
        backgroundColor: p.fill,
        duration: 0.22,
        ease: "power3.out",
        overwrite: "auto",
      });
      root.style.mixBlendMode = p.mix;

      // Hazard pulse when locking onto a CTA
      if (next === "acquire") {
        gsap.fromTo(
          bloom,
          { opacity: 0.55, scale: 0.8 },
          { opacity: 0, scale: 2.2, duration: 0.4, ease: "power2.out", overwrite: true },
        );
      }
    };

    const resolveTarget = (el: Element | null) => {
      if (!el) {
        applyMode("default");
        setLabel("");
        return;
      }

      const acquire = el.closest(ACQUIRE) as HTMLElement | null;
      const lock = el.closest(LOCK) as HTMLElement | null;
      const link = el.closest(LINK) as HTMLElement | null;
      const sector = el.closest(SECTOR) as HTMLElement | null;

      if (acquire) {
        applyMode("acquire");
        setLabel(acquire.dataset.cursorLabel?.toUpperCase() || "ACQUIRE");
        return;
      }

      if (lock) {
        applyMode("lock");
        setLabel(lock.dataset.cursorLabel?.toUpperCase() || "LOCK");
        return;
      }

      if (link) {
        applyMode("link");
        setLabel(link.dataset.cursorLabel?.toUpperCase() || "");
        return;
      }

      if (sector) {
        const idx =
          sector.dataset.cursorIndex ||
          sector.querySelector(".naga-chapter-index")?.textContent?.replace(/[\[\]]/g, "").trim() ||
          "";
        const name =
          sector.dataset.cursorLabel ||
          sector.querySelector(".naga-chapter-title")?.textContent?.trim() ||
          "";
        applyMode("sector");
        setLabel(idx && name ? `${idx} // ${name.toUpperCase()}` : name ? name.toUpperCase() : "");
        return;
      }

      applyMode("default");
      setLabel("");
    };

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      setVisible(true);
      resolveTarget(e.target as Element | null);
    };

    const onLeave = () => setVisible(false);

    const onDown = () => {
      const prev = mode;
      applyMode("click");
      gsap.fromTo(
        bloom,
        { opacity: 0.65, scale: 0.5 },
        { opacity: 0, scale: 2.4, duration: 0.38, ease: "power2.out", overwrite: true },
      );
      // restore after press using pointerup
      void prev;
    };

    const onUp = (e: PointerEvent) => {
      resolveTarget(e.target as Element | null);
    };

    const onScroll = () => {
      const now = performance.now();
      const dy = window.scrollY - scroll.lastY;
      const dt = Math.max(now - scroll.lastT, 8);
      scroll.vy = gsap.utils.clamp(-1.6, 1.6, dy / dt);
      scroll.lastY = window.scrollY;
      scroll.lastT = now;

      const stretchY = 1 + Math.min(Math.abs(scroll.vy) * 1.2, 0.45);
      const stretchX = 1 / Math.sqrt(stretchY);

      stretched = true;
      gsap.to(ring, {
        scaleX: stretchX * baseRing,
        scaleY: stretchY * baseRing,
        duration: 0.16,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    const tick = () => {
      pos.x += (target.x - pos.x) * 0.22;
      pos.y += (target.y - pos.y) * 0.22;

      const dx = target.x - pos.x;
      const dy = target.y - pos.y;

      gsap.set(root, { x: pos.x, y: pos.y });
      gsap.set(dot, { x: dx * 0.28, y: dy * 0.28 });

      scroll.vy *= 0.9;
      if (stretched && Math.abs(scroll.vy) < 0.002) {
        stretched = false;
        gsap.to(ring, {
          scaleX: baseRing,
          scaleY: baseRing,
          duration: 0.35,
          ease: "power3.out",
          overwrite: "auto",
        });
      }

      raf = requestAnimationFrame(tick);
    };

    const onClick = (e: MouseEvent) => {
      const sector = (e.target as Element | null)?.closest(SECTOR) as HTMLElement | null;
      if (!sector) return;
      const name =
        sector.dataset.cursorLabel ||
        sector.querySelector(".naga-chapter-title")?.textContent?.trim() ||
        "";
      if (!name) return;
      const idx =
        sector.dataset.cursorIndex ||
        sector.querySelector(".naga-chapter-index")?.textContent?.replace(/[\[\]]/g, "").trim() ||
        "";
      applyMode("sector");
      setLabel(idx ? `${idx} // ${name.toUpperCase()}` : name.toUpperCase());
      gsap.fromTo(
        label,
        { opacity: 0, y: 6 },
        { opacity: 1, y: 0, duration: 0.22, ease: "power3.out" },
      );
      gsap.fromTo(
        bloom,
        { opacity: 0.4, scale: 0.6 },
        { opacity: 0, scale: 2, duration: 0.5, ease: "power2.out", overwrite: true },
      );
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("click", onClick, true);

    raf = requestAnimationFrame(tick);
    setVisible(false);

    return () => {
      cancelAnimationFrame(raf);
      crossSpin?.kill();
      document.documentElement.classList.remove("naga-has-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("click", onClick, true);
      gsap.killTweensOf([root, ring, cross, dot, label, bloom]);
    };
  }, []);

  return (
    <div ref={rootRef} className="naga-cursor" aria-hidden="true" style={{ opacity: 0 }}>
      <div ref={bloomRef} className="naga-cursor-bloom" />
      <div ref={ringRef} className="naga-cursor-ring">
        <div ref={crossRef} className="naga-cursor-cross" />
      </div>
      <div ref={dotRef} className="naga-cursor-dot" />
      <div ref={labelRef} className="naga-cursor-label" />
    </div>
  );
}
