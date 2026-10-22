import Image from "next/image";
import Link from "next/link";
import { MapPin, Car } from "lucide-react";
import { DetailPageShell } from "@/components/DetailPageShell";
import { ScrollReveal } from "@/components/ScrollReveal";
import { wedding } from "@/data/wedding";

export function VenueGuide() {
  const venue = wedding.ceremony;

  return (
    <DetailPageShell title="Ceremony & Reception" eyebrow="Destination Guide">
      <ScrollReveal>
        <article className="overflow-hidden">
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-taupe/20">
            <Image
              src={venue.image}
              alt={venue.imageAlt}
              fill
              sizes="(max-width: 768px) 100vw, 52rem"
              className="object-cover"
            />
          </div>
          <div className="paper-card mt-0 border border-taupe/30 p-5 sm:p-6">
            <h2 className="display text-3xl text-charcoal">{venue.name}</h2>
            <p className="mt-2 flex items-start gap-2 text-sm text-charcoal/75">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sage-deep" aria-hidden />
              {venue.address}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-charcoal/85">{venue.description}</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-taupe">
                  Arrival
                </h3>
                <p className="mt-2 text-sm leading-relaxed">{venue.arrivalGuidance}</p>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-taupe">
                  Transportation
                </h3>
                <p className="mt-2 text-sm leading-relaxed">{venue.transportationNotes}</p>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={venue.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center rounded-sm bg-lilac-deep px-4 text-sm font-medium text-paper"
              >
                Open map
              </Link>
            </div>
          </div>
        </article>
      </ScrollReveal>

      <ScrollReveal className="mt-8">
        <Link
          href="/invite/destination"
          className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-lilac-deep underline-offset-4 hover:underline"
        >
          <Car className="h-4 w-4" aria-hidden />
          View transportation details
        </Link>
      </ScrollReveal>
    </DetailPageShell>
  );
}
