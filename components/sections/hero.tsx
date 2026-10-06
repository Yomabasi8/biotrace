"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type Variants } from "motion/react";
import { BackgroundVideo } from "@/components/ui/background-video";
import { ButtonLink } from "@/components/ui/button";
import { easeOut } from "@/lib/motion";

// "\n" marks the desktop line break from the design
const headline = ["Where", "Science", "Meets", "\n", "Sustainability"];

// A slow, buoyant ease: quick lift off the water, long gentle settle
const buoyant = [0.16, 1, 0.3, 1] as const;

// The whole copy block starts a full block-height down (fully behind the water) and rises
const surface: Variants = {
  submerged: { y: "100%" },
  surfaced: {
    y: 0,
    transition: { duration: 2.2, delay: 0.6, ease: buoyant, staggerChildren: 0.12, delayChildren: 0.6 },
  },
};

// Each line trails slightly behind the block, like it's dragging free of the water
const trail: Variants = {
  submerged: { y: 48, filter: "blur(6px)" },
  surfaced: { y: 0, filter: "blur(0px)", transition: { duration: 1.8, ease: buoyant } },
};

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Gentle parallax: copy drifts up and fades, ocean sinks slightly slower than the page
  const copyY = useTransform(scrollYProgress, [0, 0.5], [0, -60]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const videoY = useTransform(scrollYProgress, [0, 1], [0, 120]);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative isolate overflow-hidden bg-white pt-[136px] md:pt-[256px]"
    >
      {/* Soft misty glow behind the nav and headline */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.6, ease: easeOut }}
        className="pointer-events-none absolute top-[-120px] left-1/2 -z-10 h-[720px] w-[min(1100px,140vw)] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_center,#dde4ea_0%,rgba(228,234,239,0.6)_35%,rgba(255,255,255,0)_70%)]"
      />

      {/*
        Copy rises from behind the ocean. The wrapper's mask fades text out just below the buttons,
        exactly where the water's own mask starts fading in (--wl), so the text and water never
        overlap: words vanish at the waterline as if they're passing behind it.
      */}
      <motion.div
        style={{ y: copyY, opacity: copyOpacity }}
        className="container-site relative z-10 text-center [mask-image:linear-gradient(to_bottom,#000_calc(100%_-_184px),transparent_calc(100%_-_144px))]"
      >
        <motion.div
          initial="submerged"
          animate="surfaced"
          variants={surface}
          className="pb-[200px] will-change-transform"
        >
          <motion.h1
            variants={{ surfaced: { transition: { staggerChildren: 0.07 } } }}
            className="mx-auto max-w-[680px] text-[38px] leading-[1.15] font-bold text-ink sm:text-5xl md:text-[56px]"
          >
            {headline.map((word, i) =>
              word === "\n" ? (
                <br key={i} className="hidden md:block" />
              ) : (
                <motion.span key={i} variants={trail} className="inline-block will-change-transform">
                  {word}
                  {i < headline.length - 1 && "\u00a0"}
                </motion.span>
              ),
            )}
          </motion.h1>

          <motion.p
            variants={trail}
            className="mx-auto mt-6 max-w-[580px] text-base leading-[1.65] text-ink-soft md:mt-8 md:text-lg"
          >
            Using science, technology, and collaboration to understand, monitor, and
            protect biodiversity across 24 critical global biomes.
          </motion.p>

          <motion.div
            variants={trail}
            className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-[76px] md:mt-12"
          >
            <ButtonLink href="/work" className="w-full max-w-[260px] sm:w-auto">
              Explore our Work
            </ButtonLink>
            <ButtonLink href="#support" variant="blush" className="w-full max-w-[260px] sm:w-auto">
              Support BioTrace
            </ButtonLink>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Full-bleed ocean. --wl is the waterline: its -mt offset plus the 16px gap below the buttons */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.1, ease: easeOut }}
        className="pointer-events-none relative z-20 -mt-[224px] h-[clamp(300px,calc(100svh_-_400px),480px)] w-full overflow-hidden [--wl:40px] [mask-image:linear-gradient(to_bottom,transparent_var(--wl),rgba(0,0,0,0.7)_calc(var(--wl)_+_50px),#000_calc(var(--wl)_+_120px))] md:[--wl:56px] md:-mt-[240px] md:h-[clamp(380px,calc(100svh_-_470px),620px)]"
      >
        <motion.div
          style={{ y: videoY }}
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.4, delay: 0.1, ease: easeOut }}
          className="absolute inset-[-60px_0_-60px_0]"
        >
          <BackgroundVideo
            poster="/Videos/hero-poster.jpg"
            sources={[
              { src: "/Videos/hero.webm", type: "video/webm" },
              { src: "/Videos/hero.mp4", type: "video/mp4" },
            ]}
            className="object-top"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
