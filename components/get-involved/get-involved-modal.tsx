"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLenis } from "lenis/react";
import { Check, FileText, Loader2, Upload, X } from "lucide-react";
import {
  AVAILABILITY,
  BACKGROUNDS,
  CV_ACCEPT,
  CV_MAX_BYTES,
  CV_TYPES,
  FOCUS_AREAS,
  INTERESTS,
  ORG_TYPES,
  type InterestId,
} from "@/lib/get-involved";
import { easeOut } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "sent" } | { kind: "error"; message: string };

export function GetInvolvedModal({
  initialInterest,
  onClose,
}: {
  initialInterest?: InterestId;
  onClose: () => void;
}) {
  const lenis = useLenis();
  const dialogRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const titleId = useId();
  const [interest, setInterest] = useState<InterestId>(initialInterest ?? "volunteer");
  const [cv, setCv] = useState<File | null>(null);
  const [cvError, setCvError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  // Lock page scroll, close on Escape, keep Tab inside the dialog, restore focus afterwards
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    lenis?.stop();
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = "hidden";
    const first = dialogRef.current?.querySelector<HTMLElement>("button, input, select, textarea");
    first?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab" || !dialogRef.current) return;
      const items = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>("button, input, select, textarea, a[href]"),
      ).filter((el) => !el.hasAttribute("disabled") && el.offsetParent !== null);
      if (!items.length) return;
      const firstEl = items[0];
      const lastEl = items[items.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      html.style.overflow = prevOverflow;
      lenis?.start();
      previouslyFocused?.focus?.();
    };
  }, [lenis, onClose]);

  const pickFile = (file: File | undefined | null) => {
    setCvError("");
    if (!file) return;
    if (!(file.type in CV_TYPES)) return setCvError("Please upload a PDF, DOC, or DOCX file.");
    if (file.size > CV_MAX_BYTES) return setCvError("That file is over 4 MB. Please upload a smaller version.");
    setCv(file);
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = formRef.current!;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    data.set("interest", interest);
    data.delete("cv");
    if (cv) data.set("cv", cv);
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/get-involved", { method: "POST", body: data });
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(body.error || "Something went wrong. Please try again.");
      setStatus({ kind: "sent" });
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : "Something went wrong." });
    }
  };

  const isPartner = interest === "partner";
  const isVolunteer = interest === "volunteer";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[70] flex items-end justify-center bg-[#071a24]/60 backdrop-blur-sm sm:items-center sm:p-6"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        initial={{ opacity: 0, y: 60, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.98 }}
        transition={{ duration: 0.45, ease: easeOut }}
        className="relative flex max-h-[94svh] w-full max-w-[720px] flex-col overflow-hidden rounded-t-[28px] bg-white shadow-[0_40px_100px_-30px_rgba(6,6,6,0.5)] sm:max-h-[90svh] sm:rounded-[28px]"
        data-lenis-prevent
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-black/5 px-6 pt-6 pb-5 sm:px-8 sm:pt-7">
          <div>
            <p className="font-mono text-[11px] font-medium tracking-[0.2em] text-primary uppercase">Get Involved</p>
            <h2 id={titleId} className="mt-1.5 text-[26px] leading-tight font-bold text-ink sm:text-[30px]">
              Join the BioTrace community
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close form"
            className="-mt-1 -mr-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-black/5 hover:text-ink focus-visible:outline-2 focus-visible:outline-primary"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {status.kind === "sent" ? (
            <Success key="sent" onClose={onClose} interest={interest} />
          ) : (
            <motion.form
              key="form"
              ref={formRef}
              onSubmit={submit}
              noValidate={false}
              exit={{ opacity: 0 }}
              className="flex min-h-0 flex-1 flex-col"
            >
              {/* relative: the visually hidden inputs (sr-only) must be positioned within this scroller,
                  otherwise they overflow the dialog itself and focusing them scrolls the header away */}
              <div className="relative min-h-0 flex-1 space-y-7 overflow-y-auto overscroll-contain px-6 py-6 sm:px-8">
                {/* 1. Pathway */}
                <fieldset>
                  <Legend n={1}>How would you like to get involved?</Legend>
                  <div className="mt-3 grid gap-2.5 sm:grid-cols-3">
                    {INTERESTS.map((opt) => {
                      const on = interest === opt.id;
                      return (
                        <label
                          key={opt.id}
                          className={cn(
                            "relative cursor-pointer rounded-2xl border-[1.5px] p-4 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary/40",
                            on ? "border-primary bg-primary/[0.05]" : "border-black/10 hover:border-black/25",
                          )}
                        >
                          <input
                            type="radio"
                            name="interest"
                            value={opt.id}
                            checked={on}
                            onChange={() => setInterest(opt.id)}
                            className="sr-only"
                          />
                          <span className="flex items-center justify-between">
                            <span className="font-heading text-[17px] font-semibold tracking-[-0.3px] text-ink">{opt.label}</span>
                            <span
                              className={cn(
                                "flex h-5 w-5 items-center justify-center rounded-full border-[1.5px] transition-colors",
                                on ? "border-primary bg-primary text-white" : "border-black/20",
                              )}
                            >
                              {on && <Check className="h-3 w-3" strokeWidth={3} />}
                            </span>
                          </span>
                          <span className="mt-1.5 block text-[13px] leading-snug text-ink-soft">{opt.blurb}</span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>

                {/* 2. About you */}
                <fieldset>
                  <Legend n={2}>About you</Legend>
                  <div className="mt-3 grid gap-4 sm:grid-cols-2">
                    <Field label="Full name" required>
                      <input name="name" required minLength={2} autoComplete="name" className={inputCls} />
                    </Field>
                    <Field label="Email address" required>
                      <input name="email" type="email" required autoComplete="email" className={inputCls} />
                    </Field>
                    <Field label="Phone number" hint="Optional">
                      <input name="phone" type="tel" autoComplete="tel" className={inputCls} />
                    </Field>
                    <Field label="Country / city" required>
                      <input name="location" required autoComplete="country-name" className={inputCls} />
                    </Field>
                    <Field label="Your background" className="sm:col-span-2">
                      <Select name="background" options={BACKGROUNDS} placeholder="Select one" />
                    </Field>
                  </div>
                </fieldset>

                {/* 3. Organisation */}
                <fieldset>
                  <Legend n={3}>{isPartner ? "Your organisation" : "Organisation"}</Legend>
                  {!isPartner && <p className="mt-1 text-[13px] text-ink-soft">Optional: fill this in if you&apos;re applying on behalf of, or affiliated with, an organisation.</p>}
                  <div className="mt-3 grid gap-4 sm:grid-cols-2">
                    <Field label="Organisation name" required={isPartner}>
                      <input name="organisation" required={isPartner} autoComplete="organization" className={inputCls} />
                    </Field>
                    <Field label="Your role / title">
                      <input name="role" autoComplete="organization-title" className={inputCls} />
                    </Field>
                    {isPartner && (
                      <Field label="Organisation type" className="sm:col-span-2">
                        <Select name="orgType" options={ORG_TYPES} placeholder="Select one" />
                      </Field>
                    )}
                  </div>
                </fieldset>

                {/* 4. Interests */}
                <fieldset>
                  <Legend n={4}>Areas you&apos;re interested in</Legend>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {FOCUS_AREAS.map((area) => (
                      <label key={area} className="cursor-pointer">
                        <input type="checkbox" name="areas" value={area} className="peer sr-only" />
                        <span className="inline-flex items-center gap-1.5 rounded-full border-[1.5px] border-black/10 px-3.5 py-2 text-[13px] text-ink-soft transition-colors peer-checked:border-primary peer-checked:bg-primary peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-primary/40 hover:border-black/25">
                          {area}
                        </span>
                      </label>
                    ))}
                  </div>
                  {isVolunteer && (
                    <div className="mt-4 sm:max-w-[50%] sm:pr-2">
                      <Field label="Your availability">
                        <Select name="availability" options={AVAILABILITY} placeholder="Select one" />
                      </Field>
                    </div>
                  )}
                </fieldset>

                {/* 5. Message + CV */}
                <fieldset>
                  <Legend n={5}>Tell us more</Legend>
                  <div className="mt-3 grid gap-4">
                    <Field
                      label={
                        isPartner
                          ? "How would you like to partner with us?"
                          : isVolunteer
                            ? "Why would you like to volunteer, and what skills can you bring?"
                            : "What would you like to collaborate on?"
                      }
                      required
                    >
                      <textarea name="message" required minLength={20} rows={5} className={cn(inputCls, "h-auto resize-y py-3 leading-relaxed")} />
                    </Field>
                    <Field label="LinkedIn profile or website" hint="Optional">
                      <input name="link" type="url" placeholder="https://" className={inputCls} />
                    </Field>

                    <div>
                      <p className="text-sm font-medium text-ink">
                        Upload your CV <span className="font-normal text-ink-soft">(optional · PDF, DOC or DOCX · max 4 MB)</span>
                      </p>
                      <label
                        onDragOver={(e) => {
                          e.preventDefault();
                          setDragging(true);
                        }}
                        onDragLeave={() => setDragging(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setDragging(false);
                          pickFile(e.dataTransfer.files?.[0]);
                        }}
                        className={cn(
                          "mt-2 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-[1.5px] border-dashed px-4 py-6 text-center transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary/40",
                          dragging ? "border-primary bg-primary/[0.05]" : "border-black/15 hover:border-primary/50 hover:bg-[#f6f9fb]",
                        )}
                      >
                        <input
                          type="file"
                          name="cv"
                          accept={CV_ACCEPT}
                          className="sr-only"
                          onChange={(e) => pickFile(e.target.files?.[0])}
                        />
                        {cv ? (
                          <span className="flex w-full items-center gap-3 text-left">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                              <FileText className="h-5 w-5" />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-sm font-medium text-ink">{cv.name}</span>
                              <span className="text-xs text-ink-soft">{(cv.size / 1024 / 1024).toFixed(2)} MB · click to replace</span>
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                setCv(null);
                              }}
                              aria-label="Remove CV"
                              className="flex h-8 w-8 items-center justify-center rounded-full text-ink-soft hover:bg-black/5 hover:text-ink"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </span>
                        ) : (
                          <>
                            <Upload className="h-5 w-5 text-primary" />
                            <span className="text-sm text-ink">
                              <span className="font-medium text-primary">Click to upload</span> or drag and drop
                            </span>
                          </>
                        )}
                      </label>
                      {cvError && <p className="mt-2 text-[13px] text-[#c4553f]">{cvError}</p>}
                    </div>
                  </div>
                </fieldset>

                <label className="flex cursor-pointer items-start gap-3 text-[13px] leading-snug text-ink-soft">
                  <input type="checkbox" name="consent" required className="mt-0.5 h-4 w-4 shrink-0 accent-[#196180]" />
                  I agree that BioTrace Global may contact me about this submission and keep my details for that purpose.
                </label>

                {/* Honeypot for bots: hidden from people and screen readers */}
                <input type="text" name="company_website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
              </div>

              {/* Footer */}
              <div className="flex flex-col-reverse gap-3 border-t border-black/5 bg-white px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                <p role="status" aria-live="polite" className={cn("text-[13px]", status.kind === "error" ? "text-[#c4553f]" : "text-ink-soft")}>
                  {status.kind === "error" ? status.message : "We usually reply within a few days."}
                </p>
                <button
                  type="submit"
                  disabled={status.kind === "sending"}
                  className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-8 text-[15px] font-medium text-white transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-70"
                >
                  {status.kind === "sending" && <Loader2 className="h-4 w-4 animate-spin" />}
                  {status.kind === "sending" ? "Sending…" : "Submit"}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

const inputCls =
  "h-12 w-full rounded-xl border-[1.5px] border-black/10 bg-white px-4 text-[15px] text-ink transition-colors placeholder:text-ink-soft/40 hover:border-black/20 focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none user-invalid:border-[#e0775f]";

function Legend({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <legend className="flex items-center gap-2.5 font-heading text-[17px] font-semibold tracking-[-0.3px] text-ink">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 font-mono text-[11px] font-semibold text-primary">
        {n}
      </span>
      {children}
    </legend>
  );
}

function Field({
  label,
  hint,
  required,
  className,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-sm font-medium text-ink">
        {label}
        {required && <span className="text-[#e0775f]"> *</span>}
        {hint && <span className="font-normal text-ink-soft"> · {hint}</span>}
      </span>
      {children}
    </label>
  );
}

function Select({ name, options, placeholder }: { name: string; options: readonly string[]; placeholder: string }) {
  return (
    <select name={name} defaultValue="" className={cn(inputCls, "appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%23363636%22 stroke-width=%222%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-[length:14px] bg-[right_16px_center] bg-no-repeat pr-10")}>
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

function Success({ onClose, interest }: { onClose: () => void; interest: InterestId }) {
  const label = INTERESTS.find((i) => i.id === interest)?.label.toLowerCase();
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: easeOut }}
      className="flex flex-col items-center px-8 py-14 text-center"
    >
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.1 }}
        className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white"
      >
        <Check className="h-8 w-8" strokeWidth={2.5} />
      </motion.span>
      <h3 className="mt-6 text-[26px] font-bold text-ink">Thank you!</h3>
      <p className="mt-2 max-w-[420px] text-base leading-relaxed text-ink-soft">
        We&apos;ve received your {label} request. The BioTrace team will review it and get back to you by email.
      </p>
      <button
        type="button"
        onClick={onClose}
        className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-[15px] font-medium text-white transition-colors hover:bg-primary-hover"
      >
        Done
      </button>
    </motion.div>
  );
}
