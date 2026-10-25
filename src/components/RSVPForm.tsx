"use client";

import { useId, useState, type FormEvent } from "react";
import { DetailPageShell } from "@/components/DetailPageShell";
import { wedding } from "@/data/wedding";
import {
  buildRsvpPartyFields,
  plusOneCounts,
  plusOneTag,
  type InvitationAllowance,
  type RsvpAdultGuest,
  type RsvpChildGuest,
  type RsvpPayload,
} from "@/lib/rsvp";
import { saveRsvp } from "@/lib/store";
import { cx } from "@/lib/utils";

type FormState = {
  fullName: string;
  email: string;
  mobile: string;
  attending: "yes" | "no" | "";
  hotelStatus: string;
  message: string;
  adults: RsvpAdultGuest[];
  children: RsvpChildGuest[];
};

type FormErrors = Partial<Record<keyof FormState, string>> & {
  adults?: string;
  children?: string;
};

const emptyAdult = (): RsvpAdultGuest => ({
  name: "",
});

const emptyChild = (): RsvpChildGuest => ({
  name: "",
  age: "",
});

const initialState: FormState = {
  fullName: "",
  email: "",
  mobile: "",
  attending: "",
  hotelStatus: "",
  message: "",
  adults: [],
  children: [],
};

function validate(values: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!values.fullName.trim()) errors.fullName = "Please enter your full name.";
  if (!values.email.trim()) errors.email = "Please enter your email.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Please enter a valid email address.";
  }
  if (!values.mobile.trim()) errors.mobile = "Please enter a mobile number.";
  if (!values.attending) errors.attending = "Please tell us if you are attending.";

  if (values.attending === "yes") {
    if (!values.hotelStatus) errors.hotelStatus = "Select your hotel status.";

    for (const adult of values.adults) {
      if (!adult.name.trim()) {
        errors.adults = "Each additional adult needs a name.";
        break;
      }
    }
    for (const child of values.children) {
      const ageNum = Number(child.age);
      if (!child.name.trim() || !child.age.trim() || Number.isNaN(ageNum) || ageNum < 0 || ageNum > 17) {
        errors.children = "Each child needs a name and age (0–17).";
        break;
      }
    }
  }
  return errors;
}

function toPayload(values: FormState, invitation: InvitationAllowance): RsvpPayload {
  const adults =
    values.attending === "yes"
      ? values.adults.map((adult) => ({
          name: adult.name.trim(),
        }))
      : [];
  const children =
    values.attending === "yes"
      ? values.children.map((child) => ({
          name: child.name.trim(),
          age: child.age.trim(),
        }))
      : [];

  const fullName = values.fullName.trim();

  const party =
    values.attending === "yes"
      ? buildRsvpPartyFields({
          fullName,
          adults,
          children,
        })
      : {
          guestCount: "0",
          adultCount: "0",
          childCount: "0",
          guestNames: "",
          adultsDetail: "",
          childrenDetail: "",
        };

  const plusOnes =
    values.attending === "yes"
      ? plusOneCounts(invitation, Number(party.adultCount), Number(party.childCount))
      : { plusOneAdults: 0, plusOneChildren: 0 };

  return {
    invitationCode: invitation.code,
    household: invitation.household,
    allowedAdults: String(invitation.allowedAdults),
    allowedChildren: String(invitation.allowedChildren),
    plusOneAdults: String(plusOnes.plusOneAdults),
    plusOneChildren: String(plusOnes.plusOneChildren),
    fullName,
    email: values.email.trim(),
    mobile: values.mobile.trim(),
    attending: values.attending === "no" ? "no" : "yes",
    hotelStatus: values.attending === "yes" ? values.hotelStatus : "",
    message: values.message.trim(),
    adults,
    children,
    ...party,
  };
}

async function lookupInvitation(code: string): Promise<InvitationAllowance> {
  const response = await fetch("/api/invitation", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });
  const data = (await response.json().catch(() => null)) as {
    error?: string;
    guest?: InvitationAllowance;
  } | null;
  if (!response.ok || !data?.guest) {
    throw new Error(data?.error || "That invitation code was not found.");
  }
  return data.guest;
}

async function submitRsvp(values: FormState, invitation: InvitationAllowance): Promise<void> {
  const payload = toPayload(values, invitation);

  const response = await fetch("/api/rsvp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(data?.error || "RSVP request failed");
  }

  saveRsvp(payload);
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1 text-xs text-[#8a3f3f]" role="alert">
      {message}
    </p>
  );
}

export function RSVPForm() {
  const formId = useId();
  const [values, setValues] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [notedPlusOne, setNotedPlusOne] = useState(false);
  const [code, setCode] = useState("");
  const [invitation, setInvitation] = useState<InvitationAllowance | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [lookupStatus, setLookupStatus] = useState<"idle" | "loading">("idle");

  const partyTotal =
    values.attending === "yes" ? 1 + values.adults.length + values.children.length : 0;

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setStatus("idle");
      return;
    }

    if (!invitation) return;

    const plusOnes = plusOneCounts(
      invitation,
      values.attending === "yes" ? 1 + values.adults.length : 0,
      values.attending === "yes" ? values.children.length : 0,
    );

    setStatus("loading");
    setSubmitError(null);
    try {
      await submitRsvp(values, invitation);
      setNotedPlusOne(plusOnes.paidAdults + plusOnes.paidChildren > 0);
      setStatus("success");
      setValues(initialState);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Something went wrong while sending your RSVP. Please try again.",
      );
      setStatus("error");
    }
  };

  const onLookup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLookupError(null);
    setLookupStatus("loading");
    try {
      const guest = await lookupInvitation(code);
      setInvitation(guest);
      setStatus("idle");
      setSubmitError(null);
    } catch (err) {
      setLookupError(
        err instanceof Error ? err.message : "That invitation code was not found.",
      );
    } finally {
      setLookupStatus("idle");
    }
  };

  const set =
    (key: keyof FormState) =>
    (value: string) => {
      setValues((current) => ({ ...current, [key]: value }));
    };

  const updateAdult = (index: number, patch: Partial<RsvpAdultGuest>) => {
    setValues((current) => ({
      ...current,
      adults: current.adults.map((adult, i) => (i === index ? { ...adult, ...patch } : adult)),
    }));
  };

  const updateChild = (index: number, patch: Partial<RsvpChildGuest>) => {
    setValues((current) => ({
      ...current,
      children: current.children.map((child, i) => (i === index ? { ...child, ...patch } : child)),
    }));
  };

  if (!invitation) {
    return (
      <DetailPageShell title="RSVP" eyebrow="Confirm Attendance">
        <div className="paper-card relative overflow-hidden border border-lilac/35 p-5 sm:p-6">
          <div className="absolute inset-y-0 left-0 w-3 ticket-perforation bg-lilac/25" aria-hidden />
          <div className="pl-3">
            <p className="text-sm text-charcoal/75">
              Enter the invitation code from your invite. Only guests on our list can RSVP.
            </p>
            <form className="mt-6 space-y-4" onSubmit={onLookup} noValidate>
              <div>
                <label
                  className="text-xs font-semibold uppercase tracking-[0.14em] text-taupe"
                  htmlFor={`${formId}-code`}
                >
                  Invitation code
                </label>
                <input
                  id={`${formId}-code`}
                  className={inputClass(lookupError ? "code" : undefined)}
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                  autoComplete="off"
                  autoCapitalize="characters"
                />
              </div>
              <button
                type="submit"
                disabled={lookupStatus === "loading" || !code.trim()}
                className="inline-flex min-h-11 items-center justify-center rounded-sm bg-lilac-deep px-5 text-sm font-semibold uppercase tracking-[0.16em] text-paper disabled:opacity-70"
              >
                {lookupStatus === "loading" ? "Checking…" : "Continue"}
              </button>
              {lookupError ? (
                <p className="text-sm text-[#8a3f3f]" role="alert">
                  {lookupError}
                </p>
              ) : null}
            </form>
          </div>
        </div>
      </DetailPageShell>
    );
  }

  const adultTotal = values.attending === "yes" ? 1 + values.adults.length : 0;
  const childTotal = values.attending === "yes" ? values.children.length : 0;
  const plusOnes = plusOneCounts(invitation, adultTotal, childTotal);
  const nextAdultTag = plusOneTag(invitation, "adult", values.adults.length, adultTotal);
  const nextChildTag = plusOneTag(invitation, "child", values.children.length, adultTotal);

  return (
    <DetailPageShell title="RSVP" eyebrow="Confirm Attendance">
      <div className="paper-card relative overflow-hidden border border-lilac/35 p-5 sm:p-6">
        <div className="absolute inset-y-0 left-0 w-3 ticket-perforation bg-lilac/25" aria-hidden />
        <div className="pl-3">
          <p className="text-sm text-charcoal/75">
            Kindly reply by <span className="font-bold text-charcoal">{wedding.deadlines.rsvpDisplay}</span>. This invitation is for{" "}
            <span className="font-semibold text-charcoal">{invitation.household}</span>.
          </p>
          <p className="mt-3 rounded-sm border border-lilac/30 bg-lilac/10 px-3 py-2 text-sm leading-relaxed text-charcoal/85">
            Our invitation includes {invitation.allowedAdults}{" "}
            {invitation.allowedAdults === 1 ? "adult" : "adults"} (including yourself) and{" "}
            {invitation.allowedChildren}{" "}
            {invitation.allowedChildren === 1 ? "child" : "children"}.
            {invitation.plusOneAllowed
              ? " One additional guest is included. A further guest is welcome at your own expense."
              : " You’re welcome to bring an additional guest at your own expense."}{" "}
            Payment is due by{" "}
            <span className="font-bold text-charcoal">{wedding.deadlines.guestPaymentDisplay}</span>
            , or their spot will be canceled.
          </p>
          <button
            type="button"
            className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-lilac-deep underline underline-offset-2"
            onClick={() => {
              setInvitation(null);
              setValues(initialState);
              setErrors({});
              setStatus("idle");
              setSubmitError(null);
            }}
          >
            Use a different code
          </button>
        </div>

        <form className="relative mt-6 space-y-5 pl-3" onSubmit={onSubmit} noValidate>
          <section className="space-y-5">
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-lilac-deep">
              Your contact details
            </h2>
            <div>
              <label
                className="text-xs font-semibold uppercase tracking-[0.14em] text-taupe"
                htmlFor={`${formId}-name`}
              >
                Your full name
              </label>
              <input
                id={`${formId}-name`}
                className={inputClass(errors.fullName)}
                value={values.fullName}
                onChange={(e) => set("fullName")(e.target.value)}
                autoComplete="name"
                aria-invalid={Boolean(errors.fullName)}
              />
              <FieldError id={`${formId}-name-error`} message={errors.fullName} />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  className="text-xs font-semibold uppercase tracking-[0.14em] text-taupe"
                  htmlFor={`${formId}-email`}
                >
                  Email
                </label>
                <input
                  id={`${formId}-email`}
                  type="email"
                  className={inputClass(errors.email)}
                  value={values.email}
                  onChange={(e) => set("email")(e.target.value)}
                  autoComplete="email"
                />
                <FieldError id={`${formId}-email-error`} message={errors.email} />
              </div>
              <div>
                <label
                  className="text-xs font-semibold uppercase tracking-[0.14em] text-taupe"
                  htmlFor={`${formId}-mobile`}
                >
                  Mobile number
                </label>
                <input
                  id={`${formId}-mobile`}
                  type="tel"
                  className={inputClass(errors.mobile)}
                  value={values.mobile}
                  onChange={(e) => set("mobile")(e.target.value)}
                  autoComplete="tel"
                />
                <FieldError id={`${formId}-mobile-error`} message={errors.mobile} />
              </div>
            </div>
          </section>

          <fieldset>
            <legend className="text-xs font-semibold uppercase tracking-[0.14em] text-taupe">
              Will you attend?
            </legend>
            <div className="mt-3 flex flex-wrap gap-3">
              {wedding.rsvp.attendingOptions.map((option) => (
                <label
                  key={option.value}
                  className={cx(
                    "inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-sm border px-3 text-sm",
                    values.attending === option.value
                      ? "border-lilac-deep bg-lilac/20"
                      : "border-taupe/40 bg-paper",
                  )}
                >
                  <input
                    type="radio"
                    name="attending"
                    value={option.value}
                    checked={values.attending === option.value}
                    onChange={(e) => set("attending")(e.target.value)}
                  />
                  {option.label}
                </label>
              ))}
            </div>
            <FieldError id={`${formId}-attending-error`} message={errors.attending} />
          </fieldset>

          {values.attending === "yes" ? (
            <>
              <section className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-lilac-deep">
                    Additional adults
                  </h2>
                  <button
                    type="button"
                    className="text-xs font-semibold uppercase tracking-[0.12em] text-lilac-deep underline underline-offset-2"
                    onClick={() =>
                      setValues((current) => ({
                        ...current,
                        adults: [...current.adults, emptyAdult()],
                      }))
                    }
                  >
                    {nextAdultTag === "included"
                      ? "+ Add included plus-one"
                      : nextAdultTag === "paid"
                        ? "+ Add paid plus-one"
                        : "+ Add adult"}
                  </button>
                </div>
                <p className="text-xs text-charcoal/65">
                  Other adults on this invitation, not including yourself. Anyone beyond the{" "}
                  {invitation.allowedAdults} included {invitation.allowedAdults === 1 ? "adult" : "adults"} is
                  a plus-one.
                </p>
                {values.adults.length === 0 ? (
                  <p className="text-sm text-taupe">No additional adults added.</p>
                ) : (
                  <ul className="space-y-4">
                    {values.adults.map((adult, index) => (
                      <li
                        key={`adult-${index}`}
                        className="rounded-sm border border-taupe/35 bg-paper/80 p-3"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-taupe">
                            Adult {index + 2}
                            {plusOneTag(invitation, "adult", index, adultTotal) === "included"
                              ? " · Plus-one, no charge"
                              : plusOneTag(invitation, "adult", index, adultTotal) === "paid"
                                ? " · Plus-one, payment required"
                                : ""}
                          </p>
                          <button
                            type="button"
                            className="text-xs text-[#8a3f3f] underline underline-offset-2"
                            onClick={() =>
                              setValues((current) => ({
                                ...current,
                                adults: current.adults.filter((_, i) => i !== index),
                              }))
                            }
                          >
                            Remove
                          </button>
                        </div>
                        <div className="mt-3 space-y-3">
                          <div>
                            <label className="text-xs uppercase tracking-[0.12em] text-taupe">
                              Full name
                            </label>
                            <input
                              className={inputClass()}
                              value={adult.name}
                              onChange={(e) => updateAdult(index, { name: e.target.value })}
                            />
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                <FieldError id={`${formId}-adults-error`} message={errors.adults} />
              </section>

              <section className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-lilac-deep">
                    Children
                  </h2>
                  <button
                    type="button"
                    className="text-xs font-semibold uppercase tracking-[0.12em] text-lilac-deep underline underline-offset-2"
                    onClick={() =>
                      setValues((current) => ({
                        ...current,
                        children: [...current.children, emptyChild()],
                      }))
                    }
                  >
                    {nextChildTag === "included"
                      ? "+ Add included plus-one"
                      : nextChildTag === "paid"
                        ? "+ Add paid plus-one"
                        : "+ Add child"}
                  </button>
                </div>
                <p className="text-xs text-charcoal/65">
                  Children on this invitation, with name and age. Anyone beyond the{" "}
                  {invitation.allowedChildren} included{" "}
                  {invitation.allowedChildren === 1 ? "child" : "children"} is a plus-one.
                </p>
                {values.children.length === 0 ? (
                  <p className="text-sm text-taupe">No children added.</p>
                ) : (
                  <ul className="space-y-4">
                    {values.children.map((child, index) => (
                      <li
                        key={`child-${index}`}
                        className="rounded-sm border border-taupe/35 bg-paper/80 p-3"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-taupe">
                            Child {index + 1}
                            {plusOneTag(invitation, "child", index, adultTotal) === "included"
                              ? " · Plus-one, no charge"
                              : plusOneTag(invitation, "child", index, adultTotal) === "paid"
                                ? " · Plus-one, payment required"
                                : ""}
                          </p>
                          <button
                            type="button"
                            className="text-xs text-[#8a3f3f] underline underline-offset-2"
                            onClick={() =>
                              setValues((current) => ({
                                ...current,
                                children: current.children.filter((_, i) => i !== index),
                              }))
                            }
                          >
                            Remove
                          </button>
                        </div>
                        <div className="mt-3 space-y-3">
                          <div className="grid gap-3 sm:grid-cols-[1fr_5.5rem]">
                            <div>
                              <label className="text-xs uppercase tracking-[0.12em] text-taupe">
                                Full name
                              </label>
                              <input
                                className={inputClass()}
                                value={child.name}
                                onChange={(e) => updateChild(index, { name: e.target.value })}
                              />
                            </div>
                            <div>
                              <label className="text-xs uppercase tracking-[0.12em] text-taupe">
                                Age
                              </label>
                              <input
                                type="number"
                                min={0}
                                max={17}
                                className={inputClass()}
                                value={child.age}
                                onChange={(e) => updateChild(index, { age: e.target.value })}
                              />
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                <FieldError id={`${formId}-children-error`} message={errors.children} />
              </section>

              <p className="rounded-sm border border-lilac/25 bg-lilac/10 px-3 py-2 text-sm text-charcoal/80">
                Party total: <span className="font-semibold">{partyTotal}</span>{" "}
                {partyTotal === 1 ? "guest" : "guests"} ({adultTotal}{" "}
                {adultTotal === 1 ? "adult" : "adults"}, {childTotal}{" "}
                {childTotal === 1 ? "child" : "children"}). Paid plus-ones: {plusOnes.paidAdults}{" "}
                {plusOnes.paidAdults === 1 ? "adult" : "adults"}, {plusOnes.paidChildren}{" "}
                {plusOnes.paidChildren === 1 ? "child" : "children"}.
              </p>
              {plusOnes.paidAdults + plusOnes.paidChildren > 0 ? (
                <p
                  className="rounded-sm border border-lilac/30 bg-lilac/10 px-3 py-2 text-sm leading-relaxed text-charcoal/85"
                  role="note"
                >
                  {wedding.rsvp.additionalGuestNotice}
                </p>
              ) : null}

              <div>
                <label
                  className="text-xs font-semibold uppercase tracking-[0.14em] text-taupe"
                  htmlFor={`${formId}-hotel`}
                >
                  Hotel status
                </label>
                <select
                  id={`${formId}-hotel`}
                  className={inputClass(errors.hotelStatus)}
                  value={values.hotelStatus}
                  onChange={(e) => set("hotelStatus")(e.target.value)}
                >
                  <option value="">Select status</option>
                  {wedding.rsvp.hotelStatuses.map((statusOption) => (
                    <option key={statusOption} value={statusOption}>
                      {statusOption}
                    </option>
                  ))}
                </select>
                <FieldError id={`${formId}-hotel-error`} message={errors.hotelStatus} />
              </div>
            </>
          ) : null}

          <div>
            <label
              className="text-xs font-semibold uppercase tracking-[0.14em] text-taupe"
              htmlFor={`${formId}-message`}
            >
              Message to the couple
            </label>
            <textarea
              id={`${formId}-message`}
              className={inputClass()}
              rows={3}
              value={values.message}
              onChange={(e) => set("message")(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className="inline-flex min-h-11 items-center justify-center rounded-sm bg-lilac-deep px-5 text-sm font-semibold uppercase tracking-[0.16em] text-paper disabled:opacity-70"
          >
            {status === "loading" ? "Sending…" : "Submit RSVP"}
          </button>

          <div aria-live="polite" className="min-h-6 text-sm">
            {status === "success" ? (
              <p className="text-sage-deep">
                Thank you. Your RSVP has been received. We can’t wait to celebrate with you.
                {notedPlusOne ? (
                  <>
                    {" "}
                    Please pay for each additional guest by{" "}
                    <span className="font-bold">{wedding.deadlines.guestPaymentDisplay}</span>, or
                    their spot will be canceled.
                  </>
                ) : null}
              </p>
            ) : null}
            {status === "error" && submitError ? (
              <p className="text-[#8a3f3f]" role="alert">
                {submitError}
              </p>
            ) : null}
          </div>
        </form>
      </div>
    </DetailPageShell>
  );
}

function inputClass(error?: string) {
  return cx(
    "mt-2 w-full rounded-sm border bg-paper px-3 py-3 text-sm text-charcoal outline-none focus:border-lilac-deep",
    error ? "border-[#8a3f3f]" : "border-taupe/45",
  );
}
