"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { LinkedText } from "@/components/LinkedText";
import type { FaqItem } from "@/data/wedding";
import { cx } from "@/lib/utils";

type FAQAccordionProps = {
  items: readonly FaqItem[];
};

export function FAQAccordion({ items }: FAQAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.question ?? null);

  return (
    <div className="divide-y divide-taupe/30 overflow-hidden rounded-sm border border-taupe/30 bg-paper">
      {items.map((item) => {
        const open = openId === item.question;
        return (
          <div key={item.question}>
            <h3>
              <button
                type="button"
                className="flex min-h-11 w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-medium text-charcoal"
                aria-expanded={open}
                onClick={() => setOpenId(open ? null : item.question)}
              >
                <span>{item.question}</span>
                <ChevronDown
                  className={cx(
                    "h-4 w-4 shrink-0 text-lilac-deep transition-transform duration-300",
                    open && "rotate-180",
                  )}
                  aria-hidden
                />
              </button>
            </h3>
            <div
              className={cx(
                "grid transition-[grid-template-rows] duration-300",
                open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <div className="px-4 pb-4 text-sm leading-relaxed text-charcoal/80">
                  {item.answer ? (
                    <p>
                      <LinkedText text={item.answer} />
                    </p>
                  ) : null}
                  {item.href && item.linkLabel ? (
                    <p className={item.answer ? "mt-3" : undefined}>
                      <Link
                        href={item.href}
                        className="font-semibold uppercase tracking-[0.14em] text-lilac-deep underline underline-offset-4"
                      >
                        {item.linkLabel}
                      </Link>
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
