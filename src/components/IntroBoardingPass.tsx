import { wedding } from "@/data/wedding";
import { cx } from "@/lib/utils";

type IntroBoardingPassProps = {
  className?: string;
};

/** Vertical boarding pass tucked behind the closed passport. */
export function IntroBoardingPass({ className }: IntroBoardingPassProps) {
  return (
    <div
      className={cx(
        "relative aspect-[3/4.35] w-full overflow-hidden rounded-[2px] border border-taupe/40 bg-paper",
        "shadow-[0_14px_32px_rgba(52,50,56,0.16)]",
        className,
      )}
      aria-hidden
    >
      {/* Lilac boarding spine on the right */}
      <div className="absolute inset-y-0 right-0 z-10 flex w-[1.35rem] items-start justify-center bg-lilac-deep pt-5 sm:w-6">
        <span className="text-[0.58rem] font-semibold uppercase tracking-[0.28em] text-paper [writing-mode:vertical-rl] rotate-180">
          Boarding
        </span>
      </div>

      <div className="flex h-full pr-[1.35rem] sm:pr-6">
        {/* Vertical barcode strip */}
        <div className="flex w-8 shrink-0 flex-col items-center gap-[1.5px] border-r border-taupe/25 px-1.5 py-3 sm:w-9">
          {BARCODE_PATTERN.map((height, index) => (
            <span
              key={index}
              className="w-full bg-charcoal"
              style={{ height: `${height}px`, opacity: height > 2 ? 0.88 : 0.5 }}
            />
          ))}
        </div>

        <div className="relative min-w-0 flex-1 px-2.5 py-3 sm:px-3 sm:py-3.5">
          {/* Cancellation / postmark stamps */}
          <div className="absolute right-1 top-8 opacity-45">
            <div className="flex h-[3.1rem] w-[3.1rem] items-center justify-center rounded-full border-[1.5px] border-dashed border-lilac-deep/70">
              <div className="flex h-[2.15rem] w-[2.15rem] flex-col items-center justify-center rounded-full border border-lilac-deep/55 text-center">
                <span className="text-[0.42rem] font-semibold uppercase leading-none tracking-[0.06em] text-lilac-deep">
                  St Lucia
                </span>
                <span className="mt-0.5 text-[0.4rem] leading-none text-lilac-deep/85">
                  {wedding.date.shortDisplay}
                </span>
              </div>
            </div>
          </div>
          <div className="absolute right-6 top-[4.6rem] rotate-[-18deg] opacity-30">
            <div className="h-8 w-8 rounded-full border border-sage-deep/60" />
          </div>

          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-charcoal/70">
            To
          </p>
          <p className="display mt-1 text-[clamp(1.55rem,7vw,1.9rem)] leading-none tracking-wide text-charcoal">
            {wedding.destination.display.toUpperCase()}
          </p>
          <p className="mt-1.5 text-[0.62rem] font-medium uppercase tracking-[0.14em] text-charcoal/60">
            {wedding.airport.display}
          </p>

          <div className="mt-4 space-y-2.5 border-t border-dotted border-taupe/55 pt-3">
            <div>
              <p className="text-[0.52rem] uppercase tracking-[0.14em] text-taupe">Passenger</p>
              <p className="mt-1 border-b border-charcoal/20 pb-1 text-[0.7rem] text-charcoal/75">
                Wedding Guest
              </p>
            </div>
            <div>
              <p className="text-[0.52rem] uppercase tracking-[0.14em] text-taupe">Contact</p>
              <p className="mt-1 border-b border-charcoal/20 pb-1 text-[0.7rem] text-charcoal/75">
                Via RSVP
              </p>
            </div>
            <div className="flex justify-between gap-2 pt-1 text-[0.52rem] uppercase tracking-[0.12em] text-charcoal/55">
              <span>Date {wedding.date.shortDisplay}</span>
              <span>{wedding.date.timeDisplay}</span>
            </div>
          </div>

          {/* Lower ticket details (mostly hidden behind passport) */}
          <div className="mt-5 opacity-70">
            <p className="text-[0.5rem] uppercase tracking-[0.16em] text-taupe">Flight</p>
            <p className="mt-1 display text-lg leading-none text-charcoal/80">SQ-0512</p>
            <p className="mt-3 text-[0.5rem] uppercase tracking-[0.14em] text-taupe">Destination</p>
            <p className="mt-1 text-[0.72rem] font-medium text-charcoal/75">
              {wedding.ceremony.name}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom perforation */}
      <div className="absolute inset-x-0 bottom-3 h-px bg-[radial-gradient(circle,_#b8aa9c_1px,_transparent_1.1px)] bg-[length:6px_2px] opacity-60" />
    </div>
  );
}

const BARCODE_PATTERN = [
  1.5, 3, 1.5, 2, 4, 1.5, 3, 1.5, 2.5, 1.5, 4, 2, 1.5, 3, 1.5, 2, 3.5, 1.5, 2, 4, 1.5, 3, 2, 1.5,
  3, 1.5, 2.5, 4, 1.5, 2, 3, 1.5, 2, 1.5, 3.5, 2, 1.5, 3, 1.5, 2, 4, 1.5,
];
