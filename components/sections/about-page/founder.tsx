"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  useInView,
} from "motion/react";
import { ScrollRevealText } from "@/components/ui/scroll-reveal-text";
import { easeOut } from "@/lib/motion";

const bio = [
  "Faith Success Adeshola is an oceanographer and conservation researcher passionate about protecting Africa's aquatic and terrestrial ecosystems through science and community action. She holds an MPhil in Oceanography and Limnology (Distinction) and a BSc in Zoology from Kwara State University, Nigeria.",
  "Faith founded BioTrace Global to bridge ocean science, technology, and community-driven stewardship, building a network of researchers, students, and institutions committed to understanding and protecting our oceans. She believes that a sustainable ocean future depends on making ocean science accessible, collaborative, and rooted in local communities.",
];

const LINKEDIN_URL = "https://www.linkedin.com/in/faith-adeshola-58900422a/";

// Founder.png ships with 291px rounded corners baked into its transparency
const PHOTO = { w: 1566, h: 1872, radius: 291 };

export function Founder() {
  return (
    <section className="relative overflow-hidden bg-white py-20 md:py-28">
      <div className="container-site">
        <h2 className="text-center text-[34px] leading-tight font-bold text-ink sm:text-[42px] md:text-[52px]">
          <MaskedWords text="Meet Our Founder" />
        </h2>

        <div className="mt-14 grid items-start gap-12 md:mt-20 lg:grid-cols-[minmax(0,520px)_minmax(0,1fr)] lg:gap-[52px]">
          <Portrait />

          <div className="lg:pt-2">
            <h3 className="text-[30px] leading-tight font-bold text-ink md:text-[38px]">
              <MaskedWords text="Faith Success Adeshola" delay={0.15} />
            </h3>
            <p className="mt-2 font-heading text-xl tracking-[-0.5px] text-ink italic md:text-[28px]">
              <MaskedWords text="Founder, BioTrace Global" delay={0.3} />
            </p>

            <div className="mt-8 space-y-7 md:mt-10">
              {bio.map((para, i) => (
                <ScrollRevealText
                  key={i}
                  text={para}
                  className="text-base leading-[1.6] text-ink-soft md:text-[19px] md:leading-[1.55] lg:text-justify"
                />
              ))}
            </div>

            <motion.a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Faith Success Adeshola on LinkedIn"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ duration: 0.7, ease: easeOut }}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.95 }}
              className="mt-8 inline-flex h-11 w-11 items-center justify-center rounded-full border-[1.5px] border-[#0a66c2] text-[#0a66c2] transition-colors duration-300 hover:bg-[#0a66c2] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary md:mt-10"
            >
              <LinkedInIcon className="h-5 w-5" />
            </motion.a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------------
 * Portrait: wipes up into view, tilts toward the cursor with a moving sheen,
 * and wears a rotating "Founder" badge that spins faster while you scroll
 * ------------------------------------------------------------------------- */
function Portrait() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  // Triggered from the wrapper: the clipped frame itself has no visible area to observe
  const inView = useInView(ref, { once: true, amount: 0.3 });

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(py, [0, 1], [7, -7]), { stiffness: 150, damping: 18 });
  const rotateY = useSpring(useTransform(px, [0, 1], [-9, 9]), { stiffness: 150, damping: 18 });
  const glareX = useTransform(px, [0, 1], ["0%", "100%"]);
  const glareY = useTransform(py, [0, 1], ["0%", "100%"]);
  const glare = useMotionTemplate`radial-gradient(420px circle at ${glareX} ${glareY}, rgba(255,255,255,0.22), transparent 60%)`;
  const glareOpacity = useSpring(0, { stiffness: 120, damping: 20 });

  const radius = `${(PHOTO.radius / PHOTO.w) * 100}% / ${(PHOTO.radius / PHOTO.h) * 100}%`;

  return (
    <motion.div
      ref={ref}
      className="relative mx-auto w-full max-w-[520px] [perspective:1100px]"
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse") return;
        const r = ref.current!.getBoundingClientRect();
        px.set((e.clientX - r.left) / r.width);
        py.set((e.clientY - r.top) / r.height);
        glareOpacity.set(1);
      }}
      onPointerLeave={() => {
        px.set(0.5);
        py.set(0.5);
        glareOpacity.set(0);
      }}
    >
      <motion.div style={{ rotateX, rotateY, transformStyle: "preserve-3d" }} className="relative">
        {/* Reveal: the frame wipes up from the bottom while the photo settles from a zoom */}
        <motion.div
          initial={{ clipPath: `inset(100% 0% 0% 0% round ${radius})` }}
          animate={inView ? { clipPath: `inset(0% 0% 0% 0% round ${radius})` } : undefined}
          transition={{ duration: 1.4, ease: [0.77, 0, 0.18, 1] }}
          className="relative overflow-hidden shadow-[0_40px_80px_-40px_rgba(6,6,6,0.45)]"
          style={{ borderRadius: radius, aspectRatio: `${PHOTO.w} / ${PHOTO.h}` }}
        >
          <motion.div
            initial={{ scale: 1.3 }}
            animate={inView ? { scale: 1 } : undefined}
            transition={{ duration: 2, ease: easeOut }}
            className="absolute inset-0"
          >
            {/* Settles at exactly 1:1 so the photo's baked corners line up with the frame */}
            <Image
              src="/Images/Founder.png"
              alt="Faith Success Adeshola, founder of BioTrace Global, smiling with arms crossed"
              fill
              sizes="(min-width: 1024px) 520px, 90vw"
              className="object-cover"
            />
          </motion.div>
          <motion.div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: glare, opacity: glareOpacity }} />
        </motion.div>

      </motion.div>
    </motion.div>
  );
}

/* Words slide up one by one from behind a mask */
function MaskedWords({ text, delay = 0 }: { text: string; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.span
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.8 }}
      variants={{ visible: { transition: { staggerChildren: 0.08, delayChildren: delay } } }}
      aria-label={text}
      className="inline"
    >
      {text.split(" ").map((w, i, arr) => (
        <span key={i} aria-hidden className="-mr-[0.15em] inline-block overflow-hidden pr-[0.15em] pb-[0.12em] align-bottom">
          <motion.span
            variants={{
              hidden: reduce ? {} : { y: "110%", rotate: 4 },
              visible: { y: "0%", rotate: 0, transition: { duration: 0.9, ease: easeOut } },
            }}
            className="inline-block origin-bottom-left"
          >
            {w}
            {i < arr.length - 1 && " "}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}
