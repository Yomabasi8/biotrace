"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { easeOut } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Paragraph revealed line by line: each rendered line slides up from behind its own mask.
 * Lines are measured from the real layout (and re-measured on resize), so it works with any
 * width and keeps justification: every line but the last is justified edge to edge.
 */
export function SplitLines({
  text,
  className,
  justify = false,
  delay = 0,
  stagger = 0.08,
}: {
  text: string;
  className?: string;
  justify?: boolean;
  delay?: number;
  stagger?: number;
}) {
  const measureRef = useRef<HTMLParagraphElement>(null);
  const [lines, setLines] = useState<string[] | null>(null);
  const inView = useInView(measureRef, { once: true, amount: 0.4 });
  const reduce = useReducedMotion();
  const words = text.split(" ");

  useLayoutEffect(() => {
    const el = measureRef.current;
    if (!el) return;
    const measure = () => {
      const spans = Array.from(el.querySelectorAll<HTMLSpanElement>("[data-word]"));
      const out: string[][] = [];
      let top: number | null = null;
      for (const s of spans) {
        if (top === null || Math.abs(s.offsetTop - top) > 2) {
          out.push([]);
          top = s.offsetTop;
        }
        out[out.length - 1].push(s.textContent ?? "");
      }
      setLines(out.map((l) => l.join(" ")));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [text]);

  return (
    <div className="relative">
      {/* Invisible copy used to find where the browser breaks the lines */}
      <p ref={measureRef} aria-hidden className={cn(className, "invisible absolute inset-x-0 top-0")}>
        {words.map((w, i) => (
          <span key={i} data-word>
            {w}{" "}
          </span>
        ))}
      </p>

      <p className={className}>
        {lines === null ? (
          <span className="opacity-0">{text}</span>
        ) : (
          lines.map((line, i) => (
            <span key={`${i}-${line}`} className="block overflow-hidden pb-[0.08em]">
              <motion.span
                initial={reduce ? false : { y: "110%" }}
                animate={inView ? { y: "0%" } : undefined}
                transition={{ duration: 0.9, delay: delay + i * stagger, ease: easeOut }}
                className={cn(
                  "block",
                  justify && i < lines.length - 1 && "text-justify [text-align-last:justify]",
                  justify && i === lines.length - 1 && "text-left",
                )}
              >
                {line}
              </motion.span>
            </span>
          ))
        )}
      </p>
    </div>
  );
}
