"use client";

import Image from "next/image";
import { DashboardNavLink } from "@/components/DashboardNavLink";
import { cx } from "@/lib/utils";

type PolaroidCardProps = {
  href?: string;
  src: string;
  alt: string;
  caption: string;
  rotate?: number;
  className?: string;
  disabled?: boolean;
  disabledLabel?: string;
};

export function PolaroidCard({
  href = "#",
  src,
  alt,
  caption,
  rotate = -3,
  className,
  disabled = false,
  disabledLabel,
}: PolaroidCardProps) {
  const frameClass = cx(
    "paper-card relative block w-[6.1rem] rounded-sm border border-taupe/30 p-1.5 pb-2 shadow-[0_10px_22px_rgba(52,50,56,0.12)] transition-transform duration-300 focus-visible:outline-none min-[375px]:w-[6.7rem] min-[390px]:w-[7.1rem] sm:w-[7.5rem]",
    "max-[360px]:![transform:rotate(0deg)]",
    disabled && "cursor-not-allowed opacity-55 grayscale",
    !disabled && "group",
    className,
  );

  const body = (
    <>
      <div className="relative aspect-[4/5] overflow-hidden bg-taupe/20">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="120px"
          className={cx(
            "object-cover",
            !disabled && "transition-transform duration-500 group-hover:scale-[1.03]",
            disabled && "opacity-70",
          )}
        />
        {disabled ? (
          <span className="absolute inset-x-1 bottom-1 rounded-[2px] bg-charcoal/70 px-1 py-1 text-center text-[0.5rem] font-medium uppercase leading-tight tracking-[0.06em] text-paper">
            {disabledLabel ?? "Locked"}
          </span>
        ) : null}
      </div>
      <p className="handwritten mt-1.5 text-center text-[clamp(0.85rem,3.5vw,1.05rem)] leading-none text-charcoal">
        {caption}
      </p>
    </>
  );

  if (disabled) {
    return (
      <div
        className={frameClass}
        style={{ transform: `rotate(${rotate}deg)` }}
        aria-disabled="true"
        aria-label={`${caption}. ${disabledLabel ?? "Locked"}`}
      >
        {body}
      </div>
    );
  }

  return (
    <DashboardNavLink
      href={href}
      ariaLabel={caption}
      className={frameClass}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {body}
    </DashboardNavLink>
  );
}
