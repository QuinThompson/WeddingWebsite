"use client";

import { useEffect } from "react";
import { markFromDetail } from "@/lib/session";

export function MarkDetailVisit() {
  useEffect(() => {
    markFromDetail();
    window.scrollTo(0, 0);
  }, []);

  return null;
}
