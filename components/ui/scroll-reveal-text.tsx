"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";

type ScrollRevealTextProps = {
  text: string;
  className?: string;
  /** Number of leading words to set in bold (e.g. the organisation's name) */
  boldLead?: number;
};

// Paragraph whose words brighten one by one as it scrolls through the viewport
export function ScrollRevealText({ text, className, boldLead = 0 }: ScrollRevealTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.55"],
  });
  const words = text.split(" ");

  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => (
        <Word
          key={i}
          progress={scrollYProgress}
          range={[i / words.length, (i + 1) / words.length]}
          bold={i < boldLead}
        >
          {word}
        </Word>
      ))}
    </p>
  );
}

function Word({
  children,
  progress,
  range,
  bold,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  bold?: boolean;
}) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  return (
    <>
      <motion.span style={{ opacity }} className={bold ? "font-bold text-ink" : undefined}>
        {children}
      </motion.span>{" "}
    </>
  );
}
