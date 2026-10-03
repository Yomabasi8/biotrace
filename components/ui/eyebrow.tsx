"use client";

import { motion } from "motion/react";
import { easeOut } from "@/lib/motion";

// Small JetBrains Mono label above a section heading, flanked by two hairlines
export function Eyebrow({ children }: { children: string }) {
  return (
    <motion.p
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.8 }}
      className="mb-4 flex items-center justify-center gap-3 font-mono text-xs font-medium tracking-[0.22em] text-primary uppercase md:mb-5 md:text-[13px]"
    >
      <motion.span
        aria-hidden
        variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1, transition: { duration: 0.8, ease: easeOut } } }}
        className="h-px w-8 origin-right bg-primary/50"
      />
      <motion.span
        variants={{
          hidden: { opacity: 0, y: 10, filter: "blur(4px)" },
          visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, delay: 0.15, ease: easeOut } },
        }}
      >
        {children}
      </motion.span>
      <motion.span
        aria-hidden
        variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1, transition: { duration: 0.8, ease: easeOut } } }}
        className="h-px w-8 origin-left bg-primary/50"
      />
    </motion.p>
  );
}
