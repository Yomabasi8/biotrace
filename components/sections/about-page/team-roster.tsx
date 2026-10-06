"use client";

import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { easeOut } from "@/lib/motion";

/* Avatars are cut from the team photos with their background colour filled in (public/Images/team) */
const members = [
  {
    name: "Prof. Eunice Idowu",
    role: "Board of Trustees",
    bio: "As a Trustee, she provides strategic guidance and contributes her expertise to strengthening BioTrace Global’s scientific and environmental mission.",
    src: "/Images/team/eunice.webp",
    ring: "#f4a7b6",
  },
  {
    name: "Dr. Segun Olayinka Oladipo",
    role: "Board of Trustees",
    bio: "As a Trustee, Dr. Segun Olayinka Oladipo contributes to the organisation’s governance and strategic development, helping to guide BioTrace Global’s growth and long-term impact.",
    src: "/Images/team/segun.webp",
    ring: "#3fc8d2",
  },
  {
    name: "Yomabasi Fortune Bassey",
    role: "Website Designer & Developer",
    bio: "As the Website Designer and Developer, she leads the design and development of BioTrace Global’s digital presence, while also creating visuals that communicate the organisation’s work and impact.",
    src: "/Images/team/yomabasi.webp",
    ring: "#33b843",
  },
  {
    name: "James David Uwem",
    role: "Secretary",
    bio: "As the Secretary, he supports the coordination and administration of BioTrace Global’s activities, helping to maintain effective communication, documentation, and organisational records.",
    src: "/Images/team/james.webp",
    ring: "#f4a7b6",
  },
];

const titleWords = ["The", "BioTrace", "Team"];

const rise: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeOut } },
};

export function TeamRoster() {
  const reduce = useReducedMotion();

  return (
    <section className="relative isolate overflow-hidden bg-white pt-16 pb-24 md:pt-20 md:pb-32">
      {/* Pastel wash at the top, carrying on from the collage above */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[260px] bg-[radial-gradient(50%_90%_at_15%_0%,rgba(94,180,80,0.08),transparent_70%),radial-gradient(45%_90%_at_55%_0%,rgba(108,198,208,0.08),transparent_70%),radial-gradient(45%_90%_at_90%_0%,rgba(244,194,203,0.14),transparent_70%)]"
      />

      <div className="container-site">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.8 }}
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          aria-label="The BioTrace Team"
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

        <ul className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 md:mt-[72px] lg:grid-cols-4 lg:gap-x-10">
          {members.map((m, i) => (
            <MemberCard key={m.name} {...m} index={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}

function MemberCard({
  name,
  role,
  bio,
  src,
  ring,
  index,
}: (typeof members)[number] & { index: number }) {

  return (
    <motion.li
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      viewport={{ once: true, amount: 0.4 }}
      variants={{ visible: { transition: { staggerChildren: 0.09, delayChildren: index * 0.12 } } }}
      className="group mx-auto flex max-w-[280px] flex-col items-center text-center"
    >
      {/* Avatar: pops in and a ring in its own colour draws around it */}
      <motion.div
        variants={{
          hidden: { opacity: 0, scale: 0.6, rotate: -12 },
          visible: { opacity: 1, scale: 1, rotate: 0, transition: { type: "spring", stiffness: 120, damping: 14 } },
          hover: { y: -6 },
        }}
        className="relative h-[150px] w-[150px] md:h-[164px] md:w-[164px]"
      >
        <motion.svg
          aria-hidden
          viewBox="0 0 100 100"
          className="absolute inset-[-9%] h-[118%] w-[118%] -rotate-90"
        >
          <motion.circle
            cx="50"
            cy="50"
            r="48.5"
            fill="none"
            stroke={ring}
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeDasharray="0 1"
            variants={{
              hidden: { pathLength: 0, opacity: 0 },
              visible: { pathLength: 1, opacity: 1, transition: { duration: 1.4, delay: 0.25, ease: easeOut } },
            }}
          />
        </motion.svg>

        <motion.div
          variants={{ hover: { scale: 1.05 } }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="relative h-full w-full overflow-hidden rounded-full"
        >
          <Image src={src} alt={`Portrait of ${name}`} fill sizes="164px" className="object-cover" />
        </motion.div>
      </motion.div>

      <motion.h3 variants={rise} className="mt-7 text-lg leading-snug font-bold tracking-[-0.4px] text-ink md:text-[19px]">
        {name}
      </motion.h3>
      <motion.p variants={rise} className="mt-1.5 font-heading text-[15px] tracking-[-0.2px] text-[#2a5568] italic">
        {role}
      </motion.p>
      <motion.p variants={rise} className="mt-4 text-sm leading-[1.5] text-ink-soft">
        {bio}
      </motion.p>
    </motion.li>
  );
}
