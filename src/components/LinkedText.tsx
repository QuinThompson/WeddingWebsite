import type { ReactNode } from "react";

const linkClass = "text-lilac-deep underline underline-offset-4";

const token =
  /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})|(https?:\/\/[^\s]+|www\.[^\s]+)|(\+?\d{1,3}[\s-]?)?(?:\(\d{3}\)[\s-]?|\d{3}[\s.-])\d{3}[\s.-]\d{4}/g;

function trimTrail(value: string) {
  const trail = value.match(/[.,);]+$/)?.[0] ?? "";
  return { core: value.slice(0, value.length - trail.length), trail };
}

/** Turns emails, phone numbers, and web addresses in a sentence into underlined links. */
export function LinkedText({ text }: { text: string }) {
  const nodes: ReactNode[] = [];
  let last = 0;

  for (const match of text.matchAll(token)) {
    const index = match.index ?? 0;
    if (index > last) nodes.push(text.slice(last, index));

    const raw = match[0];
    const { core, trail } = trimTrail(raw);
    const key = `${index}-${core}`;

    if (match[1]) {
      nodes.push(
        <a key={key} href={`mailto:${core}`} className={linkClass}>
          {core}
        </a>,
      );
    } else if (match[2]) {
      const href = core.startsWith("http") ? core : `https://${core}`;
      nodes.push(
        <a key={key} href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>
          {core}
        </a>,
      );
    } else {
      nodes.push(
        <a key={key} href={`tel:${core.replace(/[^\d+]/g, "")}`} className={linkClass}>
          {core}
        </a>,
      );
    }

    if (trail) nodes.push(trail);
    last = index + raw.length;
  }

  if (last < text.length) nodes.push(text.slice(last));
  return <>{nodes}</>;
}
