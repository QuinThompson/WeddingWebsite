"use client";

import { PolaroidCard } from "@/components/PolaroidCard";
import { wedding } from "@/data/wedding";
import { useMemoriesUnlocked } from "@/hooks/useMemoriesUnlocked";

type MemoriesPolaroidProps = {
  rotate?: number;
  className?: string;
};

export function MemoriesPolaroid({ rotate = -2, className }: MemoriesPolaroidProps) {
  const unlocked = useMemoriesUnlocked();

  return (
    <PolaroidCard
      href="/invite/memories"
      src={wedding.memories.placeholderImage}
      alt={wedding.memories.placeholderAlt}
      caption={wedding.dashboard.memoriesCaption}
      rotate={rotate}
      className={className}
      disabled={!unlocked}
      disabledLabel={wedding.dashboard.memoriesLockedLabel}
    />
  );
}
