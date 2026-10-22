"use client";

import { wedding } from "@/data/wedding";
import { useCountdown } from "@/hooks/useCountdown";
import { cx } from "@/lib/utils";

type CountdownTicketProps = {
  className?: string;
};

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <div className="min-w-0 flex-1 text-center">
      <p className="display text-[clamp(1.35rem,5.5vw,1.85rem)] leading-none tabular-nums text-charcoal">
        {String(value).padStart(2, "0")}
      </p>
      <p className="mt-1 text-[0.52rem] uppercase tracking-[0.12em] text-taupe">{label}</p>
    </div>
  );
}

export function CountdownTicket({ className }: CountdownTicketProps) {
  const { days, hours, minutes, seconds, isComplete } = useCountdown(wedding.date.iso);

  return (
    <div
      className={cx(
        "overflow-hidden rounded-sm border border-sage/35 shadow-[0_10px_24px_rgba(102,116,94,0.16)]",
        className,
      )}
      aria-live="polite"
    >
      <div className="bg-[#7d8d70] px-3 py-2 text-center">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-paper">
          {wedding.dashboard.countdownHeading}
        </p>
      </div>
      <div className="paper-card px-2 py-3">
        {isComplete ? (
          <p className="handwritten text-center text-2xl text-charcoal">
            {wedding.dashboard.countdownComplete}
          </p>
        ) : (
          <div className="flex items-start justify-between gap-1">
            <Unit value={days} label="Days" />
            <span className="pt-1 text-taupe/70" aria-hidden>
              :
            </span>
            <Unit value={hours} label="Hours" />
            <span className="pt-1 text-taupe/70" aria-hidden>
              :
            </span>
            <Unit value={minutes} label="Minutes" />
            <span className="pt-1 text-taupe/70" aria-hidden>
              :
            </span>
            <Unit value={seconds} label="Seconds" />
          </div>
        )}
      </div>
    </div>
  );
}
