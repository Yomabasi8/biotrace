import type { Metadata } from "next";
import { WorkHero } from "@/components/sections/work-page/work-hero";
import { FieldReveal } from "@/components/sections/work-page/field-reveal";
import { Manifesto } from "@/components/sections/work-page/manifesto";
import { FieldNotes } from "@/components/sections/work-page/field-notes";
import { JoinCta } from "@/components/sections/join-cta";

export const metadata: Metadata = {
  title: "Our Work — BioTrace Global",
  description:
    "From eDNA sampling to community action: how BioTrace Global turns field research and laboratory science into conservation.",
};

export default function WorkPage() {
  return (
    <main className="flex-1">
      <WorkHero />
      <FieldReveal />
      <Manifesto />
      <FieldNotes />
      <JoinCta />
    </main>
  );
}
