import Image from "next/image";
import { AirplaneRoute, PostageStamp } from "@/components/DecorativeMarks";
import { DetailPageShell } from "@/components/DetailPageShell";
import { ScrollReveal } from "@/components/ScrollReveal";
import { wedding } from "@/data/wedding";
import { cx } from "@/lib/utils";

export function LoveStory() {
  return (
    <DetailPageShell title="Our Love Story" eyebrow="Chapters">
      <div className="space-y-14">
        {wedding.story.map((chapter, index) => {
          const imageFirst = chapter.imageSide === "left";
          return (
            <ScrollReveal key={chapter.id}>
              <article
                className={cx(
                  "grid items-center gap-6",
                  "md:grid-cols-2",
                )}
              >
                <div
                  className={cx(
                    "relative",
                    imageFirst ? "md:order-1" : "md:order-2",
                    index % 2 === 0 ? "-rotate-1" : "rotate-1",
                    "max-[360px]:rotate-0",
                  )}
                >
                  <div className="paper-card border border-taupe/35 p-2 pb-8 shadow-[0_16px_34px_rgba(52,50,56,0.12)]">
                    <div className="relative aspect-[4/5] overflow-hidden bg-taupe/15">
                      <Image
                        src={chapter.image}
                        alt={chapter.imageAlt}
                        fill
                        sizes="(max-width: 768px) 100vw, 26rem"
                        className="object-cover"
                      />
                    </div>
                    <p className="handwritten mt-3 text-center text-2xl text-charcoal">
                      {chapter.handwrittenLabel}
                    </p>
                  </div>
                  {index === 0 ? (
                    <PostageStamp className="absolute -right-2 -top-2" label="Story" />
                  ) : null}
                </div>

                <div className={cx(imageFirst ? "md:order-2" : "md:order-1")}>
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-lilac-deep">
                    Chapter {index + 1}
                  </p>
                  <h2 className="display mt-2 text-3xl text-charcoal">{chapter.title}</h2>
                  <div className="paper-card mt-4 border border-taupe/25 p-5">
                    <p className="text-sm leading-relaxed text-charcoal/85">{chapter.body}</p>
                  </div>
                  {index === wedding.story.length - 1 ? (
                    <AirplaneRoute className="mt-4 w-40 text-sage-deep/50" />
                  ) : null}
                </div>
              </article>
            </ScrollReveal>
          );
        })}
      </div>
    </DetailPageShell>
  );
}
