import Image from "next/image";
import { DetailPageShell } from "@/components/DetailPageShell";
import { ScrollReveal } from "@/components/ScrollReveal";
import { wedding } from "@/data/wedding";

function Swatch({ name, hex }: { name: string; hex: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span
        className="h-12 w-12 rounded-full border border-charcoal/10 shadow-sm"
        style={{ backgroundColor: hex }}
        aria-hidden
      />
      <span className="text-center text-[0.7rem] text-charcoal/75">{name}</span>
    </div>
  );
}

export function AttireGuide() {
  const { attire } = wedding;

  return (
    <DetailPageShell title="Attire" eyebrow="Dress Code">
      <ScrollReveal className="paper-card border border-taupe/30 p-5 sm:p-6">
        <h2 className="display text-3xl text-lilac-deep">{attire.title}</h2>
        <p className="mt-3 text-sm leading-relaxed text-charcoal/85">{attire.explanation}</p>
      </ScrollReveal>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <ScrollReveal>
          <div className="relative aspect-[3/4] overflow-hidden bg-taupe/15">
            <Image
              src={attire.womenImage}
              alt={attire.womenImageAlt}
              fill
              sizes="(max-width: 640px) 100vw, 26rem"
              className="object-cover"
            />
          </div>
          <h3 className="display mt-4 text-2xl">For Women</h3>
          <p className="mt-2 text-sm leading-relaxed text-charcoal/85">{attire.womenGuidance}</p>
        </ScrollReveal>
        <ScrollReveal delay={0.08}>
          <div className="relative aspect-[3/4] overflow-hidden bg-taupe/15">
            <Image
              src={attire.menImage}
              alt={attire.menImageAlt}
              fill
              sizes="(max-width: 640px) 100vw, 26rem"
              className="object-cover"
            />
          </div>
          <h3 className="display mt-4 text-2xl">For Men</h3>
          <p className="mt-2 text-sm leading-relaxed text-charcoal/85">{attire.menGuidance}</p>
        </ScrollReveal>
      </div>

      <ScrollReveal className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="paper-card border border-taupe/30 p-5">
          <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-taupe">
            Fabric & Climate
          </h3>
          <p className="mt-3 text-sm leading-relaxed">{attire.fabricClimate}</p>
        </div>
        <div className="paper-card border border-taupe/30 p-5">
          <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-taupe">
            Footwear
          </h3>
          <p className="mt-3 text-sm leading-relaxed">{attire.footwear}</p>
        </div>
      </ScrollReveal>

      <ScrollReveal className="mt-10">
        <h3 className="display text-2xl">Colors Encouraged</h3>
        <div className="mt-5 flex flex-wrap gap-5">
          {attire.encouragedColors.map((color) => (
            <Swatch key={color.name} name={color.name} hex={color.hex} />
          ))}
        </div>
      </ScrollReveal>

      <ScrollReveal className="mt-10">
        <h3 className="display text-2xl">Colors to Avoid</h3>
        <div className="mt-5 flex flex-wrap gap-5">
          {attire.avoidColors.map((color) => (
            <Swatch key={color.name} name={color.name} hex={color.hex} />
          ))}
        </div>
      </ScrollReveal>
    </DetailPageShell>
  );
}
