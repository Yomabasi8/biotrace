"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { Seahorse, Squid } from "@/components/ui/sea-creatures";
import { easeOut, fadeUp } from "@/lib/motion";
import { cn } from "@/lib/utils";

const headingWords = ["Let’s", "Build", "a", "Future", "Where", "People", "and", "\n", "Nature", "Thrive", "Together."];

const word: Variants = {
  hidden: { opacity: 0, y: "0.5em", filter: "blur(10px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.9, ease: easeOut } },
};

const actions: { label: string; href: string; className: string }[] = [
  {
    label: "Join the Community",
    href: "/#get-involved",
    className: "bg-white text-ink hover:bg-[#eef4f7]",
  },
  {
    label: "Get Involved",
    href: "/#get-involved",
    className: "bg-[#e0775f] text-ink hover:bg-[#e68a75]",
  },
];

// Rising bubbles (fixed values so server and client render the same)
const bubbles = [
  { left: "8%", size: 10, duration: 14, delay: 0 },
  { left: "17%", size: 6, duration: 11, delay: 4 },
  { left: "26%", size: 14, duration: 17, delay: 2 },
  { left: "38%", size: 5, duration: 10, delay: 7 },
  { left: "47%", size: 9, duration: 15, delay: 1 },
  { left: "58%", size: 6, duration: 12, delay: 5 },
  { left: "66%", size: 12, duration: 18, delay: 3 },
  { left: "74%", size: 5, duration: 9, delay: 8 },
  { left: "83%", size: 8, duration: 13, delay: 6 },
  { left: "92%", size: 11, duration: 16, delay: 2.5 },
];

export function JoinCta() {
  const reduce = useReducedMotion();

  return (
    <section
      id="join"
      className="relative isolate overflow-hidden bg-[#2e6680] pt-24 pb-[260px] text-white sm:pb-[220px] md:min-h-[720px] md:pt-[112px] md:pb-[240px]"
    >
      {/* Soft light from the surface */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[520px] w-[min(1100px,140vw)] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0)_70%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-b from-transparent to-[#24566d]"
      />

      {!reduce &&
        bubbles.map((b, i) => (
          <motion.span
            key={i}
            aria-hidden
            className="pointer-events-none absolute bottom-[-20px] -z-10 rounded-full border border-white/30 bg-white/10"
            style={{ left: b.left, width: b.size, height: b.size }}
            animate={{ y: [0, -760], x: [0, 10, -8, 6, 0], opacity: [0, 0.9, 0.9, 0] }}
            transition={{ duration: b.duration, delay: b.delay, repeat: Infinity, ease: "linear", times: [0, 0.1, 0.85, 1] }}
          />
        ))}

      <motion.div
        initial={{ opacity: 0, x: -80 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.4, ease: easeOut }}
        className="absolute bottom-0 left-0 w-[150px] sm:w-[200px] lg:top-[275px] lg:bottom-auto lg:w-[302px]"
      >
        <Squid />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 80 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.4, delay: 0.15, ease: easeOut }}
        className="absolute right-0 bottom-6 w-[120px] sm:w-[170px] lg:top-[148px] lg:bottom-auto lg:w-[280px]"
      >
        <Seahorse />
      </motion.div>

      <div className="container-site relative text-center">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.6 }}
          variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
          className="mx-auto max-w-[980px] text-[34px] leading-[1.18] font-bold text-white sm:text-[44px] md:text-[52px]"
        >
          {headingWords.map((w, i) =>
            w === "\n" ? (
              <br key={i} className="hidden lg:block" />
            ) : (
              <motion.span key={i} variants={word} className="inline-block">
                {w}
                {i < headingWords.length - 1 && " "}
              </motion.span>
            ),
          )}
        </motion.h2>

        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.6 }}
          variants={fadeUp}
          className="mx-auto mt-8 max-w-[960px] text-lg leading-[1.45] text-white/90 md:mt-[58px] md:text-[22px]"
        >
          Whether you’re a researcher, conservationist, community member, funder, volunteer, or
          organisation, there’s a place for you in the work we do.
        </motion.p>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } } }}
          className="mx-auto mt-12 grid max-w-[360px] gap-3 sm:flex sm:max-w-none sm:justify-center sm:gap-4 md:mt-[70px]"
        >
          {actions.map(({ label, href, className }) => (
            <motion.a
              key={label}
              href={href}
              variants={{
                hidden: { opacity: 0, y: 20, scale: 0.95 },
                visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: easeOut } },
              }}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
              className={cn(
                "inline-flex h-[52px] items-center justify-center rounded-md px-6 sm:w-[220px] font-heading text-[15px] font-semibold tracking-[-0.2px] shadow-[0_10px_24px_-12px_rgba(0,0,0,0.45)] transition-colors duration-300",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
                className,
              )}
            >
              {label}
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
