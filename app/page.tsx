import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { ConservationSteps } from "@/components/sections/conservation-steps";
import { GetInvolved } from "@/components/sections/get-involved";
import { Partners } from "@/components/sections/partners";
import { JoinCta } from "@/components/sections/join-cta";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <About />
      <ConservationSteps />
      <GetInvolved />
      <Partners />
      <JoinCta />
    </main>
  );
}
