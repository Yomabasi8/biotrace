"use client";

import { useId } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Animated jellyfish built from one illustration split into two layers:
 * the bell (pulses: contracts, then slowly relaxes) and the tentacles
 * (ripple continuously through an animated turbulence displacement and
 * trail behind each pulse). Each contraction nudges the whole body forward
 * along its axis, then it drifts back, like real jellyfish propulsion.
 */
export function Jellyfish({ className }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  const reduce = useReducedMotion();
  const pulse = { duration: 3.2, repeat: Infinity, ease: "easeInOut" as const, times: [0, 0.22, 1] };

  // Bell outline (ellipse) in the 418×416 image space, tilted with the jelly's body
  const bell = { cx: 150, cy: 120, rx: 140, ry: 112, rotate: -26 };

  return (
    // Slow wander so it never sits perfectly still
    <motion.div
      aria-hidden
      className={cn("pointer-events-none", className)}
      animate={reduce ? undefined : { x: [0, -10, 6, 0], y: [0, -14, 6, 0], rotate: [0, -3, 2, 0] }}
      transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Propulsion: a quick push on contraction, a slow glide back */}
      <motion.div
        animate={reduce ? undefined : { x: [0, -6, 0], y: [0, -12, 0] }}
        transition={pulse}
      >
        <svg viewBox="0 0 418 416" className="h-auto w-full overflow-visible">
          <defs>
            <filter id={`${id}-wave`} x="-15%" y="-15%" width="130%" height="130%">
              <feTurbulence type="fractalNoise" baseFrequency="0.01 0.03" numOctaves="1" seed="4" result="noise">
                {!reduce && (
                  <animate
                    attributeName="baseFrequency"
                    dur="10s"
                    values="0.01 0.03;0.014 0.042;0.01 0.03"
                    repeatCount="indefinite"
                  />
                )}
              </feTurbulence>
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="11" xChannelSelector="R" yChannelSelector="G" />
            </filter>
            <filter id={`${id}-feather`}>
              <feGaussianBlur stdDeviation="8" />
            </filter>
            <mask id={`${id}-bell`} maskUnits="userSpaceOnUse" x="-50" y="-50" width="520" height="520">
              <ellipse
                {...bell}
                transform={`rotate(${bell.rotate} ${bell.cx} ${bell.cy})`}
                fill="white"
                filter={`url(#${id}-feather)`}
              />
            </mask>
            <mask id={`${id}-tentacles`} maskUnits="userSpaceOnUse" x="-50" y="-50" width="520" height="520">
              <rect x="-50" y="-50" width="520" height="520" fill="white" />
              <ellipse
                cx={bell.cx}
                cy={bell.cy}
                rx={bell.rx - 14}
                ry={bell.ry - 14}
                transform={`rotate(${bell.rotate} ${bell.cx} ${bell.cy})`}
                fill="black"
                filter={`url(#${id}-feather)`}
              />
            </mask>
          </defs>

          {/* Tentacles: stretch slightly after each pulse and ripple constantly */}
          <motion.g
            mask={`url(#${id}-tentacles)`}
            style={{ transformBox: "view-box", transformOrigin: "150px 150px" }}
            animate={reduce ? undefined : { scaleY: [1, 1, 1.07, 1], rotate: [0, 0, 1.5, 0] }}
            transition={{ ...pulse, times: [0, 0.15, 0.45, 1] }}
          >
            <g filter={`url(#${id}-wave)`}>
              <image href="/Images/jelly.png" width="418" height="416" />
            </g>
          </motion.g>

          {/* Bell: contracts (narrower, taller) then relaxes */}
          <motion.g
            mask={`url(#${id}-bell)`}
            style={{ transformBox: "view-box", transformOrigin: "150px 70px" }}
            animate={reduce ? undefined : { scaleX: [1, 0.9, 1], scaleY: [1, 1.05, 1] }}
            transition={pulse}
          >
            <image href="/Images/jelly.png" width="418" height="416" />
          </motion.g>
        </svg>
      </motion.div>
    </motion.div>
  );
}

/**
 * Coral / anemone that sways in the current: anchored at the base, the top bends
 * side to side, while a gentle turbulence ripple makes the fronds wiggle.
 */
export function SwayingCoral({
  src,
  width,
  height,
  className,
  sway = 3,
  ripple = 6,
  duration = 6,
  delay = 0,
}: {
  src: string;
  width: number;
  height: number;
  className?: string;
  /** Max bend in degrees */
  sway?: number;
  /** Turbulence displacement strength */
  ripple?: number;
  duration?: number;
  delay?: number;
}) {
  const id = useId().replace(/:/g, "");
  const reduce = useReducedMotion();

  return (
    <div aria-hidden className={cn("pointer-events-none", className)}>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full overflow-visible">
        <defs>
          <filter id={`${id}-current`} x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.02" numOctaves="2" seed="7" result="noise">
              {!reduce && (
                <animate
                  attributeName="baseFrequency"
                  dur={`${duration * 1.5}s`}
                  values="0.012 0.02;0.016 0.028;0.012 0.02"
                  repeatCount="indefinite"
                />
              )}
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={ripple} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
        <motion.g
          style={{ transformBox: "view-box", transformOrigin: `${width / 2}px ${height}px` }}
          animate={reduce ? undefined : { skewX: [-sway, sway, -sway], scaleY: [1, 1.015, 1] }}
          transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
        >
          <g filter={`url(#${id}-current)`}>
            <image href={src} width={width} height={height} />
          </g>
        </motion.g>
      </svg>
    </div>
  );
}

/**
 * Seaweed that bends in the current like real kelp: the base stays rooted while
 * each frond bends progressively more toward its tip. A vertical gradient is used
 * as a displacement map (no shift at the base, most at the top) and its strength
 * swings back and forth; a slow turbulence ripple adds the wavy, rippling fronds.
 *
 * Maps (public/Images): seaweed-bend-map.png has red 0.5 → 1.0 from root to tip with
 * green fixed at 0.5 (no vertical shift); seaweed-ripple-map.png is a black → white
 * weight that keeps the ripple off the roots. PNGs are used because inline SVG data
 * URIs don't render inside feImage in Chrome. Both maps span the full filter region:
 * anywhere a map is missing reads as 0 and would smear stray pixels into view.
 */
export function Seaweed({
  src,
  width,
  height,
  className,
  bend = 80,
  duration = 5.5,
}: {
  src: string;
  width: number;
  height: number;
  className?: string;
  /** Peak displacement at the tips, in image pixels */
  bend?: number;
  duration?: number;
}) {
  const id = useId().replace(/:/g, "");
  const reduce = useReducedMotion();

  return (
    <div aria-hidden className={cn("pointer-events-none", className)}>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full overflow-visible">
        <defs>
          <filter
            id={`${id}-kelp`}
            x={-width * 0.2}
            y="0"
            width={width * 1.4}
            height={height}
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feImage
              href="/Images/seaweed-bend-map.png"
              x={-width * 0.2}
              y="0"
              width={width * 1.4}
              height={height}
              preserveAspectRatio="none"
              result="bendMap"
            />
            <feDisplacementMap in="SourceGraphic" in2="bendMap" scale={reduce ? 0 : bend} xChannelSelector="R" yChannelSelector="G" result="bent">
              {!reduce && (
                <animate
                  attributeName="scale"
                  dur={`${duration}s`}
                  values={`${-bend};${bend};${-bend}`}
                  keyTimes="0;0.5;1"
                  calcMode="spline"
                  keySplines="0.45 0 0.55 1;0.45 0 0.55 1"
                  repeatCount="indefinite"
                />
              )}
            </feDisplacementMap>
            <feTurbulence type="fractalNoise" baseFrequency="0.008 0.018" numOctaves="1" seed="11" result="noise">
              {!reduce && (
                <animate
                  attributeName="baseFrequency"
                  dur={`${duration * 1.7}s`}
                  values="0.008 0.018;0.011 0.026;0.008 0.018"
                  repeatCount="indefinite"
                />
              )}
            </feTurbulence>
            {/* Fade the ripple out toward the roots so the stones stay put: 0.5 + (noise − 0.5) × weight */}
            <feImage
              href="/Images/seaweed-ripple-map.png"
              x={-width * 0.2}
              y="0"
              width={width * 1.4}
              height={height}
              preserveAspectRatio="none"
              result="weight"
            />
            <feComposite in="noise" in2="weight" operator="arithmetic" k1="1" k2="0" k3="-0.5" k4="0.5" result="weightedNoise" />
            <feDisplacementMap in="bent" in2="weightedNoise" scale="12" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
        <g filter={`url(#${id}-kelp)`}>
          <image href={src} width={width} height={height} />
        </g>
      </svg>
    </div>
  );
}

/**
 * An illustration rippled by animated turbulence, but only where a weight map is bright.
 * Weight maps live in public/Images and cover the image plus an 8% margin on every side
 * (the filter region), so displaced edges aren't clipped and nothing samples outside the map.
 */
const RIPPLE_PAD = 0.08;

export function WeightedRipple({
  src,
  width,
  height,
  weightMap,
  scale,
  frequency,
  frequencyTo,
  duration,
}: {
  src: string;
  width: number;
  height: number;
  weightMap: string;
  scale: number;
  frequency: string;
  frequencyTo: string;
  duration: number;
}) {
  const id = useId().replace(/:/g, "");
  const reduce = useReducedMotion();
  const region = {
    x: -width * RIPPLE_PAD,
    y: -height * RIPPLE_PAD,
    width: width * (1 + 2 * RIPPLE_PAD),
    height: height * (1 + 2 * RIPPLE_PAD),
  };

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full overflow-visible">
      <defs>
        <filter id={`${id}-ripple`} {...region} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency={frequency} numOctaves="1" seed="5" result="noise">
            {!reduce && (
              <animate
                attributeName="baseFrequency"
                dur={`${duration}s`}
                values={`${frequency};${frequencyTo};${frequency}`}
                repeatCount="indefinite"
              />
            )}
          </feTurbulence>
          <feImage href={weightMap} {...region} preserveAspectRatio="none" result="weight" />
          {/* 0.5 + (noise − 0.5) × weight: no displacement where the map is black */}
          <feComposite in="noise" in2="weight" operator="arithmetic" k1="1" k2="0" k3="-0.5" k4="0.5" result="weighted" />
          <feDisplacementMap in="SourceGraphic" in2="weighted" scale={reduce ? 0 : scale} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
      <g filter={`url(#${id}-ripple)`}>
        <image href={src} width={width} height={height} />
      </g>
    </svg>
  );
}

/**
 * Squid swimming by jet propulsion: a quick thrust along its body axis (up and to the
 * left, mantle first), then a long glide back while the tentacles ripple and trail.
 */
export function Squid({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      aria-hidden
      className={cn("pointer-events-none", className)}
      animate={reduce ? undefined : { y: [0, -10, 4, 0], rotate: [0, -1.5, 1, 0] }}
      transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
    >
      <motion.div
        style={{ transformOrigin: "40% 30%" }}
        animate={reduce ? undefined : { x: [0, -14, 0], y: [0, -18, 0], scaleX: [1, 0.97, 1], scaleY: [1, 1.03, 1] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", times: [0, 0.18, 1] }}
      >
        <WeightedRipple
          src="/Images/squid.png"
          width={612}
          height={790}
          weightMap="/Images/squid-ripple-map.png"
          scale={26}
          frequency="0.008 0.02"
          frequencyTo="0.012 0.03"
          duration={7}
        />
      </motion.div>
    </motion.div>
  );
}

/**
 * Seahorse: swims upright with a slow bob and a gentle nod while its small dorsal
 * fin flutters rapidly, which is how real seahorses propel themselves.
 */
export function Seahorse({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      aria-hidden
      className={cn("pointer-events-none", className)}
      style={{ transformOrigin: "50% 20%" }}
      animate={reduce ? undefined : { y: [0, -16, 0], rotate: [0, -3, 0, 2, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
    >
      <WeightedRipple
        src="/Images/seahorse.png"
        width={562}
        height={911}
        weightMap="/Images/seahorse-fin-map.png"
        scale={14}
        frequency="0.05 0.02"
        frequencyTo="0.08 0.035"
        duration={0.9}
      />
    </motion.div>
  );
}
