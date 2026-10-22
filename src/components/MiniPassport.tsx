import { BotanicalMonogram } from "@/components/DecorativeMarks";
import { wedding } from "@/data/wedding";
import { cx } from "@/lib/utils";

type MiniPassportProps = {
  className?: string;
};

export function MiniPassport({ className }: MiniPassportProps) {
  const monogram = `${wedding.couple.person1[0]}${wedding.couple.person2[0]}`;

  return (
    <div
      className={cx(
        "relative flex h-full min-h-0 w-full flex-col items-center justify-between overflow-hidden rounded-[3px] border border-lilac-deep/30 bg-lilac px-2 py-2 text-center text-paper shadow-[0_14px_28px_rgba(120,101,143,0.32)]",
        className,
      )}
      aria-label="Wedding passport"
    >
      <div className="absolute inset-y-0 left-0 w-1.5 bg-lilac-deep/40" aria-hidden />
      <div className="shrink-0">
        <p className="handwritten text-[0.95rem] leading-none">Wedding</p>
        <p className="mt-0.5 text-[0.45rem] font-semibold uppercase tracking-[0.2em] text-paper/90">
          Passport
        </p>
      </div>
      <div className="relative shrink-0">
        <BotanicalMonogram className="h-8 w-8 text-paper/85" />
        <span className="absolute inset-0 flex items-center justify-center display text-[0.68rem] font-semibold tracking-[0.06em]">
          {monogram}
        </span>
      </div>
      <div className="shrink-0">
        <p className="text-[0.4rem] uppercase tracking-[0.1em] text-paper/80">
          {wedding.dashboard.toTheMarriageOf}
        </p>
        <p className="handwritten mt-0.5 text-[0.9rem] leading-none">
          {wedding.couple.person1} & {wedding.couple.person2}
        </p>
        <p className="mt-1 text-[0.45rem] uppercase tracking-[0.12em] text-paper/90">
          {wedding.date.shortDisplay}
        </p>
      </div>
    </div>
  );
}
