"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { elegantEase } from "@/lib/motion";

type PageTransitionProps = {
  children: ReactNode;
};

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const isDashboard = pathname === "/invite";

  if (reduced) {
    return <div key={pathname}>{children}</div>;
  }

  // Dashboard handles its own assemble / veil; keep transitions light there.
  if (isDashboard) {
    return (
      <motion.div
        key={pathname}
        initial={{ opacity: 0.88 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35, ease: elegantEase }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.45, ease: elegantEase }}
      >
        <motion.div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-40 bg-ivory"
          initial={{ opacity: 0.4 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: elegantEase }}
        />
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
