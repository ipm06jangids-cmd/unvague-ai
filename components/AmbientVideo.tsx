"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function AmbientVideo({
  src,
  peak = 0.7,
}: {
  src: string;
  peak?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [load, setLoad] = useState(false);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    [0, peak, peak, peak, 0],
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setLoad(true);
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin: "400px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      {load && (
        <motion.video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ opacity }}
          onCanPlay={(e) => (e.currentTarget as HTMLVideoElement).play().catch(() => {})}
        >
          <source src={src} type="video/mp4" />
        </motion.video>
      )}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-obsidian-950 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-obsidian-950 to-transparent" />
      <div className="grain absolute inset-0 opacity-50" />
    </div>
  );
}
