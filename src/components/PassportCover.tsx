"use client";

import { motion, useReducedMotion } from "framer-motion";
import { PassportDestinationStamp } from "@/components/DecorativeMarks";
import { wedding } from "@/data/wedding";
import { cx } from "@/lib/utils";

type PassportCoverProps = {
  onOpen?: () => void;
  interactive?: boolean;
  className?: string;
  size?: "hero" | "mini";
  /** When false, parent can drive idle motion for passport + tucked pass together. */
  idleFloat?: boolean;
};

export function PassportCover({
  onOpen,
  interactive = false,
  className,
  size = "hero",
  idleFloat = true,
}: PassportCoverProps) {
  const reduced = useReducedMotion();
  const isHero = size === "hero";

  const content = (
    <>
      <div
        className="absolute inset-y-0 left-0 w-[10px] bg-gradient-to-r from-lilac-deep/45 to-transparent"
        aria-hidden
      />
      <div
        className={cx(
          "flex h-full flex-col items-center text-center text-paper",
          isHero ? "justify-between px-6 py-7 sm:px-8 sm:py-9" : "justify-between px-2.5 py-3",
        )}
      >
        <div>
          <p
            className={cx(
              "handwritten leading-none text-paper/95",
              isHero ? "text-[clamp(1.6rem,6vw,2rem)]" : "text-base",
            )}
          >
            Wedding
          </p>
          <p
            className={cx(
              "mt-1 font-semibold uppercase tracking-[0.32em] text-paper",
              isHero ? "text-[0.72rem]" : "text-[0.5rem] tracking-[0.2em]",
            )}
          >
            Passport
          </p>
        </div>

        <PassportDestinationStamp
          destination={wedding.destination.display}
          date={wedding.date.shortDisplay}
          className={isHero ? "h-[7rem] w-[7rem] sm:h-[7.75rem] sm:w-[7.75rem]" : "h-11 w-11"}
        />

        <div>
          <p
            className={cx(
              "uppercase text-paper/80",
              isHero ? "text-[0.62rem] tracking-[0.2em]" : "text-[0.48rem] tracking-[0.12em]",
            )}
          >
            {wedding.dashboard.toTheMarriageOf}
          </p>
          <p
            className={cx(
              "handwritten mt-1 leading-[0.95] text-paper",
              isHero ? "text-[clamp(1.85rem,7vw,2.45rem)]" : "text-[1.05rem]",
            )}
          >
            {wedding.couple.person1} & {wedding.couple.person2}
          </p>
          <p
            className={cx(
              "mt-3 font-medium uppercase tracking-[0.22em] text-paper/90",
              isHero ? "text-[0.7rem]" : "text-[0.48rem]",
            )}
          >
            {wedding.date.shortDisplay}
          </p>
        </div>
      </div>
    </>
  );

  const baseClass = cx(
    "relative overflow-hidden rounded-[3px] bg-lilac",
    "shadow-[0_22px_48px_rgba(120,101,143,0.38)]",
    "border border-lilac-deep/25",
    isHero ? "aspect-[3/4.15] w-[min(70vw,16.5rem)] sm:w-[17.5rem]" : "h-[7.75rem] w-[5.4rem]",
    className,
  );

  if (!interactive) {
    return <div className={baseClass}>{content}</div>;
  }

  return (
    <motion.button
      type="button"
      onClick={onOpen}
      aria-label={`Open wedding passport for ${wedding.couple.fullNames}`}
      className={cx(baseClass, "cursor-pointer touch-manipulation")}
      initial={false}
      animate={reduced || !idleFloat ? undefined : { y: [0, -5, 0] }}
      transition={
        reduced || !idleFloat
          ? undefined
          : { duration: 5.8, repeat: Infinity, ease: "easeInOut" }
      }
      whileHover={reduced ? undefined : { y: idleFloat ? -8 : -2, scale: 1.015 }}
      whileTap={reduced ? undefined : { scale: 0.985 }}
    >
      {content}
    </motion.button>
  );
}
