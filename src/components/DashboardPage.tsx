"use client";

import { useEffect, useState } from "react";
import { Dashboard } from "@/components/Dashboard";
import {
  clearDashboardScroll,
  consumeFromDetail,
  consumeOpeningTransition,
  restoreDashboardScroll,
} from "@/lib/session";

export function DashboardPage() {
  const [entrance, setEntrance] = useState<{
    ready: boolean;
    shortened: boolean;
    fromOpening: boolean;
    restoreScroll: boolean;
  }>({
    ready: false,
    shortened: false,
    fromOpening: false,
    restoreScroll: false,
  });

  useEffect(() => {
    const id = window.setTimeout(() => {
      const fromDetail = consumeFromDetail();
      const fromOpening = consumeOpeningTransition();

      if (fromDetail) {
        setEntrance({
          ready: true,
          shortened: true,
          fromOpening: false,
          restoreScroll: true,
        });
        return;
      }

      clearDashboardScroll();
      window.scrollTo(0, 0);
      setEntrance({
        ready: true,
        shortened: false,
        fromOpening,
        restoreScroll: false,
      });
    }, 0);

    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!entrance.ready || !entrance.restoreScroll) return;
    // Wait for shortened assemble to start before restoring scroll
    const id = window.setTimeout(() => restoreDashboardScroll(), 40);
    return () => window.clearTimeout(id);
  }, [entrance.ready, entrance.restoreScroll]);

  if (!entrance.ready) {
    return <div className="paper-texture min-h-dvh" aria-hidden />;
  }

  return (
    <Dashboard shortened={entrance.shortened} fromOpening={entrance.fromOpening} />
  );
}
