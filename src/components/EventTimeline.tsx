"use client";

import {
  Church,
  Clock3,
  GlassWater,
  Heart,
  Sunrise,
  Wine,
  type LucideIcon,
} from "lucide-react";
import { DetailPageShell } from "@/components/DetailPageShell";
import { ScrollReveal } from "@/components/ScrollReveal";
import { wedding, type TimelineEvent } from "@/data/wedding";

const icons: Record<TimelineEvent["icon"], LucideIcon> = {
  arrival: Clock3,
  welcome: Heart,
  ceremony: Church,
  cocktail: GlassWater,
  reception: Wine,
  brunch: Sunrise,
};

export function EventTimeline() {
  return (
    <DetailPageShell title="Event Timeline">
      <ol className="relative space-y-0 pl-2">
        <div
          className="absolute bottom-4 left-[1.55rem] top-4 w-px bg-gradient-to-b from-lilac via-sage to-taupe"
          aria-hidden
        />
        {wedding.timeline.map((event, index) => {
          const Icon = icons[event.icon];
          return (
            <ScrollReveal key={event.id} delay={index * 0.04}>
              <li className="relative grid grid-cols-[3rem_1fr] gap-3 pb-8">
                <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-lilac/50 bg-paper text-lilac-deep shadow-sm">
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <article className="paper-card border border-taupe/30 p-4 sm:p-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h2 className="display text-2xl text-charcoal">{event.title}</h2>
                    <p className="text-xs font-medium uppercase tracking-[0.14em] text-lilac-deep">
                      {event.time}
                    </p>
                  </div>
                  <p className="mt-1 text-xs uppercase tracking-[0.14em] text-taupe">
                    {event.date} · {event.venue}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-charcoal/85">
                    {event.description}
                  </p>
                </article>
              </li>
            </ScrollReveal>
          );
        })}
      </ol>
    </DetailPageShell>
  );
}
