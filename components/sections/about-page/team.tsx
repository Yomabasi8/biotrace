"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { easeOut, fadeUp } from "@/lib/motion";
import { cn } from "@/lib/utils";

/*
 * Photos ship with their coloured shape baked in (transparent outside it). Layout is taken
 * from the design: three staggered columns. Every offset is a percentage of the column width
 * (CSS margin percentages resolve against width), so the arrangement scales as one piece.
 */
type Member = { kind: "photo"; src: string; alt: string; w: number; h: number; offset: number };
type Blank = { kind: "blank"; ratio: number; offset: number };
type Cell = Member | Blank;

const columns: Cell[][] = [
  [
    { kind: "photo", src: "/Images/James.png", alt: "BioTrace Global team member smiling", w: 969, h: 840, offset: 6.8 },
    { kind: "photo", src: "/Images/prof.png", alt: "BioTrace Global team member in glasses and a gold embroidered top", w: 969, h: 1248, offset: 15.6 },
  ],
  [
    { kind: "photo", src: "/Images/faith.png", alt: "Faith Success Adeshola, founder of BioTrace Global", w: 978, h: 1476, offset: 0 },
    { kind: "photo", src: "/Images/fort.png", alt: "BioTrace Global team member in a white shirt", w: 969, h: 1260, offset: 16 },
  ],
  [
    // Open seat in the design: a plain pink shape
    { kind: "blank", ratio: 250 / 210, offset: 9.6 },
    { kind: "photo", src: "/Images/dr.png", alt: "BioTrace Global team member in a light blue shirt", w: 969, h: 1248, offset: 15.2 },
  ],
];

// Each column drifts at its own pace while scrolling, so the collage feels layered
const drift: [number, number][] = [
  [30, -30],
  [70, -70],
  [10, -40],
];

const titleWords = ["Meet", "Our", "Team"];

export function Team() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [hovered, setHovered] = useState<string | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  return (
    <section ref={ref} className="relative isolate overflow-hidden bg-white pt-20 pb-16 md:pt-24 md:pb-36">
      {/* Soft pastel wash along the bottom, picking up the card colours */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[340px] bg-[radial-gradient(50%_80%_at_15%_100%,rgba(94,180,80,0.12),transparent_70%),radial-gradient(45%_80%_at_55%_100%,rgba(108,198,208,0.12),transparent_70%),radial-gradient(45%_80%_at_90%_100%,rgba(244,194,203,0.18),transparent_70%)]"
      />

      <div className="container-site">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.8 }}
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          aria-label="Meet Our Team"
          className="text-center text-[34px] leading-tight font-bold text-ink sm:text-[42px] md:text-[52px]"
        >
          {titleWords.map((w, i) => (
            <span key={w} aria-hidden className="-mr-[0.15em] inline-block overflow-hidden pr-[0.15em] pb-[0.12em] align-bottom">
              <motion.span
                variants={{
                  hidden: reduce ? {} : { y: "110%", rotate: 4 },
                  visible: { y: "0%", rotate: 0, transition: { duration: 0.9, ease: easeOut } },
                }}
                className="inline-block origin-bottom-left"
              >
                {w}
                {i < titleWords.length - 1 && " "}
              </motion.span>
            </span>
          ))}
        </motion.h2>

        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.8 }}
          variants={fadeUp}
          className="mx-auto mt-5 max-w-[760px] text-center font-heading text-base leading-[1.45] tracking-[-0.3px] text-ink-soft md:text-xl"
        >
          Meet the dedicated team working behind the scenes to advance BioTrace Global’s vision for science,
          sustainability, and conservation
        </motion.p>

        <div
          className="mx-auto mt-14 flex max-w-[1000px] items-start justify-between md:mt-20"
          onMouseLeave={() => setHovered(null)}
        >
          {columns.map((cells, c) => (
            <Column key={c} progress={scrollYProgress} range={drift[c]} enabled={!reduce}>
              {cells.map((cell, r) => {
                const id = `${c}-${r}`;
                // Cascade in reading order: column by column, top to bottom
                const delay = c * 0.15 + r * 0.25;
                return (
                  <div key={id} style={{ marginTop: `${cell.offset}%` }}>
                    {cell.kind === "photo" ? (
                      <PhotoCard
                        {...cell}
                        delay={delay}
                        floatPhase={(c * 2 + r) * 0.9}
                        dimmed={hovered !== null && hovered !== id}
                        onHover={() => setHovered(id)}
                      />
                    ) : (
                      <BlankCard ratio={cell.ratio} delay={delay} floatPhase={(c * 2 + r) * 0.9} dimmed={hovered !== null} />
                    )}
                  </div>
                );
              })}
            </Column>
          ))}
        </div>
      </div>
    </section>
  );
}

function Column({
  children,
  progress,
  range,
  enabled,
}: {
  children: React.ReactNode;
  progress: MotionValue<number>;
  range: [number, number];
  enabled: boolean;
}) {
  const y = useTransform(progress, [0, 1], enabled ? range : [0, 0]);
  return (
    <motion.div style={{ y }} className="w-[29%] lg:w-[28%]">
      {children}
    </motion.div>
  );
}

// Card entrance: rises from below and "inflates" into its shape with a soft spring
const pop = (delay: number) => ({
  initial: { opacity: 0, y: 80, scale: 0.7 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  viewport: { once: true, amount: 0.25 },
  transition: { type: "spring" as const, stiffness: 90, damping: 14, mass: 0.9, delay },
});

function PhotoCard({
  src,
  alt,
  w,
  h,
  delay,
  floatPhase,
  dimmed,
  onHover,
}: Member & { delay: number; floatPhase: number; dimmed: boolean; onHover: () => void }) {
  const reduce = useReducedMotion();

  return (
    <motion.div {...pop(delay)}>
      {/* Gentle idle bob, each card out of step with its neighbours like floating buoys */}
      <motion.div
        animate={reduce ? undefined : { y: [0, -8, 0] }}
        transition={{ duration: 5.5, delay: floatPhase, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.div
          onHoverStart={onHover}
          animate={{ opacity: dimmed ? 0.55 : 1, scale: dimmed ? 0.96 : 1, filter: dimmed ? "saturate(0.6)" : "saturate(1)" }}
          whileHover={{ y: -10, scale: 1.04, rotate: -1.5 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className="relative drop-shadow-[0_24px_30px_rgba(6,6,6,0.10)]"
        >
          <Image
            src={src}
            alt={alt}
            width={w}
            height={h}
            sizes="(min-width: 1024px) 280px, 30vw"
            className="h-auto w-full select-none"
            draggable={false}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function BlankCard({
  ratio,
  delay,
  floatPhase,
  dimmed,
}: {
  ratio: number;
  delay: number;
  floatPhase: number;
  dimmed: boolean;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div {...pop(delay)} aria-hidden>
      <motion.div
        animate={reduce ? undefined : { y: [0, -8, 0] }}
        transition={{ duration: 5.5, delay: floatPhase, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.div
          animate={{ opacity: dimmed ? 0.55 : 1, scale: dimmed ? 0.96 : 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className={cn("w-full rounded-full bg-[#f5c3cc]")}
          style={{ aspectRatio: ratio }}
        />
      </motion.div>
    </motion.div>
  );
}
