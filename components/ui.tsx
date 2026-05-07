"use client";

import { ReactNode, ButtonHTMLAttributes, HTMLAttributes } from "react";

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...rest
}: {
  variant?: "primary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  const sizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-5 text-sm",
    lg: "h-12 px-7 text-base",
  };
  const variants = {
    primary:
      "bg-gradient-to-b from-violet-500 to-violet-600 text-ivory-100 shadow-[0_0_24px_-8px_var(--violet-500)] hover:from-violet-400 hover:to-violet-500 hover:scale-[1.02] active:scale-[0.98]",
    ghost: "text-ivory-300 hover:text-gold-300 hover:bg-obsidian-800/40",
    outline:
      "border border-gold-400/30 text-ivory-100 hover:border-gold-400 hover:bg-gold-400/5 hover:text-gold-300 hover:scale-[1.02] active:scale-[0.98]",
  };
  return (
    <button
      data-cursor-hover
      className={`inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none ${sizes[size]} ${variants[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export function Chip({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick?: () => void;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      data-cursor-hover
      className={`whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all ${
        active
          ? "border-gold-400/60 bg-gold-400/10 text-gold-300 shadow-[0_0_16px_-6px_var(--gold-400)]"
          : "border-obsidian-700 bg-obsidian-900/50 text-ivory-400 hover:border-gold-400/40 hover:text-ivory-100"
      }`}
    >
      {children}
    </button>
  );
}

export function Glass({
  className = "",
  children,
  ...rest
}: { children: ReactNode } & HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`glass rounded-2xl ${className}`} {...rest}>
      {children}
    </div>
  );
}

export function Hairline({ className = "" }: { className?: string }) {
  return <div aria-hidden className={`hairline ${className}`} />;
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-400">
      <span className="h-px w-6 bg-gold-400/60" />
      {children}
    </div>
  );
}
