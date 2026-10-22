"use client";

import { useEffect, useState } from "react";
import { isMemoriesUnlocked } from "@/lib/memories";

export function useMemoriesUnlocked() {
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    const update = () => setUnlocked(isMemoriesUnlocked());
    update();
    const id = window.setInterval(update, 30_000);
    return () => window.clearInterval(id);
  }, []);

  return unlocked;
}
