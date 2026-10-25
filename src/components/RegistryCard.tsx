"use client";

import { ArrowRight, Gift, Heart } from "lucide-react";
import { DashboardNavLink } from "@/components/DashboardNavLink";
import { wedding } from "@/data/wedding";
import { cx } from "@/lib/utils";

type RegistryCardProps = {
  className?: string;
  rotate?: number;
};

function GiftSprig({ className, flip }: { className?: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 78 58"
      className={cx("h-3.5 w-5 text-lilac-deep/50", flip && "-scale-x-100", className)}
      aria-hidden
    >
      <path
        d="M8 48c16-3 30-14 52-34"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path d="M20 42c-7-7-5-15 2-17-3 8-1 13-2 17z" fill="currentColor" />
      <path d="M33 33c-8-6-5-15 3-16-2 8 0 13-3 16z" fill="currentColor" />
      <path d="M46 22c-7-7-2-15 6-15-1 8 0 12-6 15z" fill="currentColor" />
      <path d="M26 40c7-1 11 3 10 9-8-1-12-4-10-9z" fill="currentColor" opacity="0.85" />
    </svg>
  );
}

/** Polaroid-sized dashboard card that opens the gift registry. */
export function RegistryCard({ className, rotate = 3 }: RegistryCardProps) {
  return (
    <DashboardNavLink
      href="/invite/registry"
      ariaLabel={`${wedding.dashboard.registryTagEyebrow} ${wedding.dashboard.registryTagTitle}. ${wedding.dashboard.registryTagBody} ${wedding.dashboard.registryTagCta}`}
      style={{ transform: `rotate(${rotate}deg)` }}
      className={cx(
        "paper-card relative block w-[6.1rem] rounded-sm border border-taupe/30 p-1.5 pb-2 text-center shadow-[0_10px_22px_rgba(52,50,56,0.12)] transition-transform duration-300 focus-visible:outline-none",
        "min-[375px]:w-[6.7rem] min-[390px]:w-[7.1rem] sm:w-[7.5rem]",
        "max-[360px]:![transform:rotate(0deg)]",
        className,
      )}
    >
      <div className="flex aspect-[4/5] w-full flex-col items-center justify-between overflow-hidden bg-paper px-0.5 py-1">
        <div className="relative h-[1.85rem] w-full">
          <GiftSprig className="absolute left-0 top-1" />
          <GiftSprig flip className="absolute right-0 top-1" />
          <span className="absolute left-1/2 top-0 flex h-[1.65rem] w-[1.65rem] -translate-x-1/2 items-center justify-center rounded-full bg-[#efe6f4]">
            <Gift className="h-3 w-3 text-lilac-deep" strokeWidth={1.6} aria-hidden />
          </span>
          <Heart
            className="absolute bottom-0 left-1/2 h-2 w-2 -translate-x-1/2 text-lilac-deep/75"
            strokeWidth={1.6}
            aria-hidden
          />
        </div>

        <div>
          <p className="text-[0.38rem] font-medium uppercase tracking-[0.16em] text-lilac-deep">
            {wedding.dashboard.registryTagEyebrow}
          </p>
          <p className="handwritten text-[1.15rem] leading-none text-lilac-deep">
            {wedding.dashboard.registryTagTitle}
          </p>
        </div>

        <p className="display px-0.5 text-[0.42rem] leading-[1.15] text-charcoal/85">
          {wedding.dashboard.registryTagBody}
        </p>

        <span className="flex w-full items-center justify-center gap-0.5 rounded-full bg-lilac-deep px-1 py-1 text-[0.32rem] font-semibold uppercase tracking-[0.04em] text-paper shadow-[0_4px_8px_rgba(120,101,143,0.28)]">
          <Gift className="h-2 w-2 shrink-0" strokeWidth={1.7} aria-hidden />
          <span className="h-2 w-px shrink-0 bg-paper/75" aria-hidden />
          <span className="truncate">{wedding.dashboard.registryTagCta}</span>
          <ArrowRight className="h-2 w-2 shrink-0" aria-hidden />
        </span>
      </div>

      <div className="mt-1.5 flex h-[1.05rem] items-center gap-1 text-lilac-deep/40" aria-hidden>
        <span className="h-px flex-1 bg-current" />
        <Heart className="h-2 w-2" strokeWidth={1.6} />
        <span className="h-px flex-1 bg-current" />
      </div>
    </DashboardNavLink>
  );
}
