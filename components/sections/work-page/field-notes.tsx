"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLenis } from "lenis/react";
import { ArrowLeft, ArrowRight, Plus, X } from "lucide-react";
import { Eyebrow } from "@/components/ui/eyebrow";
import { easeOut, fadeUp } from "@/lib/motion";
import { fieldPhotos } from "./data";

/*
 * Telescope-style gallery: a masonry of field photos with a caption and a small mono
 * tag under each. Clicking one expands it into a lightbox (shared-element transition).
 */
export function FieldNotes() {
  const [open, setOpen] = useState<number | null>(null);
  const lenis = useLenis();

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (dir: 1 | -1) => setOpen((i) => (i === null ? i : (i + dir + fieldPhotos.length) % fieldPhotos.length)),
    [],
  );

  // Freeze page scroll and wire the keyboard while the lightbox is open
  useEffect(() => {
    if (open === null) return;
    lenis?.stop();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [open, lenis, close, step]);

  return (
    <section className="bg-[#f6f4ef] py-20 md:py-28">
      <div className="container-site">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="[&>p]:justify-start">
              <Eyebrow>Field Notes</Eyebrow>
            </div>
            <motion.h2
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.8 }}
              variants={fadeUp}
              className="text-[34px] leading-[1.08] font-bold text-ink sm:text-[42px] lg:text-[48px]"
            >
              From the field
            </motion.h2>
          </div>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.8 }}
            variants={fadeUp}
            className="max-w-[420px] text-base leading-[1.6] text-ink-soft"
          >
            Moments from our research, laboratory work, and community programmes. Tap any photo to take a
            closer look.
          </motion.p>
        </div>

        <ul className="mt-12 columns-2 gap-4 sm:gap-5 md:mt-16 lg:columns-3 lg:gap-7">
          {fieldPhotos.map((p, i) => (
            <motion.li
              key={p.slug}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.9, delay: (i % 3) * 0.1, ease: easeOut }}
              className="mb-8 break-inside-avoid md:mb-10"
            >
              <button
                type="button"
                onClick={() => setOpen(i)}
                className="group block w-full text-left focus-visible:outline-none"
                aria-label={`Open photo: ${p.title}`}
              >
                <motion.div
                  layoutId={`field-${p.slug}`}
                  className="relative overflow-hidden rounded-[14px] bg-black/5 group-focus-visible:ring-2 group-focus-visible:ring-primary"
                  style={{ aspectRatio: `${p.w} / ${p.h}` }}
                >
                  <Image
                    src={p.src}
                    alt={p.alt}
                    fill
                    sizes="(min-width: 1024px) 380px, 50vw"
                    className="object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.05]"
                  />
                  <span className="absolute right-3 bottom-3 flex h-8 w-8 scale-75 items-center justify-center rounded-full bg-white text-ink opacity-0 shadow-sm transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
                    <Plus className="h-4 w-4" strokeWidth={2} />
                  </span>
                </motion.div>
                <p className="mt-3 text-sm leading-snug font-medium text-ink md:text-[15px]">{p.title}</p>
                <p className="mt-1.5 font-mono text-[10px] tracking-[0.16em] text-ink-soft/70">{p.tag}</p>
              </button>
            </motion.li>
          ))}
        </ul>
      </div>

      <AnimatePresence>
        {open !== null && (
          <Lightbox key="lightbox" index={open} onClose={close} onStep={step} />
        )}
      </AnimatePresence>
    </section>
  );
}

function Lightbox({ index, onClose, onStep }: { index: number; onClose: () => void; onStep: (d: 1 | -1) => void }) {
  const p = fieldPhotos[index];

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={p.title}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-[#071a24]/90 px-4 py-16 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        layoutId={`field-${p.slug}`}
        className="relative w-full overflow-hidden rounded-[14px]"
        style={{
          aspectRatio: `${p.w} / ${p.h}`,
          maxWidth: `min(92vw, calc((100svh - 220px) * ${p.w / p.h}))`,
        }}
        transition={{ type: "spring", stiffness: 220, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
      >
        <Image src={p.src} alt={p.alt} fill sizes="90vw" className="object-cover" priority />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mt-5 max-w-[640px] text-center text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-base font-medium md:text-lg">{p.title}</p>
        <p className="mt-1.5 font-mono text-[11px] tracking-[0.16em] text-white/60">
          {p.tag} · {index + 1} / {fieldPhotos.length}
        </p>
      </motion.div>

      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute top-5 right-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
      >
        <X className="h-5 w-5" />
      </button>
      {([-1, 1] as const).map((d) => (
        <button
          key={d}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onStep(d);
          }}
          aria-label={d === 1 ? "Next photo" : "Previous photo"}
          className={`absolute top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:flex ${
            d === 1 ? "right-5" : "left-5"
          }`}
        >
          {d === 1 ? <ArrowRight className="h-5 w-5" /> : <ArrowLeft className="h-5 w-5" />}
        </button>
      ))}
    </motion.div>
  );
}
