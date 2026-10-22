"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useId, useRef } from "react";
import type { GalleryImage } from "@/data/wedding";

type LightboxProps = {
  images: GalleryImage[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
};

export function Lightbox({ images, index, onClose, onPrev, onNext }: LightboxProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchStartX = useRef<number | null>(null);
  const titleId = useId();
  const image = images[index];

  useEffect(() => {
    closeRef.current?.focus();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") onPrev();
      if (event.key === "ArrowRight") onNext();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose, onPrev, onNext]);

  if (!image) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/85 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl"
        onClick={(event) => event.stopPropagation()}
        onTouchStart={(event) => {
          touchStartX.current = event.changedTouches[0]?.clientX ?? null;
        }}
        onTouchEnd={(event) => {
          if (touchStartX.current == null) return;
          const delta = (event.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
          if (Math.abs(delta) > 50) {
            if (delta > 0) onPrev();
            else onNext();
          }
          touchStartX.current = null;
        }}
      >
        <p id={titleId} className="sr-only">
          {image.alt}
        </p>
        <div className="relative mx-auto aspect-[4/5] max-h-[75dvh] w-full overflow-hidden bg-charcoal sm:aspect-[16/10]">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 768px) 100vw, 48rem"
            className="object-contain"
            priority
            unoptimized={
              image.src.startsWith("data:") || image.src.startsWith("/api/memories/file/")
            }
          />
        </div>
        <div className="mt-4 flex items-center justify-between gap-3 text-paper">
          <button
            type="button"
            onClick={onPrev}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-sm bg-paper/10 hover:bg-paper/20"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <p className="text-sm tabular-nums">
            {index + 1} / {images.length}
          </p>
          <button
            type="button"
            onClick={onNext}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-sm bg-paper/10 hover:bg-paper/20"
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="absolute -top-2 right-0 inline-flex min-h-11 min-w-11 items-center justify-center rounded-sm bg-paper/10 text-paper hover:bg-paper/20"
          aria-label="Close gallery lightbox"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
