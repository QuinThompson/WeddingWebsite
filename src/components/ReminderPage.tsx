import Link from "next/link";
import { DetailPageShell } from "@/components/DetailPageShell";
import { ScrollReveal } from "@/components/ScrollReveal";
import { wedding } from "@/data/wedding";

export function ReminderPage() {
  return (
    <DetailPageShell title="FAQ" eyebrow="Before You Travel" tone="lilac">
      <div className="paper-card -mt-2 space-y-0 overflow-hidden border border-lilac/30">
        {wedding.reminders.map((reminder, index) => (
          <ScrollReveal key={reminder.id}>
            <article
              className={`px-5 py-5 sm:px-6 ${
                index !== wedding.reminders.length - 1 ? "border-b border-taupe/25" : ""
              }`}
            >
              <h2 className="display text-2xl text-lilac-deep">{reminder.title}</h2>
              {reminder.body ? (
                <p className="mt-2 text-sm leading-relaxed text-charcoal/85">{reminder.body}</p>
              ) : null}
              {reminder.href && reminder.linkLabel ? (
                <p className="mt-3">
                  <Link
                    href={reminder.href}
                    className="text-sm font-semibold uppercase tracking-[0.14em] text-lilac-deep underline underline-offset-4"
                  >
                    {reminder.linkLabel}
                  </Link>
                </p>
              ) : null}
            </article>
          </ScrollReveal>
        ))}
      </div>
    </DetailPageShell>
  );
}
