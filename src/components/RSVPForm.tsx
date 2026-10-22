"use client";

import { useId, useState, type FormEvent } from "react";
import { DetailPageShell } from "@/components/DetailPageShell";
import { wedding } from "@/data/wedding";
import {
  buildRsvpPartyFields,
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
  mealPreference: string;
  dietaryRestrictions: string;
  hotelStatus: string;
  flightInfo: string;
  songRequest: string;
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
  mealPreference: "",
  dietaryRestrictions: "",
});

const emptyChild = (): RsvpChildGuest => ({
  name: "",
  age: "",
  mealPreference: "Child meal",
  dietaryRestrictions: "",
});

const initialState: FormState = {
  fullName: "",
  email: "",
  mobile: "",
  attending: "",
  mealPreference: "",
  dietaryRestrictions: "",
  hotelStatus: "",
  flightInfo: "",
  songRequest: "",
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
    if (!values.mealPreference) errors.mealPreference = "Select your meal preference.";
    if (!values.hotelStatus) errors.hotelStatus = "Select your hotel status.";

    for (const adult of values.adults) {
      if (!adult.name.trim() || !adult.mealPreference) {
        errors.adults = "Each additional adult needs a name and meal preference.";
        break;
      }
    }
    for (const child of values.children) {
      const ageNum = Number(child.age);
      if (!child.name.trim() || !child.age.trim() || Number.isNaN(ageNum) || ageNum < 0 || ageNum > 17) {
        errors.children = "Each child needs a name and age (0–17).";
        break;
      }
      if (!child.mealPreference) {
        errors.children = "Each child needs a meal preference.";
        break;
      }
    }
  }
  return errors;
}

function toPayload(values: FormState): RsvpPayload {
  const adults =
    values.attending === "yes"
      ? values.adults.map((a) => ({
          name: a.name.trim(),
          mealPreference: a.mealPreference,
          dietaryRestrictions: a.dietaryRestrictions.trim(),
        }))
      : [];
  const children =
    values.attending === "yes"
      ? values.children.map((c) => ({
          name: c.name.trim(),
          age: c.age.trim(),
          mealPreference: c.mealPreference,
          dietaryRestrictions: c.dietaryRestrictions.trim(),
        }))
      : [];

  const mealPreference = values.attending === "yes" ? values.mealPreference : "";
  const dietaryRestrictions =
    values.attending === "yes" ? values.dietaryRestrictions.trim() : "";
  const fullName = values.fullName.trim();

  const party =
    values.attending === "yes"
      ? buildRsvpPartyFields({
          fullName,
          mealPreference,
          dietaryRestrictions,
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

  return {
    fullName,
    email: values.email.trim(),
    mobile: values.mobile.trim(),
    attending: values.attending === "no" ? "no" : "yes",
    mealPreference,
    dietaryRestrictions,
    hotelStatus: values.attending === "yes" ? values.hotelStatus : "",
    flightInfo: values.attending === "yes" ? values.flightInfo.trim() : "",
    songRequest: values.attending === "yes" ? values.songRequest.trim() : "",
    message: values.message.trim(),
    adults,
    children,
    ...party,
  };
}

async function submitRsvp(values: FormState): Promise<void> {
  const payload = toPayload(values);

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

function MealSelect({
  id,
  value,
  onChange,
  error,
  includeChildMeal = true,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  includeChildMeal?: boolean;
}) {
  const options = includeChildMeal
    ? wedding.rsvp.mealOptions
    : wedding.rsvp.mealOptions.filter((meal) => meal !== "Child meal");

  return (
    <select
      id={id}
      className={inputClass(error)}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">Select a meal</option>
      {options.map((meal) => (
        <option key={meal} value={meal}>
          {meal}
        </option>
      ))}
    </select>
  );
}

export function RSVPForm() {
  const formId = useId();
  const [values, setValues] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const partyTotal =
    values.attending === "yes" ? 1 + values.adults.length + values.children.length : 0;
  const hasAdditionalGuests = values.adults.length > 0 || values.children.length > 0;

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setStatus("idle");
      return;
    }

    setStatus("loading");
    try {
      await submitRsvp(values);
      setStatus("success");
      setValues(initialState);
    } catch {
      setStatus("error");
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

  return (
    <DetailPageShell title="RSVP" eyebrow="Confirm Attendance">
      <div className="paper-card relative overflow-hidden border border-lilac/35 p-5 sm:p-6">
        <div className="absolute inset-y-0 left-0 w-3 ticket-perforation bg-lilac/25" aria-hidden />
        <p className="pl-3 text-sm text-charcoal/75">
          Kindly reply by {wedding.deadlines.rsvpDisplay}. One person can RSVP for their whole
          invited party—including a spouse and children listed on your invitation—so we have
          everyone’s names, meals, and ages.
        </p>

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
              <section className="space-y-4">
                <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-lilac-deep">
                  Your meal
                </h2>
                <div>
                  <label
                    className="text-xs font-semibold uppercase tracking-[0.14em] text-taupe"
                    htmlFor={`${formId}-meal`}
                  >
                    Meal preference
                  </label>
                  <MealSelect
                    id={`${formId}-meal`}
                    value={values.mealPreference}
                    onChange={set("mealPreference")}
                    error={errors.mealPreference}
                    includeChildMeal={false}
                  />
                  <FieldError id={`${formId}-meal-error`} message={errors.mealPreference} />
                </div>
                <div>
                  <label
                    className="text-xs font-semibold uppercase tracking-[0.14em] text-taupe"
                    htmlFor={`${formId}-dietary`}
                  >
                    Dietary restrictions (optional)
                  </label>
                  <textarea
                    id={`${formId}-dietary`}
                    className={inputClass()}
                    rows={2}
                    value={values.dietaryRestrictions}
                    onChange={(e) => set("dietaryRestrictions")(e.target.value)}
                  />
                </div>
              </section>

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
                    + Add adult
                  </button>
                </div>
                <p className="text-xs text-charcoal/65">
                  Spouse, partner, or other adults named on your invitation (not including yourself).
                </p>
                {hasAdditionalGuests ? (
                  <p
                    className="rounded-sm border border-lilac/30 bg-lilac/10 px-3 py-2 text-xs leading-relaxed text-charcoal/85"
                    role="note"
                  >
                    {wedding.rsvp.additionalGuestNotice}
                  </p>
                ) : null}
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
                            Adult {index + 1}
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
                          <div>
                            <label className="text-xs uppercase tracking-[0.12em] text-taupe">
                              Meal preference
                            </label>
                            <MealSelect
                              id={`${formId}-adult-meal-${index}`}
                              value={adult.mealPreference}
                              onChange={(value) => updateAdult(index, { mealPreference: value })}
                              includeChildMeal={false}
                            />
                          </div>
                          <div>
                            <label className="text-xs uppercase tracking-[0.12em] text-taupe">
                              Dietary restrictions
                            </label>
                            <input
                              className={inputClass()}
                              value={adult.dietaryRestrictions}
                              onChange={(e) =>
                                updateAdult(index, { dietaryRestrictions: e.target.value })
                              }
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
                    + Add child
                  </button>
                </div>
                <p className="text-xs text-charcoal/65">
                  Include each child named on your invitation, with name and age, so we can plan
                  seating and meals.
                </p>
                {hasAdditionalGuests && values.adults.length === 0 ? (
                  <p
                    className="rounded-sm border border-lilac/30 bg-lilac/10 px-3 py-2 text-xs leading-relaxed text-charcoal/85"
                    role="note"
                  >
                    {wedding.rsvp.additionalGuestNotice}
                  </p>
                ) : null}
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
                          <div>
                            <label className="text-xs uppercase tracking-[0.12em] text-taupe">
                              Meal preference
                            </label>
                            <MealSelect
                              id={`${formId}-child-meal-${index}`}
                              value={child.mealPreference}
                              onChange={(value) => updateChild(index, { mealPreference: value })}
                            />
                          </div>
                          <div>
                            <label className="text-xs uppercase tracking-[0.12em] text-taupe">
                              Dietary restrictions
                            </label>
                            <input
                              className={inputClass()}
                              value={child.dietaryRestrictions}
                              onChange={(e) =>
                                updateChild(index, { dietaryRestrictions: e.target.value })
                              }
                            />
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
                {partyTotal === 1 ? "guest" : "guests"}
                {values.children.length > 0
                  ? ` (${1 + values.adults.length} adult${1 + values.adults.length === 1 ? "" : "s"}, ${values.children.length} child${values.children.length === 1 ? "" : "ren"})`
                  : null}
              </p>

              <section className="space-y-4">
                <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-lilac-deep">
                  Travel & extras
                </h2>
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
                <div>
                  <label
                    className="text-xs font-semibold uppercase tracking-[0.14em] text-taupe"
                    htmlFor={`${formId}-flight`}
                  >
                    Flight information (optional)
                  </label>
                  <textarea
                    id={`${formId}-flight`}
                    className={inputClass()}
                    rows={2}
                    value={values.flightInfo}
                    onChange={(e) => set("flightInfo")(e.target.value)}
                  />
                </div>
                <div>
                  <label
                    className="text-xs font-semibold uppercase tracking-[0.14em] text-taupe"
                    htmlFor={`${formId}-song`}
                  >
                    Song request (optional)
                  </label>
                  <input
                    id={`${formId}-song`}
                    className={inputClass()}
                    value={values.songRequest}
                    onChange={(e) => set("songRequest")(e.target.value)}
                  />
                </div>
              </section>
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
                Thank you—your RSVP has been received. We can’t wait to celebrate with you.
              </p>
            ) : null}
            {status === "error" ? (
              <p className="text-[#8a3f3f]" role="alert">
                Something went wrong while sending your RSVP. Please try again.
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
