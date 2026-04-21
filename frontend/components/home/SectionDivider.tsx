"use client";

import { motion } from "framer-motion";

interface SectionDividerProps {
  flip?: boolean;
  className?: string;
}

/**
 * WHY: Create smoother visual transitions between landing sections.
 */
export const SectionDivider = ({
  flip = false,
  className = "",
}: SectionDividerProps) => {
  return (
    <div
      className={`pointer-events-none relative z-10 h-20 overflow-hidden md:h-24 ${className}`}
      style={{ transform: flip ? "rotate(180deg)" : "none" }}
      aria-hidden="true"
    >
      <svg
        className="absolute inset-x-0 top-0 h-full w-full"
        viewBox="0 0 1440 160"
        preserveAspectRatio="none"
      >
        <motion.path
          d="M0,64 C160,120 320,20 480,64 C640,108 800,136 960,96 C1120,56 1280,40 1440,88 L1440,160 L0,160 Z"
          fill="url(#divider-gradient)"
          initial={{ opacity: 0.65 }}
          animate={{ opacity: [0.65, 0.9, 0.65] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <defs>
          <linearGradient
            id="divider-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="rgba(14, 165, 233, 0.2)" />
            <stop offset="50%" stopColor="rgba(99, 102, 241, 0.16)" />
            <stop offset="100%" stopColor="rgba(245, 158, 11, 0.14)" />
          </linearGradient>
        </defs>
      </svg>

      <motion.div
        className="absolute left-[12%] top-8 h-2 w-2 rounded-full bg-cyan-400/60 blur-[1px]"
        animate={{ x: [0, 60, 0], y: [0, -8, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-[48%] top-10 h-1.5 w-1.5 rounded-full bg-indigo-400/60 blur-[1px]"
        animate={{ x: [0, -50, 0], y: [0, 10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-[18%] top-7 h-2 w-2 rounded-full bg-amber-400/60 blur-[1px]"
        animate={{ x: [0, -40, 0], y: [0, -10, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
};
