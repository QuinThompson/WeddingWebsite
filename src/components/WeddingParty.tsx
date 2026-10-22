import { DetailPageShell } from "@/components/DetailPageShell";
import { ScrollReveal } from "@/components/ScrollReveal";
import { wedding } from "@/data/wedding";

export function WeddingParty() {
  return (
    <DetailPageShell title="The Entourage" eyebrow="Wedding Party">
      <div className="space-y-8">
        {wedding.party.map((group, index) => (
          <ScrollReveal key={group.id} delay={index * 0.03}>
            <section className="border-b border-taupe/30 pb-8 last:border-b-0">
              <h2 className="display text-2xl text-lilac-deep sm:text-3xl">{group.title}</h2>
              <ul className="mt-4 space-y-3">
                {group.members.map((member) => (
                  <li key={`${group.id}-${member.name}`} className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="text-base text-charcoal">{member.name}</span>
                    {member.role ? (
                      <span className="text-xs uppercase tracking-[0.14em] text-taupe">
                        {member.role}
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </section>
          </ScrollReveal>
        ))}
      </div>
    </DetailPageShell>
  );
}
