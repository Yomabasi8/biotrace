import { Navbar } from "@/components/layout/navbar";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { ConservationSteps } from "@/components/sections/conservation-steps";
import { GetInvolved } from "@/components/sections/get-involved";
import { Partners } from "@/components/sections/partners";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <About />
        <ConservationSteps />
        <GetInvolved />
        <Partners />
      </main>
    </>
  );
}
