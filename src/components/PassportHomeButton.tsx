"use client";

import Link from "next/link";
import { wedding } from "@/data/wedding";
import { cx } from "@/lib/utils";

type PassportHomeButtonProps = {
  href?: string;
  label?: string;
  className?: string;
  light?: boolean;
};

export function PassportHomeButton({
  href = "/invite",
  label = "Back to Invitation",
  className,
  light = false,
}: PassportHomeButtonProps) {
  return (
    <Link
      href={href}
      aria-label={label}
      className={cx(
        "group inline-flex min-h-11 items-center gap-3 rounded-sm focus-visible:outline-none",
        className,
      )}
    >
      <span
        className={cx(
          "flex h-12 w-9 shrink-0 flex-col items-center justify-center rounded-[3px] text-[0.55rem] font-semibold uppercase tracking-[0.14em] shadow-[0_8px_18px_rgba(120,101,143,0.28)] transition-transform duration-300 group-hover:-translate-y-0.5",
          light
            ? "border border-paper/40 bg-paper text-lilac-deep"
            : "border border-lilac-deep/40 bg-lilac text-paper",
        )}
        aria-hidden
      >
        <span className="leading-none">{wedding.couple.initials.split(" & ")[0]}</span>
        <span className={cx("my-0.5 h-px w-4", light ? "bg-lilac-deep/50" : "bg-paper/70")} />
        <span className="leading-none">{wedding.couple.initials.split(" & ")[1]}</span>
      </span>
      <span
        className={cx(
          "text-sm font-medium underline-offset-4 group-hover:underline",
          light ? "text-paper" : "text-lilac-deep",
        )}
      >
        {label}
      </span>
    </Link>
  );
}
