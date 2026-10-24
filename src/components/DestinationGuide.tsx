import Link from "next/link";
import type { ReactNode } from "react";
import { DetailPageShell } from "@/components/DetailPageShell";
import { LinkedText } from "@/components/LinkedText";
import { ScrollReveal } from "@/components/ScrollReveal";
import { wedding } from "@/data/wedding";

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <ScrollReveal className="paper-card mb-5 border border-taupe/30 p-5">
      <h2 className="display text-2xl text-lilac-deep">{title}</h2>
      <div className="mt-3 text-sm leading-relaxed text-charcoal/85">{children}</div>
    </ScrollReveal>
  );
}

export function DestinationGuide() {
  const guide = wedding.destinationGuide;

  return (
    <DetailPageShell title="Destination Information" eyebrow="St Lucia">
      <Section title="Recommended Airport">
        <p>{guide.recommendedAirport}</p>
      </Section>
      <Section title="Airport Transfers">
        <p>{guide.airportTransfers}</p>
      </Section>
      <Section title="Hotel">
        <p>{guide.hotel}</p>
        <p className="mt-3">
          <LinkedText text={guide.bookingInstructions} />
        </p>
        <Link
          href={wedding.hotel.bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex min-h-11 items-center text-lilac-deep underline-offset-4 hover:underline"
        >
          Visit hotel booking page
        </Link>
      </Section>

      <Section title="Wedding questions">
        <p>
          <LinkedText text="For wedding questions, email Sarai Cairo, Reservations & Wedding Wizard, at weddings@cbayna.com and mention Shenice & Quinton’s wedding (May 12, 2027)." />
        </p>
      </Section>
    </DetailPageShell>
  );
}
