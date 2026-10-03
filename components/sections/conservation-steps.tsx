"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type AnimationPlaybackControls,
  type MotionValue,
} from "motion/react";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Jellyfish, SwayingCoral } from "@/components/ui/sea-creatures";
import { ROUTE_PATH, ROUTE_VIEWBOX } from "@/lib/conservation-route";
import { easeOut } from "@/lib/motion";
import { cn } from "@/lib/utils";

const steps = [
  {
    step: "01",
    title: "Observe",
    body: "Bio-acoustic sensors, eDNA stream sampling, and satellite telemetry capture raw ecological signals around the clock.",
  },
  {
    step: "02",
    title: "Research",
    body: "Peer-reviewed ecological models, biodiversity indexes, and neural soundscape classifiers model population trajectories.",
  },
  {
    step: "03",
    title: "Collaborate",
    body: "Co-designing preservation priorities alongside indigenous land councils, universities, and early-career field scientists.",
  },
  {
    step: "04",
    title: "Act",
    body: "Direct corridor restoration, automated anti-poaching acoustic geofences, and evidence packages for environmental policy.",
  },
];

/* ---------------------------------------------------------------------------
 * Desktop stage geometry (px inside a 1200×1000 stage, measured from the design)
 * ------------------------------------------------------------------------- */
const ROUTE_BOX = { left: 182, top: 165, width: 720 };
const ROUTE_SCALE = ROUTE_BOX.width / ROUTE_VIEWBOX.width;
const cardPositions = [
  { left: 902, top: 7 },
  { left: 42, top: 210 },
  { left: 854, top: 316 },
  { left: 657, top: 702 },
];
// Where the turtle rests along the route (route image px) and which card it's visiting
const stations: { x: number; y: number; card: number | null }[] = [
  { x: 1078, y: 152, card: 0 },
  { x: 873, y: 374, card: 2 },
  { x: 497, y: 566, card: 1 },
  { x: 597, y: 991, card: null },
  { x: 677, y: 1400, card: 3 },
];
// How long the turtle rests at each stop before swimming on
const STATION_INTERVAL = 3000;
const MOBILE_SWIM = 1.8;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function ConservationSteps() {
  return (
    <section id="process" className="relative isolate overflow-hidden bg-white pt-20 pb-16 md:pt-24 xl:pb-10">
      <div className="container-site">
        <Eyebrow>Our Methodology</Eyebrow>
        <motion.h2
          initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.9, ease: easeOut }}
          className="mx-auto max-w-[800px] text-center text-[32px] leading-[1.2] font-bold text-ink sm:text-4xl md:text-[42px]"
        >
          How Knowledge Becomes Conservation <br className="hidden md:block" />
          Action
        </motion.h2>

        <DesktopStage />
        <MobileTimeline />
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------------
 * Desktop: the winding route with a swimming turtle
 * ------------------------------------------------------------------------- */
function DesktopStage() {
  const stageRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const inView = useInView(stageRef, { amount: 0.25 });
  const hasEntered = useInView(stageRef, { amount: 0.25, once: true });
  const reduce = useReducedMotion();

  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [ready, setReady] = useState(false);

  const length = useMotionValue(0);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const tilt = useMotionValue(0);
  const facing = useMotionValue(1); // 1 = art's natural left-facing, -1 = flipped to face right
  const smoothTilt = useSpring(tilt, { stiffness: 50, damping: 14 });
  const smoothFacing = useSpring(facing, { stiffness: 90, damping: 16 });
  const opacity = useMotionValue(0);
  const scale = useMotionValue(0.8);

  const stationLengths = useRef<number[]>([]);
  const stationIndex = useRef(0);
  const firstRun = useRef(true);

  // Map each station to its nearest distance along the path, then park the turtle at the first one
  useLayoutEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const total = path.getTotalLength();
    const samples = 600;
    stationLengths.current = stations.map(({ x: sx, y: sy }) => {
      let best = 0;
      let bestDist = Infinity;
      for (let i = 0; i <= samples; i++) {
        const l = (i / samples) * total;
        const p = path.getPointAtLength(l);
        const d = (p.x - sx) ** 2 + (p.y - sy) ** 2;
        if (d < bestDist) {
          bestDist = d;
          best = l;
        }
      }
      return best;
    });

    const place = (l: number) => {
      const p = path.getPointAtLength(l);
      x.set(p.x * ROUTE_SCALE);
      y.set(p.y * ROUTE_SCALE);
      const a = path.getPointAtLength(Math.max(0, l - 8));
      const b = path.getPointAtLength(Math.min(total, l + 8));
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      if (Math.abs(dx) > 0.6) facing.set(dx > 0 ? -1 : 1);
      const deg = (Math.atan2(dy, Math.abs(dx)) * 180) / Math.PI;
      const clamped = Math.max(-28, Math.min(28, deg));
      tilt.set(facing.get() === 1 ? -clamped : clamped);
    };

    const unsub = length.on("change", place);
    length.set(stationLengths.current[0]);
    place(stationLengths.current[0]);
    setReady(true);
    return unsub;
  }, [length, x, y, tilt, facing]);

  // Turtle appears once the route has drawn itself in
  useEffect(() => {
    if (!hasEntered || !ready) return;
    const c1 = animate(opacity, 1, { duration: 0.9, delay: reduce ? 0 : 1.6 });
    const c2 = animate(scale, 1, { duration: 0.9, delay: reduce ? 0 : 1.6, ease: easeOut });
    const t = setTimeout(() => setActiveCard(stations[stationIndex.current].card), reduce ? 0 : 2200);
    return () => {
      c1.stop();
      c2.stop();
      clearTimeout(t);
    };
  }, [hasEntered, ready, reduce, opacity, scale]);

  // Every 3s, swim to the next station; after the last one, dive and resurface at the start
  useEffect(() => {
    if (!inView || !ready || reduce) return;
    let cancelled = false;
    let controls: AnimationPlaybackControls | null = null;

    const run = async () => {
      // The first stop also waits for the route to draw and the turtle to appear
      await sleep(firstRun.current ? 2200 + STATION_INTERVAL : STATION_INTERVAL);
      firstRun.current = false;
      while (!cancelled) {
        const from = stationIndex.current;
        const lengths = stationLengths.current;

        if (from === stations.length - 1) {
          setActiveCard(null);
          controls = animate(opacity, 0, { duration: 0.7 });
          animate(scale, 0.7, { duration: 0.7 });
          await controls;
          if (cancelled) return;
          stationIndex.current = 0;
          length.jump(lengths[0]);
          animate(scale, 1, { duration: 0.8, ease: easeOut });
          controls = animate(opacity, 1, { duration: 0.8 });
          await controls;
        } else {
          const to = from + 1;
          setActiveCard(null);
          const distance = Math.abs(lengths[to] - lengths[from]);
          const duration = Math.min(3.4, Math.max(1.8, distance / 420));
          controls = animate(length, lengths[to], { duration, ease: [0.45, 0, 0.25, 1] });
          await controls;
          stationIndex.current = to;
        }
        if (cancelled) return;
        setActiveCard(stations[stationIndex.current].card);
        await sleep(STATION_INTERVAL);
      }
    };
    run();

    return () => {
      cancelled = true;
      controls?.stop();
    };
  }, [inView, ready, reduce, length, opacity, scale]);

  return (
    <div ref={stageRef} className="relative mx-auto mt-4 hidden h-[1000px] w-[1200px] xl:block">
      <Reveal className="absolute top-[-40px] left-[95px] w-[170px]" delay={0.2}>
        <Jellyfish />
      </Reveal>

      {/* Route: a solid stroke in a mask draws the dashed line on */}
      <svg
        viewBox={`0 0 ${ROUTE_VIEWBOX.width} ${ROUTE_VIEWBOX.height}`}
        className="absolute overflow-visible"
        style={{ left: ROUTE_BOX.left, top: ROUTE_BOX.top, width: ROUTE_BOX.width }}
        aria-hidden
      >
        <defs>
          <mask id="route-draw" maskUnits="userSpaceOnUse" x="-20" y="-20" width="1482" height="1510">
            <motion.path
              d={ROUTE_PATH}
              fill="none"
              stroke="white"
              strokeWidth="12"
              initial={{ pathLength: reduce ? 1 : 0 }}
              animate={hasEntered ? { pathLength: 1 } : undefined}
              transition={{ duration: 2.4, ease: [0.65, 0, 0.35, 1] }}
            />
          </mask>
        </defs>
        <path
          ref={pathRef}
          d={ROUTE_PATH}
          fill="none"
          stroke="#060606"
          strokeWidth="2.6"
          strokeDasharray="15 11"
          mask="url(#route-draw)"
        />
      </svg>

      {steps.map((s, i) => (
        <StepCard
          key={s.step}
          {...s}
          active={activeCard === i}
          className="absolute w-[256px]"
          style={cardPositions[i]}
          // Cards appear in the order the route visits them
          delay={0.3 + [0, 2, 1, 3].indexOf(i) * 0.35}
        />
      ))}

      {/* Turtle, positioned in the route's coordinate space */}
      <div
        className="pointer-events-none absolute z-20"
        style={{ left: ROUTE_BOX.left, top: ROUTE_BOX.top }}
      >
        <Turtle x={x} y={y} tilt={smoothTilt} facing={smoothFacing} opacity={opacity} scale={scale} />
      </div>

      <Reveal className="absolute top-[822px] left-[8px] w-[174px]" delay={0.4}>
        <SwayingCoral src="/Images/coral.png" width={520} height={475} sway={2.5} ripple={5} duration={6} />
      </Reveal>
      <Reveal className="absolute top-[815px] left-[1070px] w-[195px]" delay={0.55}>
        <SwayingCoral src="/Images/anemone.png" width={520} height={447} sway={3} ripple={10} duration={4.5} delay={0.8} />
      </Reveal>
    </div>
  );
}

function Turtle({
  x,
  y,
  tilt,
  facing,
  opacity,
  scale,
}: {
  x: MotionValue<number>;
  y: MotionValue<number>;
  tilt: MotionValue<number>;
  facing: MotionValue<number>;
  opacity: MotionValue<number>;
  scale: MotionValue<number>;
}) {
  return (
    <motion.div style={{ x, y, opacity, scale }} className="absolute top-0 left-0">
      <motion.div style={{ rotate: tilt }} className="-translate-x-1/2 -translate-y-1/2">
        <motion.div style={{ scaleX: facing }}>
          {/* Gentle bob and paddle wobble while swimming or resting */}
          <motion.div
            animate={{ y: [0, -6, 0], rotate: [0, -2.5, 0, 2, 0] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image
              src="/Images/turtle.png"
              alt="Sea turtle swimming along the conservation route"
              width={480}
              height={340}
              sizes="180px"
              className="h-auto w-[180px] max-w-none drop-shadow-[0_18px_22px_rgba(25,97,128,0.18)]"
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/* ---------------------------------------------------------------------------
 * Mobile / tablet: vertical timeline, the turtle hops card to card every 3s
 * ------------------------------------------------------------------------- */
function MobileTimeline() {
  const listRef = useRef<HTMLOListElement>(null);
  const cardRefs = useRef<(HTMLLIElement | null)[]>([]);
  const inView = useInView(listRef, { amount: 0.2 });
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [offsets, setOffsets] = useState<number[]>([]);

  useLayoutEffect(() => {
    const measure = () =>
      setOffsets(cardRefs.current.map((el) => (el ? el.offsetTop + el.offsetHeight / 2 : 0)));
    measure();
    const ro = new ResizeObserver(measure);
    if (listRef.current) ro.observe(listRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || reduce) return;
    const t = setInterval(
      () => setActive((a) => (a + 1) % steps.length),
      STATION_INTERVAL + MOBILE_SWIM * 1000,
    );
    return () => clearInterval(t);
  }, [inView, reduce]);

  return (
    <div className="relative mt-12 xl:hidden">
      <Jellyfish className="absolute -top-16 right-0 w-[96px] opacity-90 sm:-top-6 sm:w-[130px]" />

      <ol ref={listRef} className="relative mx-auto max-w-[560px] pl-[92px] sm:pl-[120px]">
        {/* Dashed rail */}
        <span
          aria-hidden
          className="absolute top-4 bottom-4 left-[38px] border-l-2 border-dashed border-ink/70 sm:left-[52px]"
        />
        {offsets.length > 0 && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute left-[38px] z-10 sm:left-[52px]"
            initial={false}
            animate={{ y: offsets[active] }}
            transition={{ duration: MOBILE_SWIM, ease: [0.45, 0, 0.25, 1] }}
            style={{ top: 0 }}
          >
            <motion.div
              className="-translate-x-1/2 -translate-y-1/2"
              animate={{ y: [0, -4, 0], rotate: [-6, -2, -6] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Image
                src="/Images/turtle.png"
                alt=""
                width={480}
                height={340}
                sizes="90px"
                className="h-auto w-[76px] max-w-none -scale-x-100 sm:w-[96px]"
              />
            </motion.div>
          </motion.div>
        )}

        {steps.map((s, i) => (
          <li
            key={s.step}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            className="mb-6 last:mb-0"
          >
            <StepCard {...s} active={active === i} delay={i * 0.12} className="w-full" />
          </li>
        ))}
      </ol>

      <div className="mt-10 flex items-end justify-between">
        <SwayingCoral src="/Images/coral.png" width={520} height={475} className="w-[110px] sm:w-[150px]" />
        <SwayingCoral
          src="/Images/anemone.png"
          width={520}
          height={447}
          ripple={10}
          duration={4.5}
          className="w-[120px] sm:w-[160px]"
        />
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * Shared pieces
 * ------------------------------------------------------------------------- */
function StepCard({
  step,
  title,
  body,
  active,
  delay,
  className,
  style,
}: {
  step: string;
  title: string;
  body: string;
  active: boolean;
  delay: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.9, delay, ease: easeOut }}
      style={style}
      className={className}
    >
      <motion.div
        animate={active ? { y: -6 } : { y: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 20 }}
        className={cn(
          "min-h-[210px] bg-[#dee8ed] p-4 transition-[background-color,box-shadow] duration-500",
          active && "bg-[#d3e2ea] shadow-[0_22px_40px_-18px_rgba(25,97,128,0.45)]",
        )}
      >
        <span
          className={cn(
            "inline-block px-2 py-[5px] font-mono text-[10px] leading-none font-semibold tracking-[0.12em] text-white transition-colors duration-500",
            active ? "bg-primary" : "bg-[#24546b]",
          )}
        >
          STEP {step}
        </span>
        <h3 className="mt-5 font-sans text-xl font-medium tracking-normal text-ink uppercase">{title}</h3>
        <p className="mt-2 text-[13px] leading-[21px] text-ink-soft xl:max-w-[192px]">{body}</p>
      </motion.div>
    </motion.article>
  );
}

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.92 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1.2, delay, ease: easeOut }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
