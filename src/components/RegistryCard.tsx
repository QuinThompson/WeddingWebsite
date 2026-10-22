"use client";

import { Gift } from "lucide-react";
import { DashboardNavLink } from "@/components/DashboardNavLink";
import { wedding } from "@/data/wedding";
import { cx } from "@/lib/utils";

type RegistryCardProps = {
  className?: string;
};

/** Luggage-tag style link to the gift registry. */
export function RegistryCard({ className }: RegistryCardProps) {
  return (
    <DashboardNavLink
      href="/invite/registry"
      ariaLabel={`${wedding.dashboard.registryTagEyebrow} ${wedding.dashboard.registryTagTitle}. ${wedding.dashboard.registryTagCta}`}
      className={cx(
        "group relative flex aspect-[3/4.1] w-[5.8rem] flex-col items-center overflow-hidden rounded-[4px] border border-charcoal/25 bg-[#F3F1EC] px-2 pb-3 pt-3 text-charcoal shadow-[0_10px_22px_rgba(52,50,56,0.1)] transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-none",
        "min-[375px]:w-[6.4rem] min-[390px]:w-[6.9rem] sm:w-[7.3rem]",
        className,
      )}
    >
      <span
        className="relative z-10 inline-flex h-8 w-8 items-center justify-center rounded-full bg-lilac/25 text-lilac-deep"
        aria-hidden
      >
        <Gift className="h-4 w-4" />
      </span>

      <div className="relative z-[1] mt-2 flex flex-1 flex-col items-center justify-center text-center">
        <p className="text-[0.55rem] font-semibold uppercase tracking-[0.18em] text-charcoal/70">
          {wedding.dashboard.registryTagEyebrow}
        </p>
        <p className="handwritten mt-1 text-[clamp(1.45rem,5.5vw,1.85rem)] leading-none text-charcoal">
          {wedding.dashboard.registryTagTitle}
        </p>
        <p className="mt-3 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-lilac-deep underline underline-offset-4">
          {wedding.dashboard.registryTagCta}
        </p>
      </div>
    </DashboardNavLink>
  );
}
