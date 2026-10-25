import Link from "next/link";
import { Plane } from "lucide-react";
import { wedding } from "@/data/wedding";
import { cx } from "@/lib/utils";

type BoardingPassProps = {
  className?: string;
  compact?: boolean;
};

export function BoardingPass({ className, compact = false }: BoardingPassProps) {
  return (
    <article
      className={cx(
        "paper-card relative overflow-hidden rounded-sm border border-taupe/40",
        compact ? "p-3" : "p-4 sm:p-5",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-lilac-deep">
            Boarding Pass
          </p>
          <p className="mt-1 text-xs text-charcoal/70">Destination Wedding Travel</p>
        </div>
        <Plane className="h-4 w-4 text-sage-deep" aria-hidden />
      </div>

      <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-end gap-2">
        <div>
          <p className="text-[0.6rem] uppercase tracking-[0.16em] text-taupe">From</p>
          <p className="display text-2xl leading-none text-charcoal">
            {wedding.travel.originLabel}
          </p>
        </div>
        <div className="pb-1 text-taupe" aria-hidden>
          ✈
        </div>
        <div className="text-right">
          <p className="text-[0.6rem] uppercase tracking-[0.16em] text-taupe">To</p>
          <p className="display text-2xl leading-none text-charcoal">
            {wedding.travel.destinationCode}
          </p>
        </div>
      </div>

      <div className="my-4 h-px w-full bg-[repeating-linear-gradient(90deg,transparent,transparent_4px,rgba(184,170,156,0.7)_4px,rgba(184,170,156,0.7)_8px)]" />

      <dl className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-3">
        <div>
          <dt className="uppercase tracking-[0.14em] text-taupe">Destination</dt>
          <dd className="mt-1 font-medium">{wedding.travel.destinationCity}</dd>
        </div>
        <div>
          <dt className="uppercase tracking-[0.14em] text-taupe">Airport</dt>
          <dd className="mt-1 font-medium">{wedding.airport.display}</dd>
        </div>
        <div>
          <dt className="uppercase tracking-[0.14em] text-taupe">Arrive by</dt>
          <dd className="mt-1 font-medium">{wedding.travel.recommendedArrivalDisplay}</dd>
        </div>
        <div>
          <dt className="uppercase tracking-[0.14em] text-taupe">Hotel</dt>
          <dd className="mt-1 font-medium">{wedding.hotel.name}</dd>
        </div>
        <div>
          <dt className="uppercase tracking-[0.14em] text-taupe">Book by</dt>
          <dd className="mt-1 font-bold">{wedding.hotel.bookingDeadlineDisplay}</dd>
        </div>
        <div>
          <dt className="uppercase tracking-[0.14em] text-taupe">Reserve</dt>
          <dd className="mt-1">
            <Link
              href={wedding.hotel.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-lilac-deep underline-offset-2 hover:underline"
            >
              Booking link
            </Link>
          </dd>
        </div>
      </dl>
    </article>
  );
}
