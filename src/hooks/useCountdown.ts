"use client";

import { useEffect, useState } from "react";
import { formatCountdown } from "@/lib/utils";

export function useCountdown(targetIso: string) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const target = new Date(targetIso).getTime();
  return formatCountdown(target - now);
}
