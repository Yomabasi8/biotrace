"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { ScrollRevealText } from "@/components/ui/scroll-reveal-text";
import { MissionVision } from "@/components/sections/about-page/mission-vision";
import { Founder } from "@/components/sections/about-page/founder";
import { Team } from "@/components/sections/about-page/team";
import { TeamRoster } from "@/components/sections/about-page/team-roster";
import { JoinCta } from "@/components/sections/join-cta";
import { easeOut } from "@/lib/motion";
import { cn } from "@/lib/utils";

const titleWords = ["About", "BioTrace", "Global"];

const mission =
  "BioTrace Global is an emerging global initiative dedicated to advancing environmental conservation, biodiversity research, and sustainable solutions through science, technology, and collaboration. We bring together students, researchers, scientists, conservationists, and environmental enthusiasts to support innovative approaches for understanding and protecting our planet’s ecosystems. BioTrace Global aims to strengthen biodiversity monitoring and promote the use of modern scientific tools to address environmental challenges. We are building a global community of passionate individuals committed to creating a sustainable future for nature and society.";

/*
 * The photos ship with 123px rounded corners baked into their transparency. Matching that
 * radius as a percentage (x% of width / y% of height) lets the frame clip identically at any
 * size, so the hover zoom never reveals the transparent corners.
 */
const photos = {
  biologist: {
    src: "/Images/marine biologist.png",
    alt: "Scientist in a mask and goggles pipetting blue liquid into a petri dish",
    w: 1233,
    h: 840,
  },
  sampling: {
    src: "/Images/mariner.png",
    alt: "Field researcher in protective gear collecting a water sample from a river",
    w: 1035,
    h: 1566,
  },
  diver: {
    src: "/Images/reef.png",
    alt: "Diver photographing a pink soft coral reef underwater",
    w: 1158,
    h: 840,
  },
} as const;
const BAKED_RADIUS = 123;

export function AboutIntro() {
  return (
    <main className="flex-1">
      <section className="relative overflow-hidden bg-white pt-[150px] pb-10 md:pt-[214px] md:pb-14">
        {/* Soft glow behind the title, echoing the home hero */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-[-140px] left-1/2 -z-0 h-[560px] w-[min(1100px,140vw)] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_center,#e3eaef_0%,rgba(228,234,239,0.5)_38%,rgba(255,255,255,0)_70%)]"
        />

        <div className="container-site relative">
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.09, delayChildren: 0.3 } } }}
            className="text-center text-[38px] leading-tight font-bold text-ink sm:text-5xl md:text-[56px]"
          >
            {titleWords.map((w, i) => (
              <motion.span
                key={w}
                variants={{
                  hidden: { opacity: 0, y: "0.5em", filter: "blur(10px)" },
                  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.9, ease: easeOut } },
                }}
                className="inline-block"
              >
                {w}
                {i < titleWords.length - 1 && " "}
              </motion.span>
            ))}
          </motion.h1>

          <Bento />
        </div>
      </section>

      <Mission />
      <MissionVision />
      <Founder />
      <Team />
      <TeamRoster />
      <JoinCta />
    </main>
  );
}

/* ---------------------------------------------------------------------------
 * Bento grid: statement cards and photos
 * ------------------------------------------------------------------------- */
function Bento() {
  const ref = useRef<HTMLDivElement>(null);
  // Starts aligned; as the grid scrolls away the centre photo drifts up against the sides for depth
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  // Only on the three-column layout; when stacked it would make the gaps uneven
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setWide(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  const centreY = useTransform(scrollYProgress, [0, 1], wide ? [0, -48] : [0, 0]);
  const sideY = useTransform(scrollYProgress, [0, 1], wide ? [0, 16] : [0, 0]);

  return (
    <div
      ref={ref}
      className="mt-12 grid gap-5 sm:grid-cols-2 md:mt-16 lg:grid-cols-[1.12fr_1fr_1.08fr] lg:gap-6"
    >
      {/* Left column */}
      <motion.div style={{ y: sideY }} className="flex flex-col gap-5 lg:gap-6">
        <StatementCard
          lead="An"
          body="Emerging global initiative dedicated to advancing environmental conservation and sustainable solutions."
          tone="blue"
          delay={0.55}
          className="lg:flex-1"
        />
        <Photo {...photos.biologist} delay={0.7} from="left" />
      </motion.div>

      {/* Centre column: tall photo */}
      <motion.div style={{ y: centreY }} className="sm:row-span-2 lg:row-span-1">
        <Photo {...photos.sampling} delay={0.85} from="bottom" className="sm:h-full lg:h-auto" />
      </motion.div>

      {/* Right column */}
      <motion.div style={{ y: sideY }} className="flex flex-col gap-5 lg:gap-6">
        <Photo {...photos.diver} delay={1} from="right" />
        <StatementCard
          lead="We"
          body="Bring together students, researchers, to support and protecting our planet’s ecosystems."
          tone="coral"
          delay={1.15}
          className="lg:flex-1"
        />
      </motion.div>
    </div>
  );
}

function StatementCard({
  lead,
  body,
  tone,
  delay,
  className,
}: {
  lead: string;
  body: string;
  tone: "blue" | "coral";
  delay: number;
  className?: string;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, delay, ease: easeOut }}
      whileHover={{ y: -4 }}
      className={cn(
        "group relative flex flex-col justify-center overflow-hidden rounded-[22px] p-6 text-white md:p-7 lg:p-6 xl:p-7",
        tone === "blue" ? "bg-[#5f8ea9]" : "bg-[#e07a63]",
        className,
      )}
    >
      {/* Slow sheen across the card on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-[320%]"
      />
      <motion.h2
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: delay + 0.2, ease: easeOut }}
        className="text-[44px] leading-none font-bold md:text-[52px]"
      >
        {lead}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: delay + 0.32, ease: easeOut }}
        className="mt-4 max-w-[400px] text-[15px] leading-[1.45] text-white/95 md:text-base"
      >
        {body}
      </motion.p>
    </motion.article>
  );
}

function Photo({
  src,
  alt,
  w,
  h,
  delay,
  from,
  className,
}: {
  src: string;
  alt: string;
  w: number;
  h: number;
  delay: number;
  from: "left" | "right" | "bottom";
  className?: string;
}) {
  const radius = `${(BAKED_RADIUS / w) * 100}% / ${(BAKED_RADIUS / h) * 100}%`;
  // Reveal: the frame wipes open from one side while the photo settles from a slight zoom
  const hidden =
    from === "left" ? "inset(0% 100% 0% 0%)" : from === "right" ? "inset(0% 0% 0% 100%)" : "inset(100% 0% 0% 0%)";

  return (
    <motion.div
      initial={{ clipPath: hidden }}
      animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
      transition={{ duration: 1.3, delay, ease: [0.77, 0, 0.18, 1] }}
      className={cn("group relative", className)}
    >
      <div
        className="relative h-full overflow-hidden"
        style={{ borderRadius: radius, aspectRatio: `${w} / ${h}` }}
      >
        <motion.div
          initial={{ scale: 1.25 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, delay, ease: easeOut }}
          className="h-full w-full"
        >
          <Image
            src={src}
            alt={alt}
            width={w}
            height={h}
            priority={from === "bottom"}
            sizes="(min-width: 1024px) 420px, (min-width: 640px) 50vw, 100vw"
            className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ---------------------------------------------------------------------------
 * Mission statement with drifting starfish
 * ------------------------------------------------------------------------- */
function Mission() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  return (
    <section ref={ref} className="relative overflow-hidden bg-white pt-10 pb-24 md:pt-16 md:pb-32">
      <Starfish
        progress={scrollYProgress}
        className="top-0 right-[-36px] w-[76px] md:top-2 md:right-[calc(50%-700px)] md:w-[118px]"
        spin={[-20, 40]}
        drift={[30, -50]}
        delay={0}
      />
      <Starfish
        progress={scrollYProgress}
        className="bottom-4 left-[-32px] w-[72px] md:bottom-28 md:left-[calc(50%-700px)] md:w-[112px]"
        spin={[25, -35]}
        drift={[-20, 40]}
        delay={1.2}
      />

      <div className="container-site relative">
        <ScrollRevealText
          text={mission}
          boldLead={2}
          className="mx-auto max-w-[1080px] text-center text-[20px] leading-[1.55] text-ink-soft sm:text-2xl md:text-[30px] md:leading-[1.42]"
        />
      </div>
    </section>
  );
}

function Starfish({
  progress,
  className,
  spin,
  drift,
  delay,
}: {
  progress: MotionValue<number>;
  className: string;
  spin: [number, number];
  drift: [number, number];
  delay: number;
}) {
  const rotate = useTransform(progress, [0, 1], spin);
  const y = useTransform(progress, [0, 1], drift);

  return (
    <motion.div aria-hidden style={{ rotate, y }} className={cn("pointer-events-none absolute", className)}>
      <motion.div
        initial={{ opacity: 0, scale: 0.4, rotate: -90 }}
        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ type: "spring", stiffness: 70, damping: 12, delay: 0.1 }}
      >
        {/* Slow "creeping" wobble, like tube feet shuffling it along */}
        <motion.div
          animate={{ rotate: [0, 6, -3, 0], scale: [1, 1.04, 0.98, 1] }}
          transition={{ duration: 7, delay, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image src="/Images/starfish-about.png" alt="" width={212} height={210} className="h-auto w-full" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
