import { DashboardNavLink } from "@/components/DashboardNavLink";
import { wedding } from "@/data/wedding";
import { cx } from "@/lib/utils";

type ReminderTagProps = {
  className?: string;
};

function AirplaneWatermark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 160"
      className={cx("text-charcoal", className)}
      aria-hidden
      fill="currentColor"
    >
      {/* Top-down airliner silhouette */}
      <path d="M80 14c3.2 0 5.5 2 6.2 5.2l4.8 28.6 42 16.8c3.4 1.4 4.4 4.8 2.4 7.6l-5.6 7.4c-1.8 2.4-5.2 2.8-7.6 1L90 69.2V98l18.4 10.6c2.6 1.5 3.2 4.8 1.2 7l-6.4 7c-2 2.2-5.4 2-7.2-.4L80 104.8 63.8 122c-1.8 2.4-5.2 2.6-7.2.4l-6.4-7c-2-2.2-1.4-5.5 1.2-7L70 98V69.2L37.8 80.6c-2.4 1.8-5.8 1.4-7.6-1l-5.6-7.4c-2-2.8-1-6.2 2.4-7.6l42-16.8 4.8-28.6C74.5 16 76.8 14 80 14z" />
      <ellipse cx="80" cy="34" rx="5.5" ry="9" opacity="0.35" />
    </svg>
  );
}

/** Luggage-tag style link to the FAQ / reminders page. */
export function ReminderTag({ className }: ReminderTagProps) {
  return (
    <DashboardNavLink
      href="/invite/reminders"
      ariaLabel={`${wedding.dashboard.remindersEyebrow} ${wedding.dashboard.remindersTitle}. ${wedding.dashboard.remindersCta}`}
      className={cx(
        "group relative flex aspect-[3/4.1] w-[5.8rem] flex-col items-center overflow-hidden rounded-[4px] border border-charcoal/25 bg-[#F3F1EC] px-2 pb-3 pt-4 text-charcoal shadow-[0_10px_22px_rgba(52,50,56,0.1)] transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-none",
        "min-[375px]:w-[6.4rem] min-[390px]:w-[6.9rem] sm:w-[7.3rem]",
        className,
      )}
    >
      {/* Punch hole */}
      <span
        className="absolute left-1/2 top-2 z-10 h-3 w-3 -translate-x-1/2 rounded-full border border-charcoal/35 bg-ivory shadow-[inset_0_1px_2px_rgba(52,50,56,0.15)]"
        aria-hidden
      />

      <AirplaneWatermark className="pointer-events-none absolute bottom-2 left-1/2 h-[58%] w-[58%] -translate-x-1/2 rotate-[-28deg] opacity-[0.12]" />

      <div className="relative z-[1] mt-3 flex flex-1 flex-col items-center justify-center text-center">
        <p className="text-[0.55rem] font-semibold uppercase tracking-[0.18em] text-charcoal/70">
          {wedding.dashboard.remindersEyebrow}
        </p>
        <p className="handwritten mt-1 text-[clamp(1.45rem,5.5vw,1.85rem)] leading-none text-charcoal">
          {wedding.dashboard.remindersTitle}
        </p>
        <p className="mt-3 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-charcoal underline underline-offset-4 group-hover:text-lilac-deep">
          {wedding.dashboard.remindersCta}
        </p>
      </div>
    </DashboardNavLink>
  );
}
