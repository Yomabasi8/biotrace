import type { Metadata } from "next";
import { AboutIntro } from "@/components/sections/about-page/about-intro";

export const metadata: Metadata = {
  title: "About Us — BioTrace Global",
  description:
    "BioTrace Global is an emerging global initiative advancing environmental conservation, biodiversity research, and sustainable solutions through science, technology, and collaboration.",
};

export default function AboutPage() {
  return <AboutIntro />;
}
