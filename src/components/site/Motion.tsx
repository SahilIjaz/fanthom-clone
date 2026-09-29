"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

const DESKTOP = "(min-width: 992px)";
const MotionCtx = createContext<{ ready: boolean }>({ ready: false });
export const useMotion = () => useContext(MotionCtx);

/**
 * Global motion provider, matching the audited behavior:
 * - Lenis smooth scroll on >=992px only, destroyed below (inventory: global-1)
 * - nav [data-btn-swap] flips top->scrolled at scrollY >= 80 (global-2)
 * - ScrollTrigger wired to the Lenis scroller
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const mm = gsap.matchMedia();
    let lenis: Lenis | null = null;
    let rafId = 0;
    mm.add(DESKTOP, () => {
      lenis = new Lenis();
      (window as unknown as { lenis: Lenis | null }).lenis = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      const raf = (time: number) => { lenis?.raf(time); rafId = requestAnimationFrame(raf); };
      rafId = requestAnimationFrame(raf);
      return () => {
        cancelAnimationFrame(rafId);
        lenis?.destroy();
        lenis = null;
        (window as unknown as { lenis: Lenis | null }).lenis = null;
      };
    });

    // nav state swap at 80px (rAF-throttled)
    const T = 80;
    let ticking = false;
    const apply = (y: number) => {
      const s = y >= T ? "scrolled" : "top";
      document.querySelectorAll("[data-btn-swap]").forEach((w) => w.setAttribute("data-btn-swap", s));
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) { ticking = true; requestAnimationFrame(() => apply(window.scrollY)); }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    apply(window.scrollY);
    setReady(true);
    return () => { mm.revert(); window.removeEventListener("scroll", onScroll); };
  }, []);
  return <MotionCtx.Provider value={{ ready }}>{children}</MotionCtx.Provider>;
}

export const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export { gsap, ScrollTrigger, DESKTOP };
