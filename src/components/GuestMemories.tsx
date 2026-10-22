"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { DetailPageShell } from "@/components/DetailPageShell";
import { Lightbox } from "@/components/Lightbox";
import { ScrollReveal } from "@/components/ScrollReveal";
import { wedding } from "@/data/wedding";
import { useMemoriesUnlocked } from "@/hooks/useMemoriesUnlocked";
import {
  fetchGuestMemories,
  persistGuestMemory,
  type GuestMemory,
} from "@/lib/memories";
import { cx } from "@/lib/utils";

export function GuestMemories() {
  const unlocked = useMemoriesUnlocked();
  const inputId = useId();
  const [memories, setMemories] = useState<GuestMemory[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const close = useCallback(() => setActiveIndex(null), []);
  const prev = useCallback(() => {
    setActiveIndex((current) => {
      if (current == null) return current;
      return (current - 1 + memories.length) % memories.length;
    });
  }, [memories.length]);
  const next = useCallback(() => {
    setActiveIndex((current) => {
      if (current == null) return current;
      return (current + 1) % memories.length;
    });
  }, [memories.length]);

  useEffect(() => {
    if (!unlocked) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const result = await fetchGuestMemories();
        if (cancelled) return;
        setMemories(result.memories);
      } catch {
        if (!cancelled) setError("Could not load the guest gallery.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [unlocked]);

  useEffect(() => {
    if (activeIndex == null && triggerRef.current) {
      triggerRef.current.focus();
      triggerRef.current = null;
    }
  }, [activeIndex]);

  const onUpload = async (fileList: FileList | null) => {
    const file = fileList?.[0];
    if (!file || !unlocked) return;

    setStatus("uploading");
    setError(null);
    try {
      const result = await persistGuestMemory(file);
      setMemories(result.memories);
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Upload failed.");
    }
  };

  const lightboxImages = memories.map((memory) => ({
    src: memory.src,
    alt: memory.alt,
    orientation: "portrait" as const,
  }));

  return (
    <DetailPageShell title={wedding.memories.pageTitle} eyebrow={wedding.memories.pageEyebrow}>
      {!unlocked ? (
        <div className="paper-card border border-taupe/35 p-5 text-center sm:p-6">
          <p className="display text-2xl text-lilac-deep">Coming soon</p>
          <p className="mt-3 text-sm leading-relaxed text-charcoal/80">
            {wedding.memories.lockedMessage}
          </p>
          <div className="relative mx-auto mt-6 aspect-[4/5] w-40 overflow-hidden border border-taupe/30 bg-taupe/15 opacity-60 grayscale">
            <Image
              src={wedding.memories.placeholderImage}
              alt={wedding.memories.placeholderAlt}
              fill
              sizes="160px"
              className="object-cover"
            />
          </div>
        </div>
      ) : (
        <>
          <div className="paper-card border border-taupe/35 p-4 sm:p-5">
            <p className="text-sm leading-relaxed text-charcoal/80">
              {wedding.memories.liveMessage}
            </p>

            <p className="mt-4 text-sm leading-relaxed text-charcoal/80">
              {wedding.memories.driveBackupMessage}{" "}
              <a
                href={wedding.memories.driveFolderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-lilac-deep underline underline-offset-2"
              >
                {wedding.memories.driveBackupLinkLabel}
              </a>
            </p>

            <label
              htmlFor={inputId}
              className={cx(
                "mt-4 inline-flex min-h-11 cursor-pointer items-center justify-center rounded-sm bg-lilac-deep px-4 text-sm font-semibold uppercase tracking-[0.12em] text-paper",
                status === "uploading" && "opacity-70",
              )}
            >
              {status === "uploading" ? "Uploading…" : wedding.memories.uploadCta}
            </label>
            <input
              id={inputId}
              type="file"
              accept="image/*"
              className="sr-only"
              disabled={status === "uploading"}
              onChange={(event) => {
                void onUpload(event.target.files);
                event.currentTarget.value = "";
              }}
            />

            <div aria-live="polite" className="mt-3 min-h-5 text-sm">
              {error ? (
                <p className="text-[#8a3f3f]" role="alert">
                  {error}
                </p>
              ) : null}
            </div>
          </div>

          {loading ? (
            <p className="mt-8 text-center text-sm text-charcoal/70">Loading memories…</p>
          ) : memories.length === 0 ? (
            <p className="mt-8 text-center text-sm text-charcoal/70">
              {wedding.memories.emptyState}
            </p>
          ) : (
            <div className="mt-8 columns-2 gap-3 sm:gap-4 md:columns-3">
              {memories.map((memory, index) => (
                <ScrollReveal key={memory.id} className="mb-3 break-inside-avoid sm:mb-4">
                  <button
                    type="button"
                    className="group relative block w-full overflow-hidden bg-taupe/15 focus-visible:outline-none"
                    style={{ aspectRatio: "4 / 5" }}
                    onClick={(event) => {
                      triggerRef.current = event.currentTarget;
                      setActiveIndex(index);
                    }}
                    aria-label={`Open memory: ${memory.alt}`}
                  >
                    <Image
                      src={memory.src}
                      alt={memory.alt}
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </button>
                </ScrollReveal>
              ))}
            </div>
          )}

          {activeIndex != null ? (
            <Lightbox
              images={lightboxImages}
              index={activeIndex}
              onClose={close}
              onPrev={prev}
              onNext={next}
            />
          ) : null}
        </>
      )}
    </DetailPageShell>
  );
}
