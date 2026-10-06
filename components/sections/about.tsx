"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform, type Variants } from "motion/react";
import { ButtonLink } from "@/components/ui/button";
import { ScrollRevealText } from "@/components/ui/scroll-reveal-text";
import { DnaHelix } from "@/components/ui/dna-helix";
import { easeOut } from "@/lib/motion";
import { cn } from "@/lib/utils";

const copy =
  "BioTrace Global is an emerging global initiative dedicated to advancing environmental conservation, biodiversity research, and sustainable solutions through science, technology, and collaboration. We bring together students, researchers, scientists, conservationists, and environmental enthusiasts to support innovative approaches for understanding and protecting our planet’s ecosystems. BioTrace Global aims to strengthen biodiversity monitoring and promote the use of modern scientific tools to address environmental challenges. We are building a global community of passionate individuals committed to creating a sustainable future for nature and society.";

const heading = "About Us";

const letter: Variants = {
  hidden: { opacity: 0, y: "0.6em", filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: easeOut } },
};

const pillReveal: Variants = {
  hidden: { opacity: 0, y: 90, scale: 0.94 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 1.2, delay, ease: easeOut },
  }),
};

export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Depth: pills and DNA strands drift at different speeds while scrolling
  const pillUpY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const pillDownY = useTransform(scrollYProgress, [0, 1], [-40, 70]);
  const dnaTopY = useTransform(scrollYProgress, [0, 1], [-50, 90]);
  const dnaTopRotate = useTransform(scrollYProgress, [0, 1], [-8, 10]);
  const dnaBottomY = useTransform(scrollYProgress, [0, 1], [80, -60]);
  const dnaBottomRotate = useTransform(scrollYProgress, [0, 1], [10, -6]);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative isolate overflow-hidden bg-[#dee8ed] py-20 md:pt-16 md:pb-28"
    >
      <Dna
        className="top-[18px] right-[-90px] h-[84px] w-[280px] md:top-[45px] md:right-[-120px] md:h-[130px] md:w-[440px]"
        angle={55}
        style={{ y: dnaTopY, rotate: dnaTopRotate }}
        from={{ x: 80, y: -40 }}
      />
      <Dna
        className="bottom-[28px] left-[-100px] h-[84px] w-[280px] md:bottom-[75px] md:left-[-110px] md:h-[130px] md:w-[440px]"
        angle={50}
        style={{ y: dnaBottomY, rotate: dnaBottomRotate }}
        from={{ x: -80, y: 40 }}
        phase={Math.PI / 2}
        floatDelay={1.5}
      />

      <div className="container-site relative">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.8 }}
          variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
          aria-label={heading}
          className="text-center text-[38px] leading-tight font-bold text-ink md:text-5xl"
        >
          {heading.split("").map((char, i) => (
            <motion.span key={i} aria-hidden variants={letter} className="inline-block">
              {char === " " ? " " : char}
            </motion.span>
          ))}
        </motion.h2>

        <div className="mt-12 grid items-start gap-14 md:mt-20 lg:grid-cols-[minmax(0,640px)_1fr] lg:gap-12">
          <div>
            <ScrollRevealText
              text={copy}
              className="text-lg leading-[1.6] text-ink-soft md:text-[22px] md:leading-[1.33] md:text-justify"
            />

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ duration: 0.8, ease: easeOut }}
              className="mt-12 md:mt-[70px]"
            >
              <ButtonLink href="/about" className="px-11">
                Learn More
              </ButtonLink>
            </motion.div>
          </div>

          {/* Staggered pill photos; the second sits lower, as in the design */}
          <div className="mx-auto flex w-full max-w-[520px] items-start justify-center gap-5 pb-10 sm:gap-[50px] lg:mr-0 lg:max-w-none lg:justify-end lg:pb-0">
            <motion.div style={{ y: pillUpY }} className="w-[44%] max-w-[230px]">
              <Pill src="/Images/circle (1).png" alt="Scientist holding a lab-grown meat sample in a petri dish" delay={0} />
            </motion.div>
            <motion.div style={{ y: pillDownY }} className="mt-[90px] w-[44%] max-w-[230px] md:mt-[172px]">
              <Pill src="/Images/circle.png" alt="Researcher in safety glasses working in a plant lab" delay={0.18} />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Pill({ src, alt, delay }: { src: string; alt: string; delay: number }) {
  return (
    <motion.div
      custom={delay}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={pillReveal}
      whileHover={{ y: -8, rotate: -1.5, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="drop-shadow-[0_24px_40px_rgba(25,97,128,0.16)]"
    >
      <Image
        src={src}
        alt={alt}
        width={720}
        height={1485}
        sizes="(min-width: 1024px) 230px, 44vw"
        className="h-auto w-full"
      />
    </motion.div>
  );
}

function Dna({
  className,
  angle,
  style,
  from,
  phase = 0,
  floatDelay = 0,
}: {
  className: string;
  angle: number;
  style: React.ComponentProps<typeof motion.div>["style"];
  from: { x: number; y: number };
  phase?: number;
  floatDelay?: number;
}) {
  return (
    <motion.div style={style} className={cn("pointer-events-none absolute -z-10", className)}>
      <motion.div
        initial={{ opacity: 0, ...from }}
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: easeOut }}
        className="h-full w-full"
      >
        {/* Slow idle bob on top of the helix's own twist */}
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 7, delay: floatDelay, repeat: Infinity, ease: "easeInOut" }}
          className="h-full w-full"
        >
          <DnaHelix phase={phase} className="h-full w-full" style={{ rotate: `${angle}deg` }} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
