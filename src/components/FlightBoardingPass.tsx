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

      <div className="paper-card grid grid-cols-1 gap-0 sm:grid-cols-[minmax(0,1.15fr)_5.75rem_minmax(0,0.95fr)]">
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

        <div
          className="relative h-28 overflow-hidden border-y border-dashed border-taupe/40 sm:h-auto sm:border-x sm:border-y-0"
          aria-hidden
        >
          <Image
            src="/images/Dream-Blurred-Tropical-Beach.png"
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, 92px"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col bg-[#f7f4f8] text-center">
          <p className="bg-lilac/45 px-2 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-lilac-deep">
            {wedding.dashboard.rsvpCta}
          </p>
          <div className="flex flex-1 flex-col items-center justify-center px-3 py-4">
            <p className="handwritten text-[2rem] leading-none text-lilac-deep">
              {wedding.dashboard.rsvpHeadline}
            </p>
            <p className="mt-2 text-[0.72rem] leading-snug text-charcoal/80">
              {wedding.dashboard.rsvpLead}
            </p>
            <p className="mt-1.5 text-[0.72rem] font-medium leading-snug text-charcoal">
              {wedding.dashboard.rsvpPrompt}
              <br />
              {wedding.deadlines.rsvpDisplay}
            </p>
            <DashboardNavLink
              href="/invite/rsvp"
              ariaLabel={`${wedding.dashboard.rsvpButton}. ${wedding.dashboard.rsvpPrompt} ${wedding.deadlines.rsvpDisplay}`}
              className="mt-3 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-lilac-deep px-5 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-paper shadow-[0_8px_16px_rgba(120,101,143,0.28)] transition-transform hover:-translate-y-0.5 focus-visible:outline-none"
            >
              {wedding.dashboard.rsvpButton}
              <span aria-hidden>→</span>
            </DashboardNavLink>
            <div className="mt-4 flex w-full max-w-[9rem] items-center gap-2 text-lilac/80" aria-hidden>
              <span className="h-px flex-1 bg-current" />
              <span className="text-sm leading-none">♡</span>
              <span className="h-px flex-1 bg-current" />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
