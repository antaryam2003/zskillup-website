"use client";

import { useState } from "react";
import { contact } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

/**
 * The single enquiry route behind every conversion CTA on the page:
 * Partner With Us, Talk to a Career Advisor, Request a Customised Program,
 * Get Started and Contact Our Team all land here.
 *
 * "I am enquiring as" is what routes the enquiry, so one form can serve a B2B
 * institution lead and a B2C student without either seeing irrelevant fields.
 *
 * Accessibility: every field has a real <label>, errors are announced through
 * aria-describedby + role="alert", the submit state is announced politely, and
 * nothing depends on placeholder text to convey meaning.
 */

type Status = "idle" | "submitting" | "success" | "error";

const audiences = [
  { value: "institution", label: "An institution" },
  { value: "student", label: "A student or parent" },
  { value: "industry", label: "An industry partner" },
] as const;

const audienceLabel = (value: string) =>
  audiences.find((a) => a.value === value)?.label ?? value;

/** True on the GitHub Pages build, where there is no server to POST to. */
const STATIC_BUILD = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true";

/** Composes the enquiry into a mailto: the visitor's mail client can send. */
function mailtoFor(data: Record<string, string>) {
  const body = [
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone || "-"}`,
    `Institution or organisation: ${data.organisation || "-"}`,
    `Enquiring as: ${audienceLabel(data.audience)}`,
    "",
    data.message || "(no message)",
  ].join("\n");

  return `mailto:${contact.email}?subject=${encodeURIComponent(
    `Website enquiry - ${data.name}`,
  )}&body=${encodeURIComponent(body)}`;
}

export function EnquiryForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;

    const next: Record<string, string> = {};
    if (!data.name?.trim()) next.name = "Please enter your name.";
    if (!data.email?.trim()) next.email = "Please enter your email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email))
      next.email = "Please enter a valid email address.";
    if (!data.audience) next.audience = "Please tell us who you are enquiring as.";

    setErrors(next);
    if (Object.keys(next).length > 0) {
      form.querySelector<HTMLElement>(`[name="${Object.keys(next)[0]}"]`)?.focus();
      return;
    }

    setStatus("submitting");
    try {
      if (STATIC_BUILD) {
        // GitHub Pages serves files only, so there is no endpoint to POST to.
        // Rather than silently swallow the enquiry, hand it to the visitor's mail
        // client fully composed. Restore the fetch below on a Node host.
        window.location.href = mailtoFor(data);
        setStatus("success");
        setMessage(
          `Your email app should now be open with this enquiry ready to send to ${contact.email}. If nothing happened, email us directly.`,
        );
        form.reset();
        return;
      }

      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = (await res.json()) as { ok?: boolean; message?: string };
      if (!res.ok || !body.ok) throw new Error(body.message ?? "Something went wrong.");
      setStatus("success");
      setMessage(body.message ?? "Thanks — we'll be in touch shortly.");
      form.reset();
    } catch (err) {
      setStatus("error");
      setMessage(
        err instanceof Error ? err.message : "Something went wrong. Please try again.",
      );
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-card border border-line bg-white p-8 text-center">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-com-soft text-com">
          <Icon name="check" className="h-5 w-5" />
        </span>
        <h3 className="mt-5 text-lg font-bold text-navy">Enquiry received</h3>
        <p className="mt-2 text-[0.9375rem] text-body">{message}</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-5 text-[0.9375rem] font-semibold text-brand hover:underline"
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="rounded-card border border-line bg-white p-6 shadow-card sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          name="name"
          label="Full name"
          autoComplete="name"
          required
          error={errors.name}
        />
        <Field
          name="email"
          label="Email address"
          type="email"
          autoComplete="email"
          required
          error={errors.email}
        />
        <Field name="phone" label="Phone number" type="tel" autoComplete="tel" optional />
        <Field
          name="organisation"
          label="Institution or organisation"
          autoComplete="organization"
          optional
        />
      </div>

      <fieldset className="mt-6">
        <legend className="text-[0.9375rem] font-semibold text-navy">
          I am enquiring as <span className="text-brand">*</span>
        </legend>
        <div
          className="mt-3 flex flex-wrap gap-2"
          aria-describedby={errors.audience ? "audience-error" : undefined}
        >
          {audiences.map((option) => (
            <label
              key={option.value}
              className="cursor-pointer rounded-full border border-line px-4 py-2.5 text-[0.9375rem] text-body transition-colors has-[:checked]:border-brand/40 has-[:checked]:bg-brand-soft has-[:checked]:font-semibold has-[:checked]:text-navy"
            >
              <input
                type="radio"
                name="audience"
                value={option.value}
                className="sr-only"
              />
              {option.label}
            </label>
          ))}
        </div>
        {errors.audience ? (
          <p id="audience-error" role="alert" className="mt-2 text-[0.8125rem] text-[#c0392b]">
            {errors.audience}
          </p>
        ) : null}
      </fieldset>

      <div className="mt-6">
        <label htmlFor="enquiry-message" className="text-[0.9375rem] font-semibold text-navy">
          How can we help?{" "}
          <span className="font-normal text-muted">(optional)</span>
        </label>
        <textarea
          id="enquiry-message"
          name="message"
          rows={4}
          className="mt-2 w-full rounded-tile border border-line bg-cloud px-4 py-3 text-[0.9375rem] text-navy outline-none focus:border-brand/50"
        />
      </div>

      {status === "error" ? (
        <p role="alert" className="mt-5 text-[0.875rem] text-[#c0392b]">
          {message}
        </p>
      ) : null}

      <div className="mt-7 flex flex-wrap items-center gap-4">
        <Button type="submit" variant="brand">
          {status === "submitting" ? "Sending…" : STATIC_BUILD ? "Send Enquiry by Email" : "Send Enquiry"}
        </Button>
        <p className="text-[0.8125rem] text-muted">
          {STATIC_BUILD
            ? "Opens in your email app. We'll only use your details to respond."
            : "We'll only use your details to respond to this enquiry."}
        </p>
      </div>

      <p aria-live="polite" className="sr-only">
        {status === "submitting" ? "Sending your enquiry" : ""}
      </p>
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  required,
  optional,
  autoComplete,
  error,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  optional?: boolean;
  autoComplete?: string;
  error?: string;
}) {
  const id = `enquiry-${name}`;
  return (
    <div>
      <label htmlFor={id} className="text-[0.9375rem] font-semibold text-navy">
        {label}{" "}
        {required ? (
          <span className="text-brand">*</span>
        ) : optional ? (
          <span className="font-normal text-muted">(optional)</span>
        ) : null}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        aria-describedby={error ? `${id}-error` : undefined}
        aria-invalid={error ? true : undefined}
        className={`mt-2 w-full rounded-tile border bg-cloud px-4 py-3 text-[0.9375rem] text-navy outline-none focus:border-brand/50 ${
          error ? "border-[#c0392b]" : "border-line"
        }`}
      />
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-[0.8125rem] text-[#c0392b]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
