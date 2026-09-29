"use client";
import { createElement, useEffect, useRef, useState } from "react";

/* Shared IntersectionObserver: adds .fx-in when an element enters the viewport. */
function useInView<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T | null>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") { setSeen(true); return; }
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }),
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, seen };
}

/* Fade-and-rise reveal for whole blocks, with optional stagger delay. */
export function Reveal({ children, delay = 0, y = 28, as = "div", className = "" }: {
  children: React.ReactNode; delay?: number; y?: number; as?: string; className?: string;
}) {
  const { ref, seen } = useInView<HTMLDivElement>(0.15);
  return createElement(
    as,
    {
      ref,
      className,
      style: {
        opacity: seen ? 1 : 0,
        transform: seen ? "none" : `translateY(${y}px)`,
        transition: `opacity .8s cubic-bezier(.22,.61,.36,1) ${delay}ms, transform .8s cubic-bezier(.22,.61,.36,1) ${delay}ms`,
        willChange: "opacity, transform",
      },
    },
    children
  );
}

/* Split-text heading: words rise in one after another (SplitText-style). */
export function SplitHeading({ text, className = "", as = "h2", delay = 0 }: {
  text: string; className?: string; as?: string; delay?: number;
}) {
  const { ref, seen } = useInView<HTMLHeadingElement>(0.3);
  const words = text.split(" ");
  return createElement(
    as,
    { ref, className, "aria-label": text },
    words.map((w, i) => (
      <span key={i} className="inline-block overflow-hidden pb-[0.08em] -mb-[0.08em] align-bottom" aria-hidden>
        <span
          className="inline-block"
          style={{
            transform: seen ? "none" : "translateY(110%)",
            transition: `transform .7s cubic-bezier(.22,.61,.36,1) ${delay + i * 55}ms`,
          }}
        >
          {w}
        </span>
        {i < words.length - 1 ? " " : ""}
      </span>
    ))
  );
}

/* Character scramble: letters shuffle into place when scrolled into view. */
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#✦*";
export function Scramble({ text, className = "" }: { text: string; className?: string }) {
  const { ref, seen } = useInView<HTMLSpanElement>(0.5);
  const [out, setOut] = useState(text);
  useEffect(() => {
    if (!seen) return;
    let frame = 0;
    const total = Math.max(14, text.length + 6);
    const id = setInterval(() => {
      frame++;
      const settled = Math.floor((frame / total) * text.length);
      setOut(
        text
          .split("")
          .map((c, i) =>
            i < settled || c === " " ? c : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
          )
          .join("")
      );
      if (frame >= total) { setOut(text); clearInterval(id); }
    }, 34);
    return () => clearInterval(id);
  }, [seen, text]);
  return <span ref={ref} className={className}>{out}</span>;
}

/* Scroll-linked parallax: element drifts at `speed` relative to scroll. */
export function Parallax({ children, speed = 0.14, className = "" }: {
  children: React.ReactNode; speed?: number; className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const mid = r.top + r.height / 2 - window.innerHeight / 2;
        el.style.transform = `translateY(${-mid * speed}px)`;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, [speed]);
  return <div ref={ref} className={className} style={{ willChange: "transform" }}>{children}</div>;
}

/* Scale-in for large media blocks (the product shot grows into place). */
export function ScaleIn({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const { ref, seen } = useInView<HTMLDivElement>(0.18);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: seen ? 1 : 0,
        transform: seen ? "scale(1)" : "scale(0.93) translateY(30px)",
        transition: "opacity .9s cubic-bezier(.22,.61,.36,1), transform .9s cubic-bezier(.22,.61,.36,1)",
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}

/* Count-up for stat numbers. */
export function CountUp({ value, className = "" }: { value: string; className?: string }) {
  const { ref, seen } = useInView<HTMLSpanElement>(0.6);
  const m = value.match(/^(\D*)(\d+)(.*)$/);
  const [n, setN] = useState(0);
  const target = m ? parseInt(m[2], 10) : 0;
  useEffect(() => {
    if (!seen || !m) return;
    const t0 = performance.now();
    const dur = 1100;
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / dur);
      setN(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, target, m]);
  if (!m) return <span ref={ref} className={className}>{value}</span>;
  return <span ref={ref} className={className}>{m[1]}{seen ? n : 0}{m[3]}</span>;
}
