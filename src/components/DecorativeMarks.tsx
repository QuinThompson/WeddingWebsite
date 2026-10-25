import { cx } from "@/lib/utils";

export function BotanicalMonogram({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={cx("text-lilac-deep/70", className)}
      aria-hidden
    >
      <circle cx="60" cy="60" r="46" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M60 22c8 14 8 28 0 42-8-14-8-28 0-42Zm0 34c12 6 22 16 26 28-14-2-28-10-26-28Zm0 0c-12 6-22 16-26 28 14-2 28-10 26-28Zm0-12c10 10 14 24 10 36-4-10-12-20-10-36Zm0 0c-10 10-14 24-10 36 4-10 12-20 10-36Z"
        fill="currentColor"
        opacity="0.55"
      />
      <circle cx="60" cy="60" r="3.5" fill="currentColor" />
    </svg>
  );
}

/** Passport-style destination stamp for the cover crest. */
export function PassportDestinationStamp({
  destination = "St Lucia",
  date,
  className,
}: {
  destination?: string;
  date?: string;
  className?: string;
}) {
  return (
    <div
      className={cx(
        "relative flex aspect-square flex-col items-center justify-center rounded-full border-[1.5px] border-dashed border-paper/75 text-paper",
        className,
      )}
      aria-hidden
    >
      <div className="absolute inset-[7%] rounded-full border border-paper/40" />
      <p className="relative z-[1] text-[0.55rem] font-semibold uppercase tracking-[0.22em] text-paper/90 sm:text-[0.62rem]">
        {destination}
      </p>
      <span className="relative z-[1] handwritten my-1 text-2xl leading-none text-paper/95 sm:text-[1.65rem]">
        ♡
      </span>
      {date ? (
        <p className="relative z-[1] text-[0.5rem] font-medium uppercase tracking-[0.18em] text-paper/80 sm:text-[0.55rem]">
          {date}
        </p>
      ) : null}
    </div>
  );
}

export function AirplaneRoute({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 220 40"
      className={cx("text-taupe", className)}
      fill="none"
      aria-hidden
    >
      <path
        className="route-line"
        d="M8 28 C50 8, 90 8, 120 20 S180 36, 212 14"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <circle cx="8" cy="28" r="2.5" fill="currentColor" />
      <path
        d="M206 10 l8 4 -8 4 2-4 -2-4z"
        fill="currentColor"
        transform="rotate(20 210 14)"
      />
    </svg>
  );
}

export function TornPaperEdge({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 18"
      preserveAspectRatio="none"
      className={cx("h-3 w-full text-ivory", className)}
      aria-hidden
    >
      <path
        d="M0 10 Q10 2 20 10 T40 10 T60 10 T80 10 T100 10 T120 10 T140 10 T160 10 T180 10 T200 10 T220 10 T240 10 T260 10 T280 10 T300 10 T320 10 T340 10 T360 10 T380 10 T400 10 V18 H0 Z"
        fill="currentColor"
      />
    </svg>
  );
}
