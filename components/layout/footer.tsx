"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { LivingReef } from "@/components/ui/living-reef";
import { easeOut } from "@/lib/motion";

const columns: { title: string; links: { label: string; href: string; accent?: boolean }[] }[] = [
  {
    title: "Navigation",
    links: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Our Work", href: "/#process" },
      { label: "Research & Stories", href: "/#research" },
      { label: "Get Involved", href: "/#get-involved" },
      { label: "Partners", href: "/#partners" },
    ],
  },
  {
    title: "Research Hub",
    links: [
      { label: "Field Stations", href: "#" },
      { label: "Datasets & Telemetry", href: "#" },
      { label: "Publications & Whitepapers", href: "#" },
      { label: "Sensor Network", href: "#" },
      { label: "Biodiversity Atlas", href: "#" },
    ],
  },
  {
    title: "Connect & Support",
    links: [
      { label: "Donate to the Mission", href: "/#get-involved", accent: true },
      { label: "Volunteer Application", href: "/#get-involved" },
      { label: "Partner With Us", href: "/#partners" },
      { label: "biotraceglobal@gmail.com", href: "mailto:biotraceglobal@gmail.com" },
    ],
  },
];

const rise: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: easeOut } },
};

export function Footer() {
  return (
    <footer className="relative isolate overflow-hidden bg-[#0d4a63] text-white">
      <LivingReef className="-z-20" />
      {/* Deepen the water behind the text so it stays readable over the reef */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(6,38,54,0.78)_0%,rgba(8,50,70,0.62)_45%,rgba(8,50,70,0.38)_75%,rgba(8,50,70,0.3)_100%)]"
      />

      <div className="container-site pt-20 pb-[200px] md:pt-[88px] md:pb-[220px]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="grid gap-12 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,0.9fr)_minmax(0,1.3fr)_minmax(0,1.2fr)] lg:gap-8"
        >
          <motion.div variants={rise}>
            <Link href="/" className="inline-flex items-center gap-2.5" aria-label="BioTrace Global home">
              <Image src="/Images/logo-mark-white.png" alt="" width={40} height={40} className="h-10 w-10" />
              <span className="font-heading text-[22px] font-semibold tracking-[-0.5px]">BioTrace Global</span>
            </Link>
            <p className="mt-5 max-w-[380px] text-base leading-[1.55] text-white/90">
              Empowering a global community to use science, technology, and collaboration to understand,
              monitor, and protect biodiversity.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:contents">
            {columns.map((col) => (
              <motion.nav key={col.title} variants={rise} aria-label={col.title} className={col.title === "Connect & Support" ? "col-span-2 sm:col-span-1" : undefined}>
                <h2 className="font-heading text-lg font-semibold tracking-[-0.3px]">{col.title}</h2>
                <ul className="mt-3 space-y-2">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className={
                          "group relative inline-block text-sm transition-colors duration-300 " +
                          (link.accent ? "text-[#f3a08c] hover:text-[#ffc0b0]" : "text-white/85 hover:text-white")
                        }
                      >
                        {link.label}
                        <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 group-hover:scale-x-100" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.nav>
            ))}
          </div>
        </motion.div>

        <NewsletterBar />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mt-14 flex flex-col gap-4 font-mono text-[11px] tracking-[0.06em] text-white/80 sm:flex-row sm:items-center sm:justify-between"
        >
          <p>© {new Date().getFullYear()} BioTrace Global Initiative.</p>
          <ul className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {["Privacy Policy", "Terms", "Open Data License"].map((label, i) => (
              <li key={label} className="flex items-center gap-4">
                {i > 0 && <span aria-hidden className="text-white/50">•</span>}
                <a href="#" className="transition-colors hover:text-white">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </footer>
  );
}

function NewsletterBar() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.9, ease: easeOut }}
      className="mt-12 flex flex-col gap-5 rounded-xl bg-[#dee8ed] p-6 text-ink md:mt-14 md:flex-row md:items-center md:justify-between"
    >
      <div>
        <h2 className="font-heading text-[22px] leading-tight font-semibold tracking-[-0.5px]">Connect with Us</h2>
        <p className="mt-1 text-sm text-ink-soft">Have a question or want to collaborate?</p>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {sent ? (
          <motion.p
            key="thanks"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            role="status"
            className="text-sm font-medium text-primary"
          >
            Thanks! We&apos;ll be in touch soon.
          </motion.p>
        ) : (
          <motion.form
            key="form"
            exit={{ opacity: 0, y: -8 }}
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
            className="flex w-full gap-2 md:w-auto"
          >
            <label htmlFor="footer-email" className="sr-only">
              Email address
            </label>
            <input
              id="footer-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="h-10 min-w-0 flex-1 rounded-md bg-white px-4 text-sm text-ink placeholder:text-ink-soft/50 focus:ring-2 focus:ring-primary/40 focus:outline-none md:w-[260px] md:flex-none"
            />
            <motion.button
              type="submit"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="h-10 shrink-0 rounded-md bg-[#0b1714] px-5 text-sm font-medium text-white transition-colors hover:bg-black"
            >
              Subscribe
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
