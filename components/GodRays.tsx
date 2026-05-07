"use client";

export function GodRays({ intense = false }: { intense?: boolean }) {
  return (
    <>
      <div
        aria-hidden
        className="god-rays"
        style={{ opacity: intense ? 0.9 : 0.55 }}
      />
      <div aria-hidden className="grain" />
    </>
  );
}
