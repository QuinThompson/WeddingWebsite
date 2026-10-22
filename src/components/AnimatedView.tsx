"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { elegantEase } from "@/lib/motion";

type AnimatedViewProps = {
  children: ReactNode;
  className?: string;
};

export function AnimatedView({ children, className }: AnimatedViewProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.65, ease: elegantEase }}
    >
      {children}
    </motion.div>
  );
}
