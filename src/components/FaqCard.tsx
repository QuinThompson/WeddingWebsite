"use client";

import { CircleHelp } from "lucide-react";
import { DashboardNavLink } from "@/components/DashboardNavLink";
import { wedding } from "@/data/wedding";
import { cx } from "@/lib/utils";

type FaqCardProps = {
  className?: string;
};

/** Full-width dashboard entry for FAQ (same layout as the former registry bar). */
export function FaqCard({ className }: FaqCardProps) {
  return (
    <DashboardNavLink
      href="/invite/reminders"
      ariaLabel={`${wedding.dashboard.remindersTitle}. ${wedding.dashboard.remindersCta}`}
      className={cx(
        "group paper-card relative flex min-h-[5.5rem] w-full items-center justify-between gap-3 overflow-hidden rounded-sm border border-lilac/40 px-4 py-3 shadow-[0_10px_24px_rgba(120,101,143,0.14)] transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-none",
        className,
      )}
    >
      <div className="absolute inset-y-0 left-0 w-1.5 bg-lilac" aria-hidden />
      <div className="pl-1">
        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-lilac-deep">
          Before you travel
        </p>
        <p className="display mt-1 text-2xl leading-none text-charcoal">
          {wedding.dashboard.remindersTitle}
        </p>
        <p className="mt-1.5 text-[0.72rem] font-medium text-charcoal underline underline-offset-2">
          {wedding.dashboard.remindersCta}
        </p>
      </div>
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-lilac/25 text-lilac-deep">
        <CircleHelp className="h-5 w-5" aria-hidden />
      </span>
    </DashboardNavLink>
  );
}
