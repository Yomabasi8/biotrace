"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";

/*
 * Telescope-style statement: words fill in as you scroll, and one key phrase gets an
 * outlined box that draws itself once the reading reaches it.
 */
const before = "We collect environmental DNA, measure water quality in real time, and bring what we learn back to";
const highlight = "the communities who live alongside these ecosystems.";
const after = "Protecting biodiversity takes more than data. It takes people.";

export function Manifesto() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.5"] });

  const a = before.split(" ");
  const h = highlight.split(" ");
  const c = after.split(" ");
  const total = a.length + h.length + c.length;
  const range = (i: number): [number, number] => [i / total, (i + 1) / total];
  const boxStart = a.length / total;
  const boxEnd = (a.length + h.length) / total;

  return (
    <section className="bg-white py-24 md:py-36">
      <div className="container-site">
        <p
          ref={ref}
          className="mx-auto max-w-[1060px] text-[28px] leading-[1.3] font-medium tracking-[-0.6px] text-ink sm:text-[36px] lg:text-[50px] lg:leading-[1.22] lg:tracking-[-1.2px]"
        >
          {a.map((w, i) => (
            <Word key={`a${i}`} progress={scrollYProgress} range={range(i)}>
              {w}
            </Word>
          ))}
          <HighlightBox progress={scrollYProgress} range={[boxStart, boxEnd]}>
            {h.map((w, i) => (
              <Word key={`h${i}`} progress={scrollYProgress} range={range(a.length + i)} last={i === h.length - 1}>
                {w}
              </Word>
            ))}
          </HighlightBox>
          {c.map((w, i) => (
            <Word key={`c${i}`} progress={scrollYProgress} range={range(a.length + h.length + i)}>
              {w}
            </Word>
          ))}
        </p>
      </div>
    </section>
  );
}

function Word({
  children,
  progress,
  range,
  last,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  last?: boolean;
}) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  return (
    <>
      <motion.span style={{ opacity }}>{children}</motion.span>
      {!last && " "}
    </>
  );
}

function HighlightBox({
  children,
  progress,
  range,
}: {
  children: React.ReactNode;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  // The outline fades in while the phrase is being read; box-decoration-break gives every
  // wrapped line its own rounded box instead of one rectangle around the whole phrase
  const borderColor = useTransform(progress, range, ["rgba(25,97,128,0)", "rgba(25,97,128,0.7)"]);
  const backgroundColor = useTransform(progress, range, ["rgba(25,97,128,0)", "rgba(25,97,128,0.05)"]);
  return (
    <>
      <motion.span
        style={{ borderColor, backgroundColor }}
        className="rounded-[0.2em] border-[1.5px] px-[0.14em] text-primary [box-decoration-break:clone] [-webkit-box-decoration-break:clone]"
      >
        {children}
      </motion.span>{" "}
    </>
  );
}
