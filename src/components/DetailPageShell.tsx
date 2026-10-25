import type { ReactNode } from "react";
import { MarkDetailVisit } from "@/components/MarkDetailVisit";
import { PassportHomeButton } from "@/components/PassportHomeButton";
import { cx } from "@/lib/utils";

type DetailPageShellProps = {
  title: string;
  eyebrow?: string;
  children: ReactNode;
  className?: string;
  tone?: "ivory" | "lilac" | "sage";
};

export function DetailPageShell({
  title,
  eyebrow,
  children,
  className,
  tone = "ivory",
}: DetailPageShellProps) {
  const toneClass =
    tone === "lilac"
      ? "bg-[linear-gradient(180deg,#78658F_0%,#8d7aa4_18%,#e4dceb_52%,#f8f5ee_78%)]"
      : tone === "sage"
        ? "bg-[linear-gradient(180deg,#66745E_0%,#7f8d76_38%,#f8f5ee_38%)]"
        : "paper-texture";

  return (
    <main className={cx("min-h-dvh", toneClass)}>
      <MarkDetailVisit />
      <div className="safe-pad mx-auto invite-shell pb-16 pt-2">
        <div
          className={cx(
            "sticky top-0 z-20 -mx-1 mb-2 px-1 py-2 backdrop-blur-[6px]",
            tone === "ivory" ? "bg-ivory/85" : "bg-transparent",
          )}
        >
          <PassportHomeButton light={tone !== "ivory"} />
        </div>
        <header className="mb-6 mt-2">
          {eyebrow ? (
            <p
              className={cx(
                "text-[0.68rem] font-semibold uppercase tracking-[0.2em]",
                tone === "ivory" ? "text-taupe" : "text-paper/80",
              )}
            >
              {eyebrow}
            </p>
          ) : null}
          <h1
            className={cx(
              "display mt-1.5 text-[clamp(1.85rem,7vw,2.75rem)] leading-tight",
              tone === "ivory" ? "text-charcoal" : "text-paper",
            )}
          >
            {title}
          </h1>
        </header>
        <div className={cx("min-w-0", className)}>{children}</div>
      </div>
    </main>
  );
}
