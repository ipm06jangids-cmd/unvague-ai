"use client";

import { motion } from "framer-motion";

export function GodRays({ intense = false }: { intense?: boolean }) {
  return (
    <>
      <motion.div
        aria-hidden
        className="god-rays"
        style={{ opacity: intense ? 1 : 0.7 }}
        animate={{
          scale: [1, 1.05, 1],
          rotate: [0, 1, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <div aria-hidden className="grain" />
    </>
  );
}
