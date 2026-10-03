"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/utils";

const variants = {
  primary: "bg-primary text-white hover:bg-primary-hover",
  blush: "bg-blush text-ink hover:bg-blush-hover",
} as const;

type ButtonLinkProps = HTMLMotionProps<"a"> & {
  variant?: keyof typeof variants;
};

export function ButtonLink({
  variant = "primary",
  className,
  ...props
}: ButtonLinkProps) {
  return (
    <motion.a
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={cn(
        "inline-flex h-12 items-center justify-center rounded-full px-7 text-[15px] font-medium whitespace-nowrap transition-colors duration-300",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
