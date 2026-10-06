"use client";

import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { ButtonLink } from "@/components/ui/button";
import { useGetInvolved } from "@/components/get-involved/get-involved-provider";
import { Eyebrow } from "@/components/ui/eyebrow";
import { easeOut, fadeUp } from "@/lib/motion";

const headingWords = ["Conservation", "is", "Collaborative."];

const word: Variants = {
  hidden: { opacity: 0, y: "0.5em", filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: easeOut } },
};

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
      </div>

      <FeaturedPartner />

    </section>
  );
}

function FeaturedPartner() {
  const getInvolved = useGetInvolved();
  return (
    <motion.article
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1, ease: easeOut }}
      className="relative mt-12 overflow-hidden border-y border-[#dbe6eb] bg-[linear-gradient(135deg,#f4f8fa_0%,#eaf1f4_100%)] md:mt-16"
    >
      {/* Full-bleed band; the content inside stays on the site's 1200px grid */}
      <div className="container-site relative grid items-center gap-10 py-10 sm:py-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16 lg:py-16">
        <PartnerOrbit />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } } }}
        >
          <motion.p
            variants={fadeUp}
            className="font-mono text-xs font-medium tracking-[0.22em] text-primary uppercase md:text-[13px]"
          >
            Founding Partner
          </motion.p>
          <motion.h3 variants={fadeUp} className="mt-3 text-[30px] leading-tight font-bold text-ink md:text-[38px]">
            ATES Initiative
          </motion.h3>
          <motion.p variants={fadeUp} className="mt-2 text-base font-medium text-primary md:text-lg">
            Advancing Transformation, Environment &amp; Sustainability
          </motion.p>
          <motion.p variants={fadeUp} className="mt-5 max-w-[520px] text-base leading-[1.7] text-ink-soft">
            Together with ATES Initiative, we connect conservation science with the communities who
            protect these ecosystems, turning shared research into lasting, sustainable action.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-9">
            <ButtonLink
              href="/#get-involved"
              onClick={(e) => {
                e.preventDefault();
                getInvolved.open("partner");
              }}
            >
              Become a Partner
            </ButtonLink>
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
          className="relative h-full w-full overflow-hidden rounded-full bg-white p-[7%] ring-1 ring-black/5"
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
