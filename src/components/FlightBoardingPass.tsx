import Image from "next/image";
import { Plane } from "lucide-react";
import { DashboardNavLink } from "@/components/DashboardNavLink";
import { wedding } from "@/data/wedding";
import { cx } from "@/lib/utils";

type FlightBoardingPassProps = {
  className?: string;
};

export function FlightBoardingPass({ className }: FlightBoardingPassProps) {
  return (
    <article
      className={cx(
        "overflow-hidden rounded-sm border border-lilac/40 shadow-[0_12px_28px_rgba(120,101,143,0.16)]",
        className,
      )}
    >
      <div className="flex items-center justify-between bg-lilac-deep px-3 py-2 text-paper">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em]">
          {wedding.dashboard.flightHeading}
        </p>
        <Plane className="h-3.5 w-3.5" aria-hidden />
      </div>

      <div className="paper-card grid grid-cols-1 gap-0 min-[380px]:grid-cols-[1fr_auto] sm:grid-cols-[1.2fr_auto_0.85fr]">
        <div className="min-w-0 p-3">
          <p className="handwritten text-lg leading-none text-lilac-deep">Join our journey</p>

          <div className="mt-2.5 space-y-1.5 text-[0.7rem]">
            <p className="break-words">
              <span className="font-semibold uppercase tracking-[0.12em] text-taupe">From</span>{" "}
              <span className="text-charcoal">{wedding.hotel.name}</span>
            </p>
            <p className="break-words">
              <span className="font-semibold uppercase tracking-[0.12em] text-taupe">To</span>{" "}
              <span className="text-charcoal">{wedding.ceremony.name}</span>
            </p>
          </div>

          <dl className="mt-3 grid grid-cols-2 gap-x-2 gap-y-1.5 text-[0.62rem]">
            <div>
              <dt className="uppercase tracking-[0.12em] text-taupe">Airport</dt>
              <dd className="font-medium">{wedding.airport.display}</dd>
            </div>
            <div>
              <dt className="uppercase tracking-[0.12em] text-taupe">Arrive by</dt>
              <dd className="font-medium">{wedding.travel.recommendedArrivalDisplay}</dd>
            </div>
            <div className="min-w-0">
              <dt className="uppercase tracking-[0.12em] text-taupe">Hotel</dt>
              <dd className="break-words font-medium">{wedding.hotel.name}</dd>
            </div>
            <div>
              <dt className="uppercase tracking-[0.12em] text-taupe">Book by</dt>
              <dd className="font-medium">{wedding.hotel.bookingDeadlineDisplay}</dd>
            </div>
          </dl>

          <DashboardNavLink
            href="/invite/destination"
            className="mt-2.5 inline-flex min-h-10 items-center text-[0.68rem] font-medium text-lilac-deep underline underline-offset-2"
          >
            Travel details
          </DashboardNavLink>
        </div>

        <div className="relative hidden w-[4.5rem] overflow-hidden border-x border-dashed border-taupe/40 sm:block">
          <Image
            src={wedding.images.coupleCover}
            alt={wedding.images.coupleCoverAlt}
            fill
            sizes="72px"
            className="object-cover"
          />
        </div>

        <DashboardNavLink
          href="/invite/rsvp"
          ariaLabel={`${wedding.dashboard.rsvpTitle}. ${wedding.dashboard.rsvpCta}`}
          className="group flex min-h-[5.5rem] flex-col border-t border-dashed border-taupe/45 bg-paper/80 focus-visible:outline-none min-[380px]:min-h-[7.5rem] min-[380px]:border-t-0 min-[380px]:border-l"
        >
          <span className="bg-lilac px-2 py-1.5 text-center text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-paper">
            {wedding.dashboard.rsvpCta}
          </span>
          <span className="flex flex-1 flex-col items-center justify-center gap-1 px-2 py-3 text-center">
            <span className="text-[0.68rem] leading-snug text-charcoal/80">
              {wedding.dashboard.rsvpTitle}
            </span>
            <span className="handwritten text-2xl leading-none text-lilac-deep" aria-hidden>
              ♡
            </span>
            <span className="text-[0.65rem] font-medium text-lilac-deep underline underline-offset-2">
              {wedding.dashboard.rsvpLink}
            </span>
          </span>
        </DashboardNavLink>
      </div>
    </article>
  );
}
