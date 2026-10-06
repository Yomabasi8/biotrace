"use client";

import { useRef } from "react";
import { motion, useMotionTemplate, useMotionValue, type Variants } from "motion/react";
import {
  Building2,
  CalendarDays,
  Flag,
  HandHeart,
  PiggyBank,
  UserPlus,
  type LucideIcon,
} from "lucide-react";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Seaweed } from "@/components/ui/sea-creatures";
import { easeOut, fadeUp } from "@/lib/motion";

const pathways: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: HandHeart,
    title: "Volunteer",
    body: "Lend a hand with beach clean-ups, community outreach, and support for our field and research activities.",
  },
  {
    icon: Flag,
    title: "Participate",
    body: "Take part in our programmes, from school engagement on plastic pollution to local conservation initiatives.",
  },
  {
    icon: CalendarDays,
    title: "Attend",
    body: "Join our talks, workshops, and training sessions on ocean science, biodiversity, and conservation.",
  },
  {
    icon: Building2,
    title: "Partner",
    body: "Work with us as a university, research institution, conservation organisation, or community group.",
  },
  {
    icon: PiggyBank,
    title: "Donate",
    body: "Help fund field research, laboratory analysis, and community education that protect our ecosystems.",
  },
  {
    icon: UserPlus,
    title: "Join Network",
    body: "Connect with students, researchers, and conservationists who share a passion for protecting our planet.",
  },
];

const headingWords = ["Conservation", "Needs", "More", "Than", "\n", "Observers."];

const word: Variants = {
  hidden: { opacity: 0, y: "0.5em", filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease: easeOut } },
};

export function GetInvolved() {
  return (
    <section
      id="get-involved"
      className="relative isolate overflow-hidden bg-[#dee8ed] pt-20 pb-[150px] md:pt-[84px] md:pb-[206px]"
    >
      <div className="container-site">
        <Eyebrow>Participate</Eyebrow>

        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.6 }}
          variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
          className="text-center text-[32px] leading-[1.15] font-bold text-ink sm:text-4xl md:text-[42px]"
        >
          {headingWords.map((w, i) =>
            w === "\n" ? (
              <br key={i} className="hidden md:block" />
            ) : (
              <motion.span key={i} variants={word} className="inline-block">
                {w}
                {i < headingWords.length - 1 && " "}
              </motion.span>
            ),
          )}
        </motion.h2>

        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.6 }}
          variants={fadeUp}
          className="mx-auto mt-4 max-w-[700px] text-center text-base leading-[1.6] text-ink-soft md:text-lg"
        >
          Whether you’re a student, researcher, volunteer, or organisation, there’s a way for you to
          help protect biodiversity with us.
        </motion.p>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={{ visible: { transition: { staggerChildren: 0.09 } } }}
          className="mt-10 grid gap-5 sm:grid-cols-2 md:mt-11 lg:grid-cols-3 lg:gap-6"
        >
          {pathways.map((p) => (
            <PathwayCard key={p.title} {...p} />
          ))}
        </motion.div>
      </div>

      {/* Seaweed rooted on the section floor, its tips reaching up past the cards */}
      <motion.div
        initial={{ opacity: 0, scaleY: 0.6 }}
        whileInView={{ opacity: 1, scaleY: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.6, ease: easeOut }}
        className="absolute bottom-0 left-[calc(50%-64px)] z-10 w-[150px] origin-bottom md:left-[calc(50%-84px)] md:w-[197px]"
      >
        <Seaweed src="/Images/seaweed.png" width={591} height={699} bend={110} />
      </motion.div>
    </section>
  );
}

function PathwayCard({ icon: Icon, title, body }: { icon: LucideIcon; title: string; body: string }) {
  const ref = useRef<HTMLElement>(null);
  const mx = useMotionValue(-200);
  const my = useMotionValue(-200);
  // Soft spotlight that follows the cursor across the card
  const spotlight = useMotionTemplate`radial-gradient(260px circle at ${mx}px ${my}px, rgba(25,97,128,0.09), transparent 70%)`;

  return (
    <motion.article
      ref={ref}
      variants={{
        hidden: { opacity: 0, y: 40, scale: 0.97 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease: easeOut } },
      }}
      whileHover={{ y: -6 }}
      onPointerMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        mx.set(e.clientX - r.left);
        my.set(e.clientY - r.top);
      }}
      onPointerLeave={() => {
        mx.set(-200);
        my.set(-200);
      }}
      className="group relative overflow-hidden rounded-2xl bg-white p-6 transition-shadow duration-500 hover:shadow-[0_24px_50px_-24px_rgba(25,97,128,0.35)]"
    >
      <motion.div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: spotlight }} />

      <div className="relative">
        <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[#c9d7de] text-[#2a5568] transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
          <Icon className="h-[18px] w-[18px] transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6" strokeWidth={1.8} />
        </span>

        <h3 className="mt-5 text-[22px] leading-tight font-bold text-ink">{title}</h3>
        <p className="mt-2 max-w-[330px] text-sm leading-5 text-ink-soft">{body}</p>
      </div>
    </motion.article>
  );
}
