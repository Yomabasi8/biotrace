"use client";

import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { ArrowRight, Handshake } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { easeOut, fadeUp } from "@/lib/motion";

const headingWords = ["Conservation", "is", "Collaborative."];

const word: Variants = {
  hidden: { opacity: 0, y: "0.5em", filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: easeOut } },
};

const focusAreas = ["Environment", "Sustainability", "Biodiversity", "Community"];

const partnerTypes = [
  "Universities",
  "Environmental NGOs",
  "Research Foundations",
  "Community Stewards",
  "Hardware Innovators",
  "Park Authorities",
  "Field Scientists",
];

export function Partners() {
  return (
    <section id="partners" className="relative isolate overflow-hidden bg-white pt-20 pb-20 md:pt-[72px] md:pb-24">
      <div className="container-site">
        <Eyebrow>Our Partners</Eyebrow>

        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.6 }}
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          className="text-center text-[32px] leading-[1.15] font-bold text-ink sm:text-4xl md:text-[42px]"
        >
          {headingWords.map((w, i) => (
            <motion.span key={i} variants={word} className="inline-block">
              {w}
              {i < headingWords.length - 1 && " "}
            </motion.span>
          ))}
        </motion.h2>

        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.6 }}
          variants={fadeUp}
          className="mx-auto mt-4 max-w-[700px] text-center text-base leading-[1.6] text-ink-soft md:text-lg"
        >
          Working alongside premier scientific institutions, global research foundations, and local
          community stewards.
        </motion.p>

        <FeaturedPartner />
      </div>

      <PartnerTicker />
    </section>
  );
}

function FeaturedPartner() {
  return (
    <motion.article
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1, ease: easeOut }}
      className="relative mt-12 overflow-hidden rounded-[28px] border border-[#dbe6eb] bg-[linear-gradient(135deg,#f4f8fa_0%,#eaf1f4_100%)] md:mt-16"
    >
      {/* Faint contour lines, like a topographic survey map */}
      <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.35]" preserveAspectRatio="none">
        <defs>
          <pattern id="partner-contours" width="220" height="220" patternUnits="userSpaceOnUse">
            <path
              d="M0 110 Q55 70 110 110 T220 110 M0 150 Q55 110 110 150 T220 150 M0 70 Q55 30 110 70 T220 70 M0 190 Q55 150 110 190 T220 190 M0 30 Q55 -10 110 30 T220 30"
              fill="none"
              stroke="#196180"
              strokeOpacity="0.12"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#partner-contours)" />
      </svg>

      <div className="relative grid items-center gap-10 p-6 sm:p-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16 lg:p-16">
        <PartnerOrbit />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } } }}
        >
          <motion.span
            variants={fadeUp}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/70 px-3 py-1.5 font-mono text-[11px] font-medium tracking-[0.18em] text-primary uppercase"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-coral opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-coral" />
            </span>
            Founding Partner
          </motion.span>

          <motion.h3 variants={fadeUp} className="mt-5 text-[30px] leading-tight font-bold text-ink md:text-[38px]">
            ATES Initiative
          </motion.h3>
          <motion.p variants={fadeUp} className="mt-2 text-base font-medium text-primary md:text-lg">
            Advancing Transformation, Environment &amp; Sustainability
          </motion.p>
          <motion.p variants={fadeUp} className="mt-5 max-w-[520px] text-base leading-[1.7] text-ink-soft">
            Together with ATES Initiative, we connect conservation science with the communities who
            protect these ecosystems, turning shared research into lasting, sustainable action.
          </motion.p>

          <motion.ul variants={fadeUp} className="mt-6 flex flex-wrap gap-2">
            {focusAreas.map((area) => (
              <li
                key={area}
                className="rounded-full border border-[#cddbe2] bg-white px-3.5 py-1.5 text-[13px] text-ink-soft transition-colors duration-300 hover:border-primary/40 hover:text-primary"
              >
                {area}
              </li>
            ))}
          </motion.ul>

          <motion.div variants={fadeUp} className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
            <ButtonLink href="#get-involved" className="gap-2">
              <Handshake className="h-[18px] w-[18px]" strokeWidth={1.8} />
              Become a Partner
            </ButtonLink>
            <a
              href="#get-involved"
              className="group inline-flex items-center gap-1.5 text-[15px] font-medium text-ink transition-colors hover:text-primary"
            >
              Partnership enquiries
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </motion.div>
        </motion.div>
      </div>
    </motion.article>
  );
}

// Partner logo at the centre of slowly counter-rotating orbit rings
function PartnerOrbit() {
  const reduce = useReducedMotion();
  const spin = (duration: number, direction = 1) =>
    reduce ? undefined : { animate: { rotate: 360 * direction }, transition: { duration, repeat: Infinity, ease: "linear" as const } };

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[420px]">
      {/* Outer ring with two satellites */}
      <motion.div {...spin(60)} className="absolute inset-0 rounded-full border border-dashed border-primary/25">
        <span className="absolute top-1/2 -left-1.5 h-3 w-3 rounded-full bg-primary shadow-[0_0_0_6px_rgba(25,97,128,0.12)]" />
        <span className="absolute -top-1 left-[70%] h-2 w-2 rounded-full bg-[#5aa469]" />
      </motion.div>

      {/* Middle ring, counter-rotating */}
      <motion.div {...spin(42, -1)} className="absolute inset-[11%] rounded-full border border-primary/15">
        <span className="absolute -right-1 top-[30%] h-2.5 w-2.5 rounded-full bg-coral shadow-[0_0_0_5px_rgba(232,115,90,0.15)]" />
        <span className="absolute bottom-[6%] left-[16%] h-1.5 w-1.5 rounded-full bg-primary/60" />
      </motion.div>

      {/* Soft glow behind the logo */}
      <div className="absolute inset-[18%] rounded-full bg-[radial-gradient(circle,rgba(25,97,128,0.16)_0%,transparent_70%)] blur-2xl" />

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ type: "spring", stiffness: 120, damping: 16, delay: 0.2 }}
        className="absolute inset-[22%]"
      >
        <motion.div
          animate={reduce ? undefined : { y: [0, -8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="relative h-full w-full overflow-hidden rounded-full bg-white p-[7%] shadow-[0_30px_60px_-25px_rgba(25,97,128,0.45)] ring-1 ring-black/5"
        >
          {/* 7% inset keeps the logo's tagline corners inside the circle */}
          <div className="relative h-full w-full">
            <Image
              src="/Images/partner-ates.jpg"
              alt="ATES Initiative logo"
              fill
              sizes="(min-width: 1024px) 240px, 50vw"
              className="object-contain"
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

// Endless ticker of the kinds of organisations BioTrace partners with
function PartnerTicker() {
  const reduce = useReducedMotion();
  const row = [...partnerTypes, ...partnerTypes];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 1, delay: 0.2 }}
      className="mt-14 md:mt-16"
    >
      <p className="text-center font-mono text-xs tracking-[0.18em] text-ink-soft/70 uppercase">
        Open to collaborators across
      </p>
      <div className="relative mt-5 overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)]">
        <motion.ul
          animate={reduce ? undefined : { x: ["0%", "-50%"] }}
          transition={{ duration: 36, repeat: Infinity, ease: "linear" }}
          className="flex w-max items-center"
        >
          {row.map((type, i) => (
            <li key={i} className="flex items-center" aria-hidden={i >= partnerTypes.length}>
              <span className="px-6 text-xl font-semibold tracking-[-0.5px] whitespace-nowrap text-ink/80 md:px-9 md:text-2xl font-heading">
                {type}
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-coral/70" />
            </li>
          ))}
        </motion.ul>
      </div>
    </motion.div>
  );
}
