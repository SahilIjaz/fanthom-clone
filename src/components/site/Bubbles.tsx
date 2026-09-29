"use client";
/* #8: bubbles pop in shuffled order (scale .6->1, .6s power2.out), then their
   connector line grows (scaleY 0->1, .5s power2.out); container stagger .18s;
   trigger: wrapper top 70%, once; reduced motion jumps to the end state. */
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, reducedMotion } from "./Motion";

export function BubbleField({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const scope = ref.current;
    if (!scope) return;
    const containers = gsap.utils.shuffle(gsap.utils.toArray<HTMLElement>("[data-bubble]", scope));
    const master = gsap.timeline({ paused: true });
    containers.forEach((container, i) => {
      const bubble = container.querySelector("[data-bubble-pill]");
      const line = container.querySelector("[data-bubble-line]");
      if (!bubble) return;
      gsap.set(bubble, { opacity: 0, scale: 0.6 });
      if (line) gsap.set(line, { scale: 0 });
      const tl = gsap.timeline();
      tl.to(bubble, { opacity: 1, scale: 1, duration: 0.6, ease: "power2.out" });
      if (line) tl.to(line, { scale: 1, duration: 0.5, ease: "power2.out" });
      master.add(tl, i * 0.18);
    });
    const st = ScrollTrigger.create({ trigger: scope, start: "top 70%", once: true, onEnter: () => master.play() });
    if (reducedMotion()) master.progress(1).kill();
    return () => { st.kill(); master.kill(); };
  }, []);
  return <div ref={ref} className={className}>{children}</div>;
}
