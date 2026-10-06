"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { easeOut } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function MissionVision() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // The photo drifts a touch slower than the page
  const photoY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-[#eef3f6] py-20 md:py-24">
      <div className="container-site grid items-center gap-12 lg:grid-cols-[1fr_auto_1fr] lg:gap-16">
        <Statement
          title="Our Mission"
          body="To empower a global community to use science, technology, and collaboration to understand, monitor, and protect biodiversity while developing sustainable solutions to environmental challenges."
          side="left"
        />

        {/* Pill photo */}
        <div className="relative mx-auto w-[220px] sm:w-[250px] lg:order-none lg:w-[290px]">
          {/* The in-view trigger sits on the wrapper: a fully clipped element never registers as visible */}
          <motion.div
            style={{ y: photoY }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            className="relative"
          >
            <motion.div
              variants={{
                hidden: { clipPath: "inset(50% 0% 50% 0% round 999px)", scale: 0.92 },
                visible: {
                  // Ends larger than the photo so its own pill shape, border and shadow show in full
                  clipPath: "inset(-40% -40% -40% -40% round 999px)",
                  scale: 1,
                  transition: { duration: 1.4, ease: [0.77, 0, 0.18, 1] },
                },
              }}
            >
              <motion.div
                animate={reduce ? undefined : { y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="drop-shadow-[0_30px_40px_rgba(25,97,128,0.18)]"
              >
                <Image
                  src="/Images/Frame 23.png"
                  alt="Scientist in safety goggles pipetting a sample beside young plants in a lab"
                  width={870}
                  height={1539}
                  sizes="(min-width: 1024px) 290px, 250px"
                  className="h-auto w-full"
                />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        <Statement
          title="Our Vision"
          body="A world where scientific knowledge and innovation drive meaningful action for biodiversity, healthy ecosystems, and a sustainable future."
          side="right"
        />
      </div>
    </section>
  );
}

function Statement({ title, body, side }: { title: string; body: string; side: "left" | "right" }) {
  const fromX = side === "left" ? -50 : 50;

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      variants={{ visible: { transition: { staggerChildren: 0.12, delayChildren: 0.35 } } }}
      className={cn(
        "max-w-[460px]",
        side === "right" ? "lg:-mt-24 lg:justify-self-end lg:text-right" : "lg:-mt-10",
      )}
    >
      <motion.h2
        variants={{
          hidden: { opacity: 0, x: fromX, filter: "blur(8px)" },
          visible: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.9, ease: easeOut } },
        }}
        className="text-[34px] leading-tight font-bold text-ink md:text-[42px]"
      >
        {title}
      </motion.h2>
      {/* Accent line that draws in under the heading */}
      <motion.span
        aria-hidden
        variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1, transition: { duration: 0.8, ease: easeOut } } }}
        className={cn(
          "mt-4 block h-[3px] w-14 rounded-full bg-coral",
          side === "right" ? "origin-right lg:ml-auto" : "origin-left",
        )}
      />
      <motion.p
        variants={{
          hidden: { opacity: 0, y: 16 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: easeOut } },
        }}
        className="mt-5 text-base leading-[1.6] text-ink-soft md:text-lg md:leading-[1.55] lg:text-justify lg:[text-align-last:left]"
      >
        {body}
      </motion.p>
    </motion.div>
  );
}
