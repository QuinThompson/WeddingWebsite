"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { DetailPageShell } from "@/components/DetailPageShell";
import { Lightbox } from "@/components/Lightbox";
import { ScrollReveal } from "@/components/ScrollReveal";
import { wedding } from "@/data/wedding";
import { cx } from "@/lib/utils";

export function PhotoGallery() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const images = wedding.gallery;

  const close = useCallback(() => {
    setActiveIndex(null);
  }, []);

  const prev = useCallback(() => {
    setActiveIndex((current) => {
      if (current == null) return current;
      return (current - 1 + images.length) % images.length;
    });
  }, [images.length]);

  const next = useCallback(() => {
    setActiveIndex((current) => {
      if (current == null) return current;
      return (current + 1) % images.length;
    });
  }, [images.length]);

  useEffect(() => {
    if (activeIndex == null && triggerRef.current) {
      triggerRef.current.focus();
      triggerRef.current = null;
    }
  }, [activeIndex]);

  return (
    <DetailPageShell title="Our Photos" eyebrow="Gallery">
      <div className="columns-2 gap-3 sm:gap-4 md:columns-3">
        {images.map((image, index) => (
          <ScrollReveal
            key={image.src}
            className={cx(
              "mb-3 break-inside-avoid sm:mb-4",
              image.orientation === "landscape" ? "max-sm:col-span-2" : "",
            )}
          >
            <button
              type="button"
              className="group relative block w-full overflow-hidden bg-taupe/15 focus-visible:outline-none"
              style={{
                aspectRatio: image.orientation === "landscape" ? "16 / 10" : "4 / 5",
              }}
              onClick={(event) => {
                triggerRef.current = event.currentTarget;
                setActiveIndex(index);
              }}
              aria-label={`Open image: ${image.alt}`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                loading="lazy"
              />
            </button>
          </ScrollReveal>
        ))}
      </div>

      {activeIndex != null ? (
        <Lightbox
          images={images}
          index={activeIndex}
          onClose={close}
          onPrev={prev}
          onNext={next}
        />
      ) : null}
    </DetailPageShell>
  );
}
