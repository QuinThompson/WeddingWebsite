import { DashboardNavLink } from "@/components/DashboardNavLink";
import { cx } from "@/lib/utils";

type DashboardCardProps = {
  href: string;
  title: string;
  subtitle?: string;
  className?: string;
};

/** Compact page tab that tucks into the top of the mini passport. */
export function DashboardCard({ href, title, subtitle, className }: DashboardCardProps) {
  return (
    <DashboardNavLink
      href={href}
      ariaLabel={`${title}${subtitle ? `. ${subtitle}` : ""}`}
      className={cx(
        "group flex w-[6.5rem] flex-col overflow-hidden rounded-t-[3px] border border-b-0 border-taupe/40 bg-paper shadow-[0_-2px_10px_rgba(52,50,56,0.08)] focus-visible:outline-none min-[390px]:w-[7rem]",
        className,
      )}
    >
      <span className="bg-lilac px-1.5 py-1 text-center text-[0.55rem] font-semibold uppercase tracking-[0.06em] text-paper leading-none">
        {title}
      </span>
      <span className="bg-paper px-1.5 py-1 text-center text-[0.55rem] font-semibold uppercase tracking-[0.04em] text-lilac-deep underline decoration-lilac-deep decoration-solid underline-offset-[3px]">
        {subtitle}
      </span>
    </DashboardNavLink>
  );
}
