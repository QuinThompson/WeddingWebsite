import { Heart } from "lucide-react";
import { DashboardNavLink } from "@/components/DashboardNavLink";
import { wedding } from "@/data/wedding";
import { cx } from "@/lib/utils";

type InvitationDocumentProps = {
  className?: string;
};

/** Open passport spread — stacks on very narrow screens, two pages from ~360px up. */
export function InvitationDocument({ className }: InvitationDocumentProps) {
  const boardingNo = wedding.date.shortDisplay.replace(/\./g, "");

  return (
    <article
      className={cx(
        "relative overflow-hidden rounded-sm border border-taupe/35 bg-paper shadow-[0_14px_32px_rgba(52,50,56,0.12)]",
        className,
      )}
    >
      <div className="grid w-full grid-cols-1 min-[360px]:grid-cols-2">
        {/* LEFT PAGE */}
        <div className="@container relative h-full min-h-[19rem] overflow-hidden border-b border-dashed border-[#c9bdd6] bg-[#FBF8F4] min-[360px]:border-b-0 min-[360px]:border-r">
          <img
            src="/images/lavender-watercolor-wash.png"
            alt=""
            aria-hidden
            className="pointer-events-none absolute left-[14%] top-[46%] z-0 w-[68%] object-contain [mask-image:radial-gradient(ellipse_at_center,#000_20%,transparent_70%)]"
          />
          <img
            src="/images/palm-top-left.png"
            alt=""
            aria-hidden
            className="pointer-events-none absolute left-0 top-0 z-[1] w-[27%] max-w-none object-contain object-left-top"
          />
          <img
            src="/images/palm-bottom-right.png"
            alt=""
            aria-hidden
            className="pointer-events-none absolute bottom-0 right-0 z-[1] w-[26%] max-w-none object-contain object-right-bottom"
          />

          <div className="pointer-events-none absolute left-[6%] top-[44%] z-[2] h-[32%] w-[88%]">
            <img
              src="/images/flight-path.svg"
              alt=""
              aria-hidden
              className="absolute bottom-[35%] left-[29%] w-[60%] origin-bottom-left -rotate-[10deg] object-contain object-left"
            />
            <div className="absolute bottom-[4%] left-0 flex w-[30%] flex-col items-center">
              <img
                src="/images/trinidad-outline.png"
                alt=""
                aria-hidden
                className="w-full object-contain"
              />
              <p className="display pointer-events-auto mt-0.5 text-center text-[clamp(0.4rem,2cqi,0.55rem)] font-medium uppercase tracking-[0.16em] text-[#8a7d96]">
                Trinidad
              </p>
            </div>
            <div className="absolute right-0 top-[-6%] flex w-[24%] flex-col items-center sm:top-[-20%]">
              <img
                src="/images/st-lucia-outline.png"
                alt=""
                aria-hidden
                className="w-[88%] object-contain"
              />
              <p className="display pointer-events-auto mt-1.5 text-center text-[clamp(0.4rem,2cqi,0.55rem)] font-medium uppercase tracking-[0.16em] text-[#8a7d96]">
                St Lucia
              </p>
            </div>
          </div>

          <img
            src="/images/invited-stamp.svg"
            alt=""
            aria-hidden
            className="pointer-events-none absolute bottom-[4%] left-[3.5%] z-[3] w-[16.5%] object-contain"
          />
          <svg
            viewBox="0 0 78 32"
            className="pointer-events-none absolute bottom-[7.5%] left-[20%] z-[3] w-[14%] text-[#b7a8cf]"
            aria-hidden
          >
            <path d="M2 8c6-6 10-6 16 0s10 6 16 0 10-6 16 0 10 6 16 0" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
            <path d="M2 16c6-6 10-6 16 0s10 6 16 0 10-6 16 0 10 6 16 0" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
            <path d="M2 24c6-6 10-6 16 0s10 6 16 0 10-6 16 0 10 6 16 0" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
          </svg>

          <div className="relative z-[3] flex h-full flex-col items-center px-[11%] pt-[9%] text-center">
            <p className="whitespace-nowrap text-[clamp(0.38rem,2.35cqi,0.62rem)] font-medium uppercase tracking-[0.12em] text-[#8d8794]">
              {wedding.dashboard.invitationEyebrow}
            </p>
            <h2 className="handwritten mt-[0.15em] max-w-full whitespace-nowrap text-[clamp(1.28rem,10.2cqi,2.7rem)] leading-none text-[#725588]">
              {wedding.couple.fullNames}
            </h2>
            <div className="mt-[0.55em] flex w-1/2 items-center gap-[0.4em] text-[#c4b4d4]" aria-hidden>
              <span className="h-px flex-1 bg-current" />
              <Heart className="h-[0.72em] w-[0.72em]" strokeWidth={1.35} />
              <span className="h-px flex-1 bg-current" />
            </div>
            <p className="display mt-[0.55em] text-[clamp(0.46rem,2.35cqi,0.68rem)] font-medium uppercase leading-[1.45] tracking-[0.14em] text-[#6f6878]">
              Two hearts. One journey.
              <br />
              A lifetime of love.
            </p>
          </div>

          <p className="display absolute bottom-[7.5%] left-[30%] z-[3] flex w-[62%] items-center gap-1 text-center text-[clamp(0.5rem,2.4cqi,0.78rem)] tracking-[0.02em] text-[#5e5868]">
            <span className="h-px min-w-2 flex-1 bg-[#cfc4dc]" aria-hidden />
            <span className="whitespace-nowrap">
              {wedding.destination.display}
              <span className="text-[#b7a8cf]"> · </span>
              {wedding.date.shortDisplay}
            </span>
            <span className="h-px min-w-3 flex-1 bg-[#cfc4dc]" aria-hidden />
          </p>

        </div>

        {/* RIGHT PAGE */}
        <div className="relative flex flex-col px-3 py-3 min-[360px]:px-2.5 min-[360px]:py-2.5 sm:px-3 sm:py-3">
          <div className="flex items-center gap-1.5">
            <span className="h-px flex-1 bg-taupe/45" aria-hidden />
            <p className="max-w-[70%] shrink-0 text-center text-[0.55rem] font-semibold uppercase leading-tight tracking-[0.08em] text-lilac-deep sm:max-w-none sm:tracking-[0.1em]">
              {wedding.dashboard.detailsHeading}
            </p>
            <span className="h-px flex-1 bg-taupe/45" aria-hidden />
          </div>

          <div className="mt-2.5 flex min-h-0 flex-1 flex-col">
            <dl className="grid min-w-0 flex-1 grid-cols-2 gap-x-2 gap-y-1 text-[0.58rem] uppercase tracking-[0.04em] sm:text-[0.6rem]">
              <div>
                <dt className="text-taupe">OCCASION</dt>
                <dd className="font-semibold text-charcoal">Wedding</dd>
              </div>
              <div>
                <dt className="text-taupe">DESTINATION</dt>
                <dd className="break-words font-semibold text-charcoal">
                  {wedding.destination.display}
                </dd>
              </div>
              <div>
                <dt className="text-taupe">WEDDING NO.</dt>
                <dd className="font-semibold text-charcoal">{boardingNo}</dd>
              </div>
              <div className="min-w-0">
                <dt className="text-taupe">THE COUPLE</dt>
                <dd className="break-words font-semibold normal-case tracking-normal text-charcoal">
                  {wedding.couple.fullNames}
                </dd>
              </div>
              <div>
                <dt className="text-taupe">THE BIG DAY</dt>
                <dd className="break-words font-semibold normal-case tracking-normal text-charcoal">
                  {wedding.date.display}
                </dd>
              </div>
              <div>
                <dt className="text-taupe">CEREMONY BEGINS</dt>
                <dd className="font-semibold normal-case tracking-normal text-charcoal">
                  {wedding.date.timeDisplay}
                </dd>
              </div>
              <div className="col-span-2 min-w-0">
                <dt className="text-taupe">VENUE</dt>
                <dd className="break-words font-semibold normal-case tracking-normal text-charcoal">
                  {wedding.hotel.name}
                </dd>
              </div>
            </dl>
            <p className="handwritten mt-3 text-center text-[1.05rem] leading-snug normal-case tracking-normal text-lilac-deep">
              One destination. Two hearts. A lifetime of love.
            </p>
          </div>

          <DashboardNavLink
            href="/invite/details"
            className="mt-2 inline-flex min-h-10 w-full items-center justify-center border-t border-taupe/30 pt-2 text-center text-[0.58rem] font-medium uppercase tracking-[0.06em] text-lilac-deep underline underline-offset-2 sm:text-[0.62rem]"
          >
            EXPLORE OUR WEDDING DETAILS
          </DashboardNavLink>
        </div>
      </div>
    </article>
  );
}
