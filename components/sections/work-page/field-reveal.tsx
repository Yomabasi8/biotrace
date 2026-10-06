"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useMotionTemplate, useScroll, useTransform } from "motion/react";
import { photo } from "./data";

/*
 * Telescope-style moment: a small framed photo grows to fill the screen as you scroll,
 * then a line of copy and two field labels settle over it.
 */
export function FieldReveal() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = photo("edna-membrane-filter");

  const insetY = useTransform(scrollYProgress, [0, 0.55], [26, 0]);
  const insetX = useTransform(scrollYProgress, [0, 0.55], [34, 0]);
  const radius = useTransform(scrollYProgress, [0, 0.55], [28, 0]);
  const clipPath = useMotionTemplate`inset(${insetY}% ${insetX}% ${insetY}% ${insetX}% round ${radius}px)`;
  const scale = useTransform(scrollYProgress, [0, 0.55], [1.25, 1]);
  const shade = useTransform(scrollYProgress, [0.35, 0.6], [0, 1]);
  const headlineOpacity = useTransform(scrollYProgress, [0.5, 0.65], [0, 1]);
  const headlineY = useTransform(scrollYProgress, [0.5, 0.65], [30, 0]);
  const labelsOpacity = useTransform(scrollYProgress, [0.62, 0.75], [0, 1]);

  return (
    <section ref={ref} className="relative h-[240vh] bg-white">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <motion.div style={{ clipPath }} className="absolute inset-0">
          <motion.div style={{ scale }} className="absolute inset-0">
            <Image src={p.src} alt={p.alt} fill sizes="100vw" className="object-cover object-[62%_18%]" />
          </motion.div>
          <motion.div
            aria-hidden
            style={{ opacity: shade }}
            className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,20,28,0.25)_0%,rgba(6,20,28,0.45)_55%,rgba(6,20,28,0.7)_100%)]"
          />
        </motion.div>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white">
          <motion.h2
            style={{ opacity: headlineOpacity, y: headlineY }}
            className="max-w-[900px] text-[36px] leading-[1.1] font-bold sm:text-5xl lg:text-[68px]"
          >
            Every sample tells a story.
          </motion.h2>
        </div>

        {/* Field labels, like a caption on a specimen card */}
        <motion.div
          style={{ opacity: labelsOpacity }}
          className="pointer-events-none absolute inset-x-0 bottom-10 text-white md:bottom-14"
        >
          <div className="container-site flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <p className="font-heading text-lg font-semibold tracking-[-0.4px] md:text-xl">eDNA Water Sampling</p>
            <ul className="font-mono text-[11px] leading-[1.9] tracking-[0.18em] text-white/85 sm:text-right">
              <li>eDNA</li>
              <li>MEMBRANE FILTRATION</li>
              <li>BIODIVERSITY MONITORING</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
