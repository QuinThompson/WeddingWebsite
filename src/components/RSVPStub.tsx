import Link from "next/link";
import { wedding } from "@/data/wedding";
import { cx } from "@/lib/utils";

type RSVPStubProps = {
  className?: string;
};

export function RSVPStub({ className }: RSVPStubProps) {
  return (
    <Link
      href="/invite/rsvp"
      aria-label={`${wedding.dashboard.rsvpTitle}. ${wedding.dashboard.rsvpCta}`}
      className={cx(
        "group paper-card relative flex min-h-11 items-center justify-between gap-4 overflow-hidden rounded-sm border border-dashed border-lilac-deep/40 px-4 py-3 transition-colors hover:bg-lilac/10 focus-visible:outline-none",
        className,
      )}
    >
      <div className="absolute inset-y-2 left-0 w-px bg-[repeating-linear-gradient(180deg,#78658F_0_4px,transparent_4px_8px)]" aria-hidden />
      <div className="pl-2">
        <p className="text-sm text-charcoal/80">{wedding.dashboard.rsvpTitle}</p>
        <p className="display text-2xl text-lilac-deep">{wedding.dashboard.rsvpCta}</p>
      </div>
      <span className="rounded-sm bg-lilac-deep px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-paper transition-transform group-hover:-translate-y-0.5">
        Open
      </span>
    </Link>
  );
}
