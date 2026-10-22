"use client";

import { useEffect, useId, useState } from "react";
import { DetailPageShell } from "@/components/DetailPageShell";
import { wedding } from "@/data/wedding";
import {
  claimRegistryItem,
  listRegistryItems,
  replaceRegistryItems,
  seedRegistryItems,
  type RegistryItem,
} from "@/lib/store";

type RegistryResponse = {
  ok?: boolean;
  error?: string;
  stored?: "google-sheets" | "local-only";
  items?: RegistryItem[];
};

export function RegistryPage() {
  const formId = useId();
  const [items, setItems] = useState<RegistryItem[]>([]);
  const [usingGoogle, setUsingGoogle] = useState(false);
  const [loading, setLoading] = useState(true);
  const [claimNames, setClaimNames] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const response = await fetch("/api/registry", { cache: "no-store" });
        const data = (await response.json()) as RegistryResponse;
        if (cancelled) return;

        if (response.ok && data.stored === "google-sheets" && data.items) {
          setItems(data.items);
          setUsingGoogle(true);
          replaceRegistryItems(data.items);
        } else if (response.ok && data.stored === "local-only") {
          const local = listRegistryItems();
          setItems(local.length ? local : seedRegistryItems());
          setUsingGoogle(false);
        } else {
          const local = listRegistryItems();
          setItems(local.length ? local : seedRegistryItems());
          setUsingGoogle(false);
          setError(
            data.error ||
              "Could not reach Google Sheets. Showing local registry until the connection works.",
          );
        }
      } catch {
        if (!cancelled) {
          setItems(listRegistryItems());
          setUsingGoogle(false);
          setError("Could not reach Google Sheets. Showing local registry for now.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const available = items.filter((item) => !item.claimedBy);
  const claimed = items.filter((item) => item.claimedBy);

  const onClaim = async (id: string) => {
    setError(null);
    setMessage(null);
    const name = claimNames[id]?.trim() ?? "";
    if (!name) {
      setError("Enter your name before claiming a gift.");
      return;
    }

    setBusyId(id);
    try {
      if (usingGoogle) {
        const response = await fetch("/api/registry", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "claim", id, guestName: name }),
        });
        const data = (await response.json()) as RegistryResponse;
        if (!response.ok) {
          if (data.items) setItems(data.items);
          throw new Error(data.error || "That gift could not be claimed.");
        }
        if (data.items) {
          setItems(data.items);
          replaceRegistryItems(data.items);
        }
        setMessage(`Thank you, ${name}. That gift is now marked as yours.`);
      } else {
        const updated = claimRegistryItem(id, name);
        if (!updated) {
          throw new Error("That gift could not be claimed. It may already be taken.");
        }
        setItems(listRegistryItems());
        setMessage(`Thank you, ${updated.claimedBy}. “${updated.title}” is now marked as yours.`);
      }
      setClaimNames((current) => ({ ...current, [id]: "" }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Claim failed.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <DetailPageShell title={wedding.registry.title} eyebrow="Gifts">
      <p className="text-sm leading-relaxed text-charcoal/80">{wedding.registry.intro}</p>
      <section className="paper-card mt-5 border border-lilac/35 p-4 sm:p-5">
        <h2 className="display text-2xl text-lilac-deep">{wedding.registry.donation.heading}</h2>
        <p className="mt-2 text-sm leading-relaxed text-charcoal/80">{wedding.registry.donation.note}</p>
        <dl className="mt-4 space-y-2 text-sm">
          {wedding.registry.donation.details.map((detail) => (
            <div key={detail.label} className="grid grid-cols-[7.5rem_1fr] gap-3">
              <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-taupe">
                {detail.label}
              </dt>
              <dd className="text-charcoal">{detail.value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-sm leading-relaxed text-charcoal/80">
          {wedding.registry.donation.alternateBankNote}
        </p>
      </section>
      {/* <p className="mt-2 text-xs text-taupe">
        {usingGoogle
          ? "Claims sync live to your Google Sheet for every guest."
          : "Google Sheets is not connected yet — claims stay on this device only."}
      </p> */}

      <div aria-live="polite" className="mt-4 min-h-6 text-sm">
        {message ? <p className="text-sage-deep">{message}</p> : null}
        {error ? (
          <p className="text-[#8a3f3f]" role="alert">
            {error}
          </p>
        ) : null}
      </div>

      {loading ? (
        <p className="mt-6 text-sm text-charcoal/70">Loading registry…</p>
      ) : (
        <>
          <section className="mt-6">
            <h2 className="display text-2xl text-lilac-deep">{wedding.registry.availableHeading}</h2>
            {available.length === 0 ? (
              <p className="mt-3 text-sm text-charcoal/70">
                Every listed gift has been claimed. Thank you!
              </p>
            ) : (
              <ul className="mt-4 space-y-3">
                {available.map((item) => (
                  <li key={item.id} className="paper-card border border-taupe/35 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h3 className="display text-xl text-charcoal">{item.title}</h3>
                        {item.description ? (
                          <p className="mt-1 text-sm text-charcoal/75">{item.description}</p>
                        ) : null}
                        <p className="mt-2 text-xs uppercase tracking-[0.12em] text-taupe">
                          {item.storeLabel}
                          {item.priceLabel ? ` · ${item.priceLabel}` : ""}
                        </p>
                      </div>
                      <a
                        href={item.storeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-10 items-center text-sm font-medium text-lilac-deep underline underline-offset-2"
                      >
                        Open link
                      </a>
                    </div>

                    <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
                      <label className="sr-only" htmlFor={`${formId}-claim-${item.id}`}>
                        Your name for {item.title}
                      </label>
                      <input
                        id={`${formId}-claim-${item.id}`}
                        className="min-h-11 flex-1 rounded-sm border border-taupe/45 bg-paper px-3 text-sm"
                        placeholder="Your full name"
                        value={claimNames[item.id] ?? ""}
                        onChange={(event) =>
                          setClaimNames((current) => ({
                            ...current,
                            [item.id]: event.target.value,
                          }))
                        }
                      />
                      <button
                        type="button"
                        disabled={busyId === item.id}
                        onClick={() => void onClaim(item.id)}
                        className="inline-flex min-h-11 items-center justify-center rounded-sm bg-lilac-deep px-4 text-xs font-semibold uppercase tracking-[0.12em] text-paper disabled:opacity-70"
                      >
                        {busyId === item.id ? "Saving…" : wedding.registry.claimCta}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {claimed.length > 0 ? (
            <section className="mt-10">
              <h2 className="display text-2xl text-taupe">{wedding.registry.claimedHeading}</h2>
              <ul className="mt-4 space-y-3">
                {claimed.map((item) => (
                  <li
                    key={item.id}
                    className="rounded-sm border border-taupe/25 bg-[#f3f0ea] p-4 opacity-70 grayscale"
                  >
                    <h3 className="display text-xl text-charcoal line-through decoration-taupe/60">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm text-charcoal/80">Claimed</p>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </>
      )}
    </DetailPageShell>
  );
}
