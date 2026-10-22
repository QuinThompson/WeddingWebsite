"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IntroBoardingPass } from "@/components/IntroBoardingPass";
import { PassportCover } from "@/components/PassportCover";
import { wedding } from "@/data/wedding";
import { elegantEase } from "@/lib/motion";
import { clearDashboardScroll, markOpeningTransition } from "@/lib/session";

export function InvitationIntro() {
  const router = useRouter();
  const reduced = useReducedMotion();
  const [opening, setOpening] = useState(false);

  const handleOpen = () => {
    if (opening) return;
    setOpening(true);
    markOpeningTransition();
    clearDashboardScroll();

    window.setTimeout(
      () => {
        router.push("/invite");
      },
      reduced ? 120 : 1100,
    );
  };

  return (
    <section className="paper-texture relative flex min-h-dvh items-center justify-center overflow-hidden safe-pad">
      <AnimatePresence>
        {opening ? (
          <motion.div
            key="veil"
            className="pointer-events-none fixed inset-0 z-50 bg-ivory"
            initial={{ opacity: 0 }}
            animate={{ opacity: reduced ? 1 : [0, 0.55, 1] }}
            transition={{ duration: reduced ? 0.15 : 1.05, ease: elegantEase }}
            aria-hidden
          />
        ) : null}
      </AnimatePresence>

      <motion.div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        animate={opening && !reduced ? { opacity: 0.2 } : { opacity: 1 }}
        transition={{ duration: 0.8, ease: elegantEase }}
      >
        <div className="absolute left-[10%] top-[16%] h-36 w-36 rounded-full bg-lilac/20 blur-3xl" />
        <div className="absolute bottom-[14%] right-[8%] h-44 w-44 rounded-full bg-sage/15 blur-3xl" />
      </motion.div>

      <div className="relative flex w-full max-w-md flex-col items-center px-2">
        {/*
          Stack: vertical boarding pass behind vertical passport.
          Top of the pass peeks out above the passport cover.
        */}
        <motion.div
          className="relative w-[min(70vw,16.5rem)] pt-[3.6rem] sm:w-[17.5rem] sm:pt-[3.9rem]"
          initial={false}
          animate={
            opening && !reduced
              ? { scale: 1.12, y: -22, rotate: -2, opacity: 0.12 }
              : reduced
                ? { scale: 1, y: 0, rotate: 0, opacity: 1 }
                : { scale: 1, y: [0, -5, 0], rotate: 0, opacity: 1 }
          }
          transition={
            opening
              ? { duration: 1.05, ease: elegantEase }
              : { duration: 5.8, repeat: Infinity, ease: "easeInOut" }
          }
        >
          <motion.div
            className="absolute inset-x-[-0.2rem] top-0 z-0"
            aria-hidden
            animate={
              opening && !reduced ? { y: -14, opacity: 0.25 } : { y: 0, opacity: 1 }
            }
            transition={{ duration: 0.95, ease: elegantEase }}
          >
            <IntroBoardingPass />
          </motion.div>

          <div className="relative z-10">
            <PassportCover
              interactive
              idleFloat={false}
              onOpen={handleOpen}
              className="!w-full"
            />
          </div>
        </motion.div>

        <motion.p
          className="display mt-10 text-center text-[clamp(0.95rem,3.8vw,1.15rem)] uppercase tracking-[0.18em] text-charcoal/75"
          animate={opening && !reduced ? { opacity: 0, y: 10 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: elegantEase }}
        >
          {wedding.dashboard.tapToOpen}
        </motion.p>
      </div>
    </section>
  );
}
