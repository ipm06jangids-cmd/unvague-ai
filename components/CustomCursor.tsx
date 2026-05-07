"use client";

import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduce || coarse || window.innerWidth < 1024) return;
    setEnabled(true);

    let dx = 0,
      dy = 0,
      rx = 0,
      ry = 0;
    let raf = 0;
    let hovering = false;

    const move = (e: MouseEvent) => {
      dx = e.clientX;
      dy = e.clientY;
    };
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      hovering = !!t.closest("a, button, [data-cursor-hover], input, textarea, select");
      if (ringRef.current) {
        ringRef.current.style.width = hovering ? "48px" : "28px";
        ringRef.current.style.height = hovering ? "48px" : "28px";
      }
    };

    const tick = () => {
      rx += (dx - rx) * 0.18;
      ry += (dy - ry) * 0.18;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dx - 3}px, ${dy - 3}px, 0)`;
      }
      if (ringRef.current) {
        const size = hovering ? 24 : 14;
        ringRef.current.style.transform = `translate3d(${rx - size}px, ${ry - size}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", over, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-1.5 w-1.5 rounded-full bg-gold-400 will-change-transform"
      />
      <div
        ref={ringRef}
        aria-hidden
        style={{ width: 28, height: 28, transition: "width 200ms, height 200ms" }}
        className="pointer-events-none fixed left-0 top-0 z-[9998] rounded-full border border-violet-400/60 mix-blend-difference will-change-transform"
      />
    </>
  );
}
