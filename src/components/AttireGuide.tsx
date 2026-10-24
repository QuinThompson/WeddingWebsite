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
