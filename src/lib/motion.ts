import type { Transition, Variants } from "framer-motion";

export const elegantEase = [0.22, 1, 0.36, 1] as const;

export const elegantTransition: Transition = {
  duration: 0.85,
  ease: elegantEase,
};

export const softSpring: Transition = {
  type: "spring",
  stiffness: 68,
  damping: 24,
  mass: 1.05,
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: elegantTransition,
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.7, ease: elegantEase },
  },
};

export const dashboardContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      when: "beforeChildren",
    },
  },
};

/**
 * Directional entrance for dashboard scrapbook pieces.
 * Uses explicit index delays so nested layout wrappers still assemble one-by-one.
 */
export const assemble = (
  from: {
    x?: number;
    y?: number;
    scale?: number;
    rotate?: number;
    duration?: number;
  } = {},
  options: { shortened?: boolean; index?: number; reduced?: boolean } = {},
): Variants => {
  const shortened = Boolean(options.shortened);
  const reduced = Boolean(options.reduced);
  const index = options.index ?? 0;
  const duration = reduced
    ? 0.01
    : shortened
      ? Math.min(0.5, from.duration ?? 0.65)
      : (from.duration ?? 0.88);
  const distanceScale = shortened ? 0.4 : 1;
  const step = shortened ? 0.06 : 0.14;
  const base = shortened ? 0.05 : 0.2;
  const delay = reduced ? 0 : base + index * step;

  return {
    hidden: {
      opacity: 0,
      x: (from.x ?? 0) * distanceScale,
      y: (from.y ?? 28) * distanceScale,
      scale: from.scale ?? 0.94,
      rotate: (from.rotate ?? 0) * (shortened ? 0.35 : 1),
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      rotate: 0,
      transition: {
        duration,
        ease: elegantEase,
        delay,
      },
    },
  };
};

export const pageVariants: Variants = {
  initial: { opacity: 0, y: 14 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: elegantEase },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.3, ease: elegantEase },
  },
};
