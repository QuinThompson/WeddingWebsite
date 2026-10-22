import { DashboardNavLink } from "@/components/DashboardNavLink";
import { WorldMapWatermark } from "@/components/WorldMapWatermark";
import { wedding } from "@/data/wedding";
import { cx } from "@/lib/utils";

type InvitationDocumentProps = {
  className?: string;
};

function InvitedStamp({ className }: { className?: string }) {
  return (
    <div
      className={cx(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-[1.5px] border-dashed border-lilac-deep/55 text-lilac-deep opacity-80 sm:h-11 sm:w-11",
        className,
      )}
      aria-hidden
    >
      <div className="flex h-8 w-8 flex-col items-center justify-center rounded-full border border-lilac-deep/45">
        <span className="text-[0.42rem] font-semibold uppercase tracking-[0.1em]">Invited</span>
        <span className="handwritten text-sm leading-none text-sage-deep">♡</span>
      </div>
    </div>
  );
}

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
      {/* Center fold — only when pages are side by side */}
      <div
        className="pointer-events-none absolute inset-y-0 left-1/2 z-20 hidden w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-taupe/50 to-transparent min-[360px]:block"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-2 left-1/2 z-10 hidden w-5 -translate-x-1/2 bg-gradient-to-r from-charcoal/[0.035] via-transparent to-charcoal/[0.035] min-[360px]:block"
        aria-hidden
      />

      <div className="grid w-full grid-cols-1 min-[360px]:grid-cols-2">
        {/* LEFT PAGE */}
        <div className="relative flex flex-col border-b border-taupe/25 px-3 py-3 min-[360px]:border-b-0 min-[360px]:border-r min-[360px]:border-taupe/20 min-[360px]:px-2.5 min-[360px]:py-2.5 sm:px-3 sm:py-3">
          <WorldMapWatermark className="absolute inset-0 h-full w-full opacity-70" />

          <div className="relative z-[1] flex h-full min-h-[9.5rem] flex-col min-[360px]:min-h-[12rem]">
            <p className="text-[0.55rem] font-medium uppercase tracking-[0.12em] text-charcoal/55">
              {wedding.dashboard.invitationEyebrow}
            </p>
            <h2 className="handwritten mt-1 text-[clamp(1.45rem,6vw,1.85rem)] leading-[0.95] text-lilac-deep">
              {wedding.couple.person1} & {wedding.couple.person2}
            </h2>

            <div className="mt-auto flex items-end pt-3">
              <InvitedStamp />
            </div>

            <p className="mt-2 text-[0.68rem] leading-snug text-charcoal/70">
              {wedding.destination.display}
              <span className="text-charcoal/40"> · </span>
              {wedding.date.shortDisplay}
            </p>
          </div>
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

          <div className="mt-2.5 flex min-h-0 flex-1">
            <dl className="min-w-0 flex-1 space-y-1 text-[0.58rem] uppercase tracking-[0.04em] sm:text-[0.6rem]">
              <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                <div>
                  <dt className="text-taupe">Type</dt>
                  <dd className="font-semibold text-charcoal">Wedding</dd>
                </div>
                <div>
                  <dt className="text-taupe">City</dt>
                  <dd className="break-words font-semibold text-charcoal">
                    {wedding.destination.display}
                  </dd>
                </div>
                <div>
                  <dt className="text-taupe">No.</dt>
                  <dd className="font-semibold text-charcoal">{boardingNo}</dd>
                </div>
              </div>
              <div className="min-w-0">
                <dt className="text-taupe">Name</dt>
                <dd className="break-words font-semibold normal-case tracking-normal text-charcoal">
                  {wedding.couple.fullNames}
                </dd>
              </div>
              <div>
                <dt className="text-taupe">Date</dt>
                <dd className="font-semibold normal-case tracking-normal text-charcoal">
                  {wedding.date.display}
                </dd>
              </div>
              <div>
                <dt className="text-taupe">Time</dt>
                <dd className="font-semibold normal-case tracking-normal text-charcoal">
                  {wedding.date.timeDisplay}
                </dd>
              </div>
              <div className="min-w-0">
                <dt className="text-taupe">Location</dt>
                <dd className="break-words font-semibold normal-case tracking-normal text-charcoal">
                  {wedding.hotel.name}
                </dd>
              </div>
            </dl>
          </div>

          <DashboardNavLink
            href="/invite/details"
            className="mt-2 inline-flex min-h-10 w-full items-center justify-center border-t border-taupe/30 pt-2 text-center text-[0.58rem] font-medium uppercase tracking-[0.06em] text-lilac-deep underline underline-offset-2 sm:text-[0.62rem]"
          >
            For more details click here
          </DashboardNavLink>
        </div>
      </div>
    </article>
  );
}
