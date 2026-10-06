"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { easeOut } from "@/lib/motion";
import { photo, type FieldPhoto } from "./data";

/*
 * Telescope-style headline: small photo "pills" sit between the words and open up
 * after the words around them have risen into place.
 */
type Segment = { words: string; pill?: FieldPhoto };

const segments: Segment[] = [
  { words: "Science that moves" },
  { pill: photo("water-quality-horiba"), words: "from field" },
  { pill: photo("nutrient-concentrations"), words: "to lab" },
  { pill: photo("cup-plastic-pollution"), words: "to community." },
];

const WORD_STAGGER = 0.07;
const START = 0.35;

export function WorkHero() {
  const reduce = useReducedMotion();
  let wordIndex = 0;

  return (
    <section className="relative overflow-hidden bg-white pt-[150px] pb-20 md:pt-[210px] md:pb-28">
      <div
        aria-hidden
        className="pointer-events-none absolute top-[-160px] left-1/2 h-[620px] w-[min(1200px,150vw)] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_center,#e3eaef_0%,rgba(228,234,239,0.45)_40%,rgba(255,255,255,0)_70%)]"
      />

      <div className="container-site relative text-center">
        <h1
          aria-label="Science that moves from field to lab to community."
          className="mx-auto max-w-[1080px] text-[40px] leading-[1.12] font-bold text-ink sm:text-[56px] lg:text-[80px] lg:leading-[1.06]"
        >
          {segments.map((seg, s) => {
            const pillDelay = START + wordIndex * WORD_STAGGER + 0.25;
            const words = seg.words.split(" ").map((w) => {
              const delay = START + wordIndex++ * WORD_STAGGER;
              return (
                <span
                  key={`${s}-${w}`}
                  aria-hidden
                  className="-mr-[0.12em] inline-block overflow-hidden pr-[0.12em] pb-[0.1em] align-bottom"
                >
                  <motion.span
                    initial={reduce ? false : { y: "110%", rotate: 5 }}
                    animate={{ y: "0%", rotate: 0 }}
                    transition={{ duration: 0.95, delay, ease: easeOut }}
                    className="inline-block origin-bottom-left"
                  >
                    {w}&nbsp;
                  </motion.span>
                </span>
              );
            });
            return (
              <span key={s}>
                {seg.pill && <Pill photo={seg.pill} delay={pillDelay} />}
                {words}
              </span>
            );
          })}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.5, ease: easeOut }}
          className="mx-auto mt-8 max-w-[640px] text-base leading-[1.65] text-ink-soft md:mt-10 md:text-lg"
        >
          We combine field research, laboratory science, and community action to understand and protect
          biodiversity on land and at sea.
        </motion.p>

        {/* Scroll cue */}
        <motion.div
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          className="mt-14 flex flex-col items-center gap-3 font-mono text-[11px] tracking-[0.22em] text-ink-soft/70 uppercase md:mt-20"
        >
          Scroll
          <span className="relative h-12 w-px overflow-hidden bg-ink/10">
            <motion.span
              className="absolute inset-x-0 top-0 h-1/2 bg-primary"
              animate={reduce ? undefined : { y: ["-100%", "200%"] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
          </span>
        </motion.div>
      </div>
    </section>
  );
}

function Pill({ photo, delay }: { photo: FieldPhoto; delay: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.span
      aria-hidden
      initial={reduce ? false : { width: 0, opacity: 0 }}
      animate={{ width: "1.55em", opacity: 1 }}
      whileHover={{ width: "2.3em" }}
      transition={{ type: "spring", stiffness: 140, damping: 20, delay: reduce ? 0 : delay }}
      className="relative mr-[0.22em] inline-block h-[0.78em] translate-y-[0.06em] overflow-hidden rounded-full align-baseline ring-1 ring-black/5"
    >
      <Image src={photo.src} alt="" fill sizes="140px" className="object-cover" />
    </motion.span>
  );
}
