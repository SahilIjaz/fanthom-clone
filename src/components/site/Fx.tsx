"use client";
/**
 * Motion primitives rebuilt on GSAP with the parameters measured from the live
 * site (see ANIMATION_INVENTORY.md). Implementation is our own; the numbers
 * (durations, easings, staggers, triggers) are the audited values.
 */
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, reducedMotion } from "./Motion";

/* #1 Typewriter: chars autoAlpha 0->1, 0.2s each, stagger 0.04, power1.out.
   First instance plays after `delay` (default 0.7s); others at top 80%, once. */
export function Typewriter({ text, className = "", as: Tag = "h2", delay = 0.7, first = false }: {
  text: string; className?: string; as?: "h1" | "h2" | "h3"; delay?: number; first?: boolean;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const chars = el.querySelectorAll<HTMLElement>("[data-ch]");
    if (reducedMotion()) { gsap.set(chars, { autoAlpha: 1 }); return; }
    gsap.set(chars, { autoAlpha: 0 });
    const play = () => {
      gsap.to(chars, { autoAlpha: 1, duration: 0.2, stagger: 0.04, ease: "power1.out" });
    };
    let st: ScrollTrigger | undefined;
    let call: gsap.core.Tween | undefined;
    if (first) {
      call = gsap.delayedCall(Math.max(0, delay), play);
    } else {
      st = ScrollTrigger.create({ trigger: el, start: "top 80%", once: true, onEnter: () => { call = gsap.delayedCall(Math.max(0, delay), play); } });
    }
    return () => { st?.kill(); call?.kill(); };
  }, [text, delay, first]);
  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {text.split(" ").map((w, wi, arr) => (
        <span key={wi} className="inline-block whitespace-nowrap" aria-hidden>
          {Array.from(w).map((c, ci) => (
            <span key={ci} data-ch className="inline-block">{c}</span>
          ))}
          {wi < arr.length - 1 ? " " : ""}
        </span>
      ))}
    </Tag>
  );
}

/* #2 Scramble: per-word, 1s each, word stagger 0.015, uppercase charset,
   settles progressively (speed 0.4); trigger top bottom, once. */
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
export function Scramble({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [words, setWords] = useState<string[]>(() => text.split(" "));
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reducedMotion()) { setWords(text.split(" ")); return; }
    const target = text.split(" ");
    const st = ScrollTrigger.create({
      trigger: el, start: "top bottom", once: true,
      onEnter: () => {
        const t0 = performance.now();
        const DUR = 1000, STAG = 15, SPEED = 0.4;
        let raf = 0;
        const tick = (now: number) => {
          const out = target.map((w, wi) => {
            const local = (now - t0 - wi * STAG) / DUR;
            if (local <= 0) return w.replace(/\S/g, () => UPPER[(Math.random() * 26) | 0]);
            if (local >= 1) return w;
            // characters resolve front-to-back as local progresses (speed 0.4 feel)
            const settled = Math.floor(local / SPEED * w.length);
            return Array.from(w)
              .map((c, ci) => (ci < settled || !/\S/.test(c) ? c : UPPER[(Math.random() * 26) | 0]))
              .join("");
          });
          setWords(out);
          if (out.some((w, i) => w !== target[i])) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
      },
    });
    return () => st.kill();
  }, [text]);
  return <span ref={ref} className={className} aria-label={text}>{words.join(" ")}</span>;
}

/* #7 Card reveal: yPercent 20 -> 0, opacity 0 -> 1, 0.6s power2.out,
   batched with stagger 0.4, once. Apply data-anim="card" via this wrapper. */
export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reducedMotion()) return;
    gsap.set(el, { yPercent: 20, opacity: 0 });
    const st = ScrollTrigger.batch(el, {
      onEnter: (batch) =>
        gsap.to(batch, { yPercent: 0, opacity: 1, duration: 0.6, stagger: 0.4, ease: "power2.out", overwrite: true }),
      once: true,
    });
    return () => st.forEach((s) => s.kill());
  }, []);
  return <div ref={ref} className={className}>{children}</div>;
}

/* #3 Astronaut bob: y -14, 3s sine.inOut, yoyo, infinite (all devices). */
export function Bob({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (reducedMotion()) return;
    const tw = gsap.to(ref.current, { y: -14, duration: 3, ease: "sine.inOut", yoyo: true, repeat: -1 });
    return () => { tw.kill(); };
  }, []);
  return <div ref={ref} className={className}>{children}</div>;
}

/* #5 Gradient parallax: y 0 -> +90vh over trigger top bottom -> bottom top, scrub 1. */
export function GradientParallax({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion()) return;
    const tw = gsap.to(el, {
      y: () => window.innerHeight * 0.9,
      ease: "none",
      scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 1 },
    });
    return () => { tw.scrollTrigger?.kill(); tw.kill(); };
  }, []);
  return <div ref={ref} className={className} aria-hidden />;
}

/* #6 Planet scrub: our SVG planet rotates with scroll (equivalent of the
   video-frame scrub), trigger top bottom -> bottom top, scrub 2, >=992px only. */
export function PlanetScrub({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion()) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 992px)", () => {
      const tw = gsap.fromTo(
        el.firstElementChild,
        { rotate: -30 },
        {
          rotate: 50,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 2, invalidateOnRefresh: true },
        }
      );
      return () => { tw.scrollTrigger?.kill(); tw.kill(); };
    });
    return () => mm.revert();
  }, []);
  return <div ref={ref} className={className}>{children}</div>;
}

/* Compatibility wrappers for existing pages (mapped onto audited primitives). */
export function SplitHeading({ text, className = "", as = "h2", delay = 0 }: {
  text: string; className?: string; as?: string; delay?: number;
}) {
  const Tag = (as === "h1" || as === "h3" ? as : "h2") as "h1" | "h2" | "h3";
  return <Typewriter text={text} className={className} as={Tag} delay={delay ? delay / 1000 : 0.7} first={as === "h1"} />;
}

export function Reveal({ children, delay = 0, className = "" }: {
  children: React.ReactNode; delay?: number; y?: number; as?: string; className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion()) return;
    gsap.set(el, { yPercent: 8, opacity: 0 });
    const st = ScrollTrigger.create({
      trigger: el, start: "top 85%", once: true,
      onEnter: () => gsap.to(el, { yPercent: 0, opacity: 1, duration: 0.6, delay: delay / 1000, ease: "power2.out" }),
    });
    return () => st.kill();
  }, [delay]);
  return <div ref={ref} className={className}>{children}</div>;
}

export function ScaleIn({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion()) return;
    gsap.set(el, { yPercent: 20, opacity: 0 });
    const st = ScrollTrigger.create({
      trigger: el, start: "top 85%", once: true,
      onEnter: () => gsap.to(el, { yPercent: 0, opacity: 1, duration: 0.6, ease: "power2.out" }),
    });
    return () => st.kill();
  }, []);
  return <div ref={ref} className={className}>{children}</div>;
}

export function Parallax({ children, className = "" }: { children: React.ReactNode; speed?: number; className?: string }) {
  return <PlanetScrub className={className}>{children}</PlanetScrub>;
}

export function CountUp({ value, className = "" }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(0);
  const m = value.match(/^(\D*)(\d+)(.*)$/);
  const target = m ? parseInt(m[2], 10) : 0;
  useEffect(() => {
    const el = ref.current;
    if (!el || !m) return;
    if (reducedMotion()) { setN(target); return; }
    const obj = { v: 0 };
    const st = ScrollTrigger.create({
      trigger: el, start: "top 85%", once: true,
      onEnter: () => gsap.to(obj, { v: target, duration: 1.1, ease: "power3.out", onUpdate: () => setN(Math.round(obj.v)) }),
    });
    return () => st.kill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);
  if (!m) return <span ref={ref} className={className}>{value}</span>;
  return <span ref={ref} className={className}>{m[1]}{n}{m[3]}</span>;
}
