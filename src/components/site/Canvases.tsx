"use client";
/**
 * Canvas effects rebuilt from the audited parameters (ANIMATION_INVENTORY #4, #9, #10).
 * Our own implementations; numbers match the measurements.
 */
import { useEffect, useRef } from "react";
import { gsap, reducedMotion } from "./Motion";

/* #4 Starfield: static paint on all devices; drift + pointer parallax >=992px.
   80% dots rgba(250,245,245,.45), 20% #bfe8ff, r 0.6-1.8, shadowBlur 8, ~5% twinkles. */
export function Stars({ count = 100, layers = 2, className = "" }: { count?: number; layers?: number; className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const canvases = Array.from(wrap.querySelectorAll("canvas"));
    const cache = new Map<HTMLCanvasElement, { u: number; v: number; r: number; c: string }[]>();

    const paint = () => {
      canvases.forEach((cv) => {
        const w = wrap.clientWidth, h = wrap.clientHeight;
        cv.width = Math.max(1, w * dpr); cv.height = Math.max(1, h * dpr);
        cv.style.width = w + "px"; cv.style.height = h + "px";
        if (!cache.has(cv)) {
          cache.set(cv, Array.from({ length: count }, () => ({
            u: Math.random(), v: Math.random(),
            r: (0.6 + Math.random() * 1.2) * dpr,
            c: Math.random() < 0.8 ? "rgba(250,245,245,0.45)" : "#bfe8ff",
          })));
        }
        const ctx = cv.getContext("2d")!;
        ctx.clearRect(0, 0, cv.width, cv.height);
        ctx.save();
        ctx.shadowBlur = 8 * dpr;
        ctx.shadowColor = "rgba(190,230,255,0.35)";
        for (const s of cache.get(cv)!) {
          ctx.beginPath(); ctx.arc(s.u * cv.width, s.v * cv.height, s.r, 0, Math.PI * 2);
          ctx.fillStyle = s.c; ctx.fill();
        }
        ctx.restore();
        const twinkles = Math.max(4, Math.floor(count * 0.05));
        for (let i = 0; i < twinkles; i++) {
          const x = Math.random() * cv.width, y = Math.random() * cv.height;
          const r = (0.5 + Math.random() * 2) * dpr;
          const g = ctx.createRadialGradient(x, y, 0, x, y, r * 2.2);
          g.addColorStop(0, "rgba(255,255,255,0.6)"); g.addColorStop(0.5, "rgba(160,220,255,0.35)"); g.addColorStop(1, "transparent");
          ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r * 2.2, 0, Math.PI * 2); ctx.fill();
        }
      });
    };
    paint();
    const ro = new ResizeObserver(() => requestAnimationFrame(paint));
    ro.observe(wrap);

    let mmRevert: (() => void) | null = null;
    if (!reducedMotion()) {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 992px)", () => {
        const onMove = (e: PointerEvent) => {
          const r = wrap.getBoundingClientRect();
          const mx = (e.clientX - r.left) / r.width - 0.5;
          const my = (e.clientY - r.top) / r.height - 0.5;
          canvases.forEach((el, i) => {
            const depth = (i + 1) * 6;
            gsap.to(el, { x: mx * depth, y: my * depth, duration: 0.6, overwrite: true });
          });
        };
        wrap.addEventListener("pointermove", onMove);
        const drift = gsap.to(canvases, {
          x: (i: number) => `+=${(i + 1) * 2}`, y: (i: number) => `+=${(i + 1) * 1}`,
          duration: 20, ease: "none", repeat: -1, yoyo: true,
        });
        return () => {
          wrap.removeEventListener("pointermove", onMove);
          drift.kill();
          gsap.set(canvases, { clearProps: "transform" });
          requestAnimationFrame(paint);
        };
      });
      mmRevert = () => mm.revert();
    }
    return () => { ro.disconnect(); mmRevert?.(); };
  }, [count, layers]);
  return (
    <div ref={wrapRef} className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      {Array.from({ length: layers }).map((_, i) => (
        <canvas key={i} className="absolute inset-0" />
      ))}
    </div>
  );
}

/* #9 Hover grid: 80px cells, mouse paints current cell (opacity 120/255),
   neighbors spawn p=0.9, fade -1/frame, stroke gradient pink->orange->purple->yellow,
   alpha x0.6. Desktop only. */
export function GridHover({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const section = ref.current?.parentElement;
    const holder = ref.current;
    if (!section || !holder || reducedMotion()) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 992px)", () => {
      const CELL = 80, PROB = 0.9, FADE = 1, BASE = 0.6, MAXO = 120;
      const canvas = document.createElement("canvas");
      canvas.style.cssText = "position:absolute;inset:0;pointer-events:none";
      holder.appendChild(canvas);
      const ctx = canvas.getContext("2d")!;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      let w = 0, h = 0, grad: CanvasGradient;
      const size = () => {
        const b = section.getBoundingClientRect();
        w = b.width; h = b.height;
        canvas.width = w * dpr; canvas.height = h * dpr;
        canvas.style.width = w + "px"; canvas.style.height = h + "px";
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        grad = ctx.createLinearGradient(0, 0, w, 0);
        [["0", "#FFA8BB"], ["0.33", "#F55200"], ["0.66", "#9600FF"], ["1", "#FFF58C"]].forEach(([p, c]) =>
          grad.addColorStop(+p, c as string)
        );
      };
      size();
      const ro = new ResizeObserver(size); ro.observe(section);
      let px = -1, py = -1, curR = -2, curC = -2;
      const cells = new Map<string, { row: number; col: number; opacity: number }>();
      const onMove = (e: MouseEvent) => {
        const r = section.getBoundingClientRect();
        px = e.clientX - r.left; py = e.clientY - r.top;
      };
      section.addEventListener("mousemove", onMove);
      let raf = 0;
      const frame = () => {
        raf = requestAnimationFrame(frame);
        ctx.clearRect(0, 0, w, h);
        if (px >= 0) {
          const row = Math.floor(py / CELL), col = Math.floor(px / CELL);
          if (row !== curR || col !== curC) {
            curR = row; curC = col;
            cells.set(`${row}:${col}`, { row, col, opacity: MAXO });
            for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
              if (Math.random() < PROB) {
                const k = `${row + dr}:${col + dc}`;
                const ex = cells.get(k);
                if (!ex || ex.opacity < MAXO * 0.6) cells.set(k, { row: row + dr, col: col + dc, opacity: MAXO * 0.6 });
              }
            }
          }
        }
        ctx.strokeStyle = grad;
        for (const [k, n] of cells) {
          n.opacity -= FADE;
          if (n.opacity <= 0) { cells.delete(k); continue; }
          ctx.globalAlpha = (n.opacity / 255) * BASE;
          ctx.strokeRect(n.col * CELL, n.row * CELL, CELL, CELL);
        }
        ctx.globalAlpha = 1;
      };
      raf = requestAnimationFrame(frame);
      return () => {
        cancelAnimationFrame(raf); ro.disconnect();
        section.removeEventListener("mousemove", onMove); canvas.remove();
      };
    });
    return () => mm.revert();
  }, []);
  return <div ref={ref} className={`absolute inset-0 ${className}`} aria-hidden />;
}

/* #10 Marquee banner: linear loop, duration = max(6, width / 80) seconds,
   content cloned to fill, paused under reduced motion. */
export function MarqueeBanner({ children, speed = 80, className = "" }: {
  children: React.ReactNode; speed?: number; className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current, track = trackRef.current;
    if (!el || !track) return;
    const apply = () => {
      const dist = track.scrollWidth / 2;
      el.style.setProperty("--mq-distance", `${dist}px`);
      el.style.setProperty("--mq-duration", `${Math.max(6, dist / speed)}s`);
    };
    apply();
    const ro = new ResizeObserver(apply); ro.observe(el);
    return () => ro.disconnect();
  }, [speed]);
  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <div ref={trackRef} className="mq-track flex w-max items-center">
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>{children}</div>
      </div>
    </div>
  );
}
