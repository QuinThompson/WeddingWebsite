"use client";

import { useEffect, useId, useState, type FormEvent } from "react";
import { cx } from "@/lib/utils";

type Step = "closed" | "code" | "question" | "sent";

export function GuestQuestionCard() {
  const formId = useId();
  const [step, setStep] = useState<Step>("closed");
  const [code, setCode] = useState("");
  const [household, setHousehold] = useState("");
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [question, setQuestion] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (window.location.hash === "#ask-a-question") setStep("code");
  }, []);

  const onLookup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const response = await fetch("/api/invitation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = (await response.json().catch(() => null)) as {
        error?: string;
        guest?: { household?: string; name?: string };
      } | null;
      if (!response.ok || !data?.guest) {
        throw new Error(data?.error || "That invitation code was not found.");
      }
      setHousehold(data.guest.household || "");
      setName(data.guest.name || data.guest.household || "");
      setStep("question");
    } catch (err) {
      setError(err instanceof Error ? err.message : "That invitation code was not found.");
    } finally {
      setBusy(false);
    }
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    if (!name.trim() || !question.trim() || (whatsapp.match(/\d/g) || []).length < 7) {
      setError("Please enter your name, your question, and a WhatsApp number.");
      return;
    }
    setBusy(true);
    try {
      const response = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invitationCode: code.trim(),
          name: name.trim(),
          question: question.trim(),
          whatsapp: whatsapp.trim(),
        }),
      });
      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) {
        throw new Error(data?.error || "Could not send your question. Please try again.");
      }
      setStep("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send your question. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section
      id="ask-a-question"
      className="paper-card mt-5 scroll-mt-20 border border-lilac/35 p-5 sm:p-6"
    >
      <h2 className="display text-2xl text-lilac-deep">Have a question?</h2>
      <p className="mt-2 text-sm leading-relaxed text-charcoal/80">
        Is there something you’d like to know? Simply send your question along with the WhatsApp number you’d like to be contacted on, and you’ll receive a response via WhatsApp. Your invitation code is required to submit a question.
      </p>

      {step === "closed" ? (
        <button
          type="button"
          className="mt-4 inline-flex min-h-11 items-center justify-center rounded-sm bg-lilac-deep px-5 text-sm font-semibold uppercase tracking-[0.16em] text-paper"
          onClick={() => {
            setError(null);
            setStep("code");
          }}
        >
          Submit a question
        </button>
      ) : null}

      {step === "code" ? (
        <form className="mt-4 space-y-3" onSubmit={onLookup} noValidate>
          <div>
            <label
              className="text-xs font-semibold uppercase tracking-[0.14em] text-taupe"
              htmlFor={`${formId}-code`}
            >
              Invitation code
            </label>
            <input
              id={`${formId}-code`}
              className={fieldClass(Boolean(error))}
              value={code}
              onChange={(event) => setCode(event.target.value)}
              autoComplete="off"
              autoCapitalize="characters"
            />
          </div>
          <button
            type="submit"
            disabled={busy || !code.trim()}
            className="inline-flex min-h-11 items-center justify-center rounded-sm bg-lilac-deep px-5 text-sm font-semibold uppercase tracking-[0.16em] text-paper disabled:opacity-70"
          >
            {busy ? "Checking…" : "Continue"}
          </button>
        </form>
      ) : null}

      {step === "question" ? (
        <form className="mt-4 space-y-4" onSubmit={onSubmit} noValidate>
          {household ? (
            <p className="text-sm text-charcoal/75">
              This invitation is for <span className="font-semibold text-charcoal">{household}</span>.
              Please rsvp for each guest on your invitation.
            </p>
          ) : null}
          <div>
            <label
              className="text-xs font-semibold uppercase tracking-[0.14em] text-taupe"
              htmlFor={`${formId}-name`}
            >
              Your name
            </label>
            <input
              id={`${formId}-name`}
              className={fieldClass(false)}
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="name"
            />
          </div>
          <div>
            <label
              className="text-xs font-semibold uppercase tracking-[0.14em] text-taupe"
              htmlFor={`${formId}-whatsapp`}
            >
              WhatsApp number
            </label>
            <input
              id={`${formId}-whatsapp`}
              className={fieldClass(false)}
              value={whatsapp}
              onChange={(event) => setWhatsapp(event.target.value)}
              autoComplete="tel"
              inputMode="tel"
              placeholder="Include your country code"
            />
          </div>
          <div>
            <label
              className="text-xs font-semibold uppercase tracking-[0.14em] text-taupe"
              htmlFor={`${formId}-question`}
            >
              Your question
            </label>
            <textarea
              id={`${formId}-question`}
              className={fieldClass(false)}
              rows={4}
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={busy}
            className="inline-flex min-h-11 items-center justify-center rounded-sm bg-lilac-deep px-5 text-sm font-semibold uppercase tracking-[0.16em] text-paper disabled:opacity-70"
          >
            {busy ? "Sending…" : "Submit question"}
          </button>
        </form>
      ) : null}

      {step === "sent" ? (
        <p className="mt-4 text-sm text-sage-deep">
          Thank you. We’ve received your question and will reply on WhatsApp.
        </p>
      ) : null}

      {error ? (
        <p className="mt-3 text-sm text-[#8a3f3f]" role="alert">
          {error}
        </p>
      ) : null}
    </section>
  );
}

function fieldClass(invalid: boolean) {
  return cx(
    "mt-2 w-full rounded-sm border bg-paper px-3 py-3 text-sm text-charcoal outline-none focus:border-lilac-deep",
    invalid ? "border-[#8a3f3f]" : "border-taupe/45",
  );
}
