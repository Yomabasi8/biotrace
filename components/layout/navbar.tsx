"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";
import { ButtonLink } from "@/components/ui/button";
import { easeOut } from "@/lib/motion";
import { cn } from "@/lib/utils";

const links = [
  { label: "Home", href: "#home" },
  { label: "About Us", href: "#about" },
  { label: "Our Work", href: "#work" },
  { label: "Partners", href: "#partners" },
  { label: "Research & Stories", href: "#research" },
];

export function Navbar() {
  const [active, setActive] = useState(links[0].href);
  const [hovered, setHovered] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [restOffset, setRestOffset] = useState(68);

  // The bar rests lower on first paint (as in the design) and glides up to hug the top on scroll
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 140], [restOffset, 0]);
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 24));

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setRestOffset(mq.matches ? 68 : 4);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const underlineTarget = hovered ?? active;

  return (
    <motion.header style={{ y }} className="fixed inset-x-0 top-3 z-50 md:top-4">
      <motion.div
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: easeOut }}
        className="container-site"
      >
        <div
          className={cn(
            "rounded-full bg-[#f1f1f1]/80 p-[7px] backdrop-blur-md transition-shadow duration-500",
            scrolled && "shadow-[0_12px_40px_-12px_rgba(6,6,6,0.18)]",
          )}
        >
          <nav
            aria-label="Main"
            className="flex h-[68px] items-center justify-between rounded-full bg-white pr-2.5 pl-4 md:h-[82px] md:pl-5"
          >
            <Link
              href="#home"
              onClick={() => setActive("#home")}
              className="shrink-0"
              aria-label="BioTrace Global home"
            >
              <Image
                src="/Images/logo.png"
                alt="BioTrace Global"
                width={52}
                height={52}
                priority
                className="h-11 w-11 md:h-[52px] md:w-[52px]"
              />
            </Link>

            <motion.ul
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.06, delayChildren: 0.35 } } }}
              onMouseLeave={() => setHovered(null)}
              className="hidden items-center gap-7 lg:flex"
            >
              {links.map((link) => {
                const isActive = active === link.href;
                return (
                  <motion.li
                    key={link.href}
                    variants={{
                      hidden: { opacity: 0, y: -8 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
                    }}
                    className="relative"
                  >
                    <a
                      href={link.href}
                      onClick={() => setActive(link.href)}
                      onMouseEnter={() => setHovered(link.href)}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "block px-2.5 py-3 text-base transition-colors duration-300",
                        isActive ? "text-coral" : "text-ink hover:text-coral",
                      )}
                    >
                      {link.label}
                    </a>
                    {underlineTarget === link.href && (
                      <motion.span
                        layoutId="nav-underline"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        className="absolute inset-x-0 bottom-0.5 h-[1.5px] rounded-full bg-coral"
                      />
                    )}
                  </motion.li>
                );
              })}
            </motion.ul>

            <div className="flex items-center gap-2">
              <ButtonLink
                href="#get-involved"
                className="hidden px-6 sm:inline-flex"
              >
                Get Involved
              </ButtonLink>

              <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? "Close menu" : "Open menu"}
                className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[#f4f4f4] lg:hidden"
              >
                <motion.span
                  animate={open ? { rotate: 45, y: 0 } : { rotate: 0, y: -4 }}
                  className="absolute h-[1.5px] w-5 rounded-full bg-ink"
                />
                <motion.span
                  animate={open ? { rotate: -45, y: 0 } : { rotate: 0, y: 4 }}
                  className="absolute h-[1.5px] w-5 rounded-full bg-ink"
                />
              </button>
            </div>
          </nav>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.35, ease: easeOut }}
              className="mt-2 origin-top rounded-[28px] border border-black/5 bg-white p-3 shadow-[0_24px_60px_-20px_rgba(6,6,6,0.25)] lg:hidden"
            >
              <motion.ul
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } } }}
              >
                {links.map((link) => (
                  <motion.li
                    key={link.href}
                    variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }}
                  >
                    <a
                      href={link.href}
                      onClick={() => {
                        setActive(link.href);
                        setOpen(false);
                      }}
                      className={cn(
                        "flex items-center justify-between rounded-2xl px-4 py-3.5 text-lg transition-colors hover:bg-[#f6f6f6]",
                        active === link.href ? "text-coral" : "text-ink",
                      )}
                    >
                      {link.label}
                      {active === link.href && <span className="h-1.5 w-1.5 rounded-full bg-coral" />}
                    </a>
                  </motion.li>
                ))}
              </motion.ul>
              <ButtonLink
                href="#get-involved"
                onClick={() => setOpen(false)}
                className="mt-2 w-full sm:hidden"
              >
                Get Involved
              </ButtonLink>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.header>
  );
}
