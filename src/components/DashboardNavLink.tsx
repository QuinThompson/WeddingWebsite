"use client";

import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { saveDashboardScroll } from "@/lib/session";
import { cx } from "@/lib/utils";

type DashboardNavLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
} & Omit<ComponentProps<typeof Link>, "href" | "className" | "children" | "aria-label">;

export function DashboardNavLink({
  href,
  children,
  className,
  ariaLabel,
  onClick,
  ...rest
}: DashboardNavLinkProps) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className={cx(className)}
      onClick={(event) => {
        saveDashboardScroll();
        onClick?.(event);
      }}
      {...rest}
    >
      {children}
    </Link>
  );
}
