"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion, type TargetAndTransition, type Transition } from "motion/react";
import { WeightedRipple } from "@/components/ui/sea-creatures";
import { cn } from "@/lib/utils";

/*
 * The footer illustration (public/Images/16922 1.png) split into layers:
 *   plate.jpg   the reef with every moving creature painted out; seaweed and anemones sway
 *               in a WebGL shader driven by weights.png (R sway, G tentacle ripple, B light shimmer)
 *   *.webp      creature sprites placed back at their original spots, plus "front" cut-outs for
 *               scenery that overlaps them (e.g. the coral branch in front of the clownfish)
 * Every position below is in the original illustration's pixel space.
 */
const SCENE = { w: 4320, h: 2271 };
const ASSET = "/Images/footer/";

const pct = (v: number, of: number) => `${(v / of) * 100}%`;
const box = (x: number, y: number, w: number, h: number) => ({
  left: pct(x, SCENE.w),
  top: pct(y, SCENE.h),
  width: pct(w, SCENE.w),
  height: pct(h, SCENE.h),
});

const TURTLE = { x: 2020, y: 452, w: 1241, h: 1340 };
const FLIPPERS: {
  name: string;
  x: number;
  y: number;
  w: number;
  h: number;
  px: number;
  py: number;
  rotate: number[];
  delay: number;
}[] = [
  // Front flippers make the big power strokes in opposite phase; rear flippers steer
  { name: "top", x: 642, y: 9, w: 235, h: 437, px: 93, py: 426, rotate: [-6, 14, -6], delay: 0 },
  { name: "front", x: 875, y: 625, w: 357, h: 451, px: 30, py: 90, rotate: [8, -13, 8], delay: 0 },
  { name: "rearLeft", x: 8, y: 666, w: 198, h: 240, px: 182, py: 99, rotate: [-7, 7, -7], delay: 0.6 },
  { name: "rearBottom", x: 171, y: 1055, w: 270, h: 277, px: 159, py: 20, rotate: [5, -8, 5], delay: 0.9 },
];
const STROKE = 3.6;

export function LivingReef({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "200px 0px" });
  const reduce = useReducedMotion();
  const animate = inView && !reduce;

  // Motion helper: only loop while visible
  const loop = (keyframes: TargetAndTransition, transition: Transition) =>
    animate ? { animate: keyframes, transition: { repeat: Infinity, ease: "easeInOut" as const, ...transition } } : {};

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden [container-type:size]", className)}
    >
      {/* Stage keeps the illustration's aspect ratio and covers the footer, like object-fit: cover */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: `max(100cqw, calc(100cqh * ${SCENE.w / SCENE.h}))`,
          height: `max(100cqh, calc(100cqw * ${SCENE.h / SCENE.w}))`,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${ASSET}plate.jpg`} alt="" loading="lazy" className="absolute inset-0 h-full w-full" />
        <SwayingPlate running={animate} />

        {/* Manta ray gliding across the open water near the surface */}
        <motion.div
          className="absolute"
          style={{ left: 0, top: pct(-60, SCENE.h), width: pct(880, SCENE.w), aspectRatio: "1460 / 1184" }}
          initial={{ x: "-130%" }}
          {...(animate
            ? {
                animate: { x: ["-130%", "520%"] },
                transition: { duration: 46, repeat: Infinity, repeatDelay: 6, ease: "linear" },
              }
            : {})}
        >
          <motion.div className="h-full w-full" style={{ rotate: 12 }} {...loop({ y: ["0%", "6%", "0%"] }, { duration: 9 })}>
            {/* Wingbeat: squash across the wing axis */}
            <motion.div className="h-full w-full" {...loop({ scaleY: [1, 0.74, 1] }, { duration: 3.4 })}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${ASSET}manta.webp`} alt="" loading="lazy" className="h-full w-full -rotate-[40deg] opacity-90" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Jellyfish silhouette: pulse and drift */}
        <motion.div className="absolute" style={box(2150, 330, 320, 400)} {...loop({ y: ["0%", "-18%", "0%"] }, { duration: 9 })}>
          <motion.div
            className="h-full w-full"
            style={{ transformOrigin: "50% 30%" }}
            {...loop({ scaleX: [1, 0.86, 1], scaleY: [1, 1.06, 1] }, { duration: 2.8, times: [0, 0.25, 1] })}
          >
            <Sprite name="jelly" />
          </motion.div>
        </motion.div>

        {/* Little blue fish patrolling, turning round at each end */}
        <motion.div
          className="absolute"
          style={box(3575, 150, 325, 220)}
          {...loop(
            { x: ["0%", "-150%", "-150%", "0%", "0%"], scaleX: [1, 1, -1, -1, 1], y: ["0%", "12%", "-6%", "8%", "0%"] },
            { duration: 16, times: [0, 0.44, 0.5, 0.94, 1] },
          )}
        >
          <motion.div className="h-full w-full" {...loop({ rotate: [-3, 3, -3] }, { duration: 0.8 })}>
            <Sprite name="bluefish" />
          </motion.div>
        </motion.div>

        {/* Sea turtle: flippers paddle beneath the shell while it drifts and bobs */}
        <motion.div
          className="absolute"
          style={box(TURTLE.x, TURTLE.y, TURTLE.w, TURTLE.h)}
          {...loop({ x: ["0%", "3%", "1%", "-2%", "0%"], y: ["0%", "-2%", "1.5%", "-1%", "0%"] }, { duration: 22 })}
        >
          <motion.div
            className="relative h-full w-full"
            {...loop({ y: ["0%", "-1.6%", "0%"], rotate: [0, 1.2, 0] }, { duration: STROKE })}
          >
            {FLIPPERS.map((f) => (
              <motion.div
                key={f.name}
                className="absolute"
                style={{
                  left: pct(f.x, TURTLE.w),
                  top: pct(f.y, TURTLE.h),
                  width: pct(f.w, TURTLE.w),
                  height: pct(f.h, TURTLE.h),
                  transformOrigin: `${pct(f.px, f.w)} ${pct(f.py, f.h)}`,
                }}
                {...loop({ rotate: f.rotate }, { duration: STROKE, delay: f.delay })}
              >
                <Sprite name={`turtle-${f.name}`} />
              </motion.div>
            ))}
            <Sprite name="turtle-body" className="absolute inset-0" />
          </motion.div>
        </motion.div>

        {/* Seahorse: upright bob with a gentle nod */}
        <motion.div
          className="absolute"
          style={{ ...box(1392, 1328, 204, 394), transformOrigin: "50% 20%" }}
          {...loop({ y: ["0%", "-9%", "0%"], rotate: [0, -4, 0, 3, 0] }, { duration: 5.5 })}
        >
          <Sprite name="seahorse" />
        </motion.div>

        {/* Clownfish hovering by its anemone, tail beating */}
        <motion.div
          className="absolute"
          style={box(488, 1032, 704, 412)}
          {...loop({ x: ["0%", "2.5%", "-1%", "0%"], y: ["0%", "-4%", "2%", "0%"], rotate: [0, -2, 1, 0] }, { duration: 7 })}
        >
          {animate ? (
            <WeightedRipple
              src={`${ASSET}clownfish.webp`}
              width={704}
              height={412}
              weightMap={`${ASSET}clownfish-tail-map.png`}
              scale={34}
              frequency="0.012 0.004"
              frequencyTo="0.02 0.006"
              duration={1.1}
            />
          ) : (
            <Sprite name="clownfish" />
          )}
        </motion.div>
        <Sprite name="clownfish-front" className="absolute" style={box(882, 1322, 100, 69)} />

        {/* Butterflyfish, half out of frame on the left */}
        <motion.div
          className="absolute"
          style={box(-194, 681, 743, 486)}
          {...loop({ x: ["0%", "3%", "0%"], y: ["0%", "-3%", "2%", "0%"], rotate: [0, 1.5, -1, 0] }, { duration: 8 })}
        >
          <Sprite name="butterflyfish" />
        </motion.div>
      </div>
    </div>
  );
}

function Sprite({ name, className, style }: { name: string; className?: string; style?: React.CSSProperties }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`${ASSET}${name}.webp`}
      alt=""
      loading="lazy"
      draggable={false}
      className={cn("block h-full w-full select-none", className)}
      style={style}
    />
  );
}

/* ---------------------------------------------------------------------------
 * WebGL plate: sways seaweed, ripples anemone tentacles, shimmers the light rays
 * ------------------------------------------------------------------------- */
const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = vec2(aPos.x * 0.5 + 0.5, 0.5 - aPos.y * 0.5);
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const FRAG = `
precision mediump float;
uniform sampler2D uPlate;
uniform sampler2D uWeights;
uniform float uTime;
varying vec2 vUv;
void main() {
  vec2 uv = vUv;
  vec3 w = texture2D(uWeights, uv).rgb;
  float t = uTime;
  // Seaweed: slow bend, stronger toward the tips (baked into the weight), with a second harmonic
  float sway = w.r * (0.0052 * sin(t * 0.85 + uv.x * 7.0 + uv.y * 2.5) + 0.0022 * sin(t * 1.7 + uv.x * 13.0 + uv.y * 4.0));
  // Anemone tentacles: quick small wiggle
  float ripX = w.g * 0.0021 * sin(t * 2.4 + uv.y * 95.0 + uv.x * 31.0);
  float ripY = w.g * 0.0026 * cos(t * 2.0 + uv.x * 80.0);
  vec2 d = vec2(sway + ripX, ripY + w.r * 0.0016 * sin(t * 1.25 + uv.x * 9.0));
  vec3 c = texture2D(uPlate, uv - d).rgb;
  // Caustic shimmer where the sun rays fall
  float k = sin(uv.x * 38.0 + t * 0.8 + sin(uv.y * 22.0 - t * 0.6) * 1.6) *
            sin(uv.y * 30.0 - t * 0.7 + sin(uv.x * 17.0 + t * 0.5) * 1.4);
  c += w.b * 0.06 * max(k, 0.0);
  gl_FragColor = vec4(c, 1.0);
}`;

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function SwayingPlate({ running }: { running: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const runningRef = useRef(running);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    runningRef.current = running;
  }, [running]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { alpha: false, antialias: false, premultipliedAlpha: false });
    if (!gl) return; // static plate <img> stays visible

    let raf = 0;
    let disposed = false;
    const start = performance.now();

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
    const uTime = gl.getUniformLocation(prog, "uTime");

    const texture = (img: HTMLImageElement, unit: number, name: string) => {
      const tex = gl.createTexture();
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
      gl.uniform1i(gl.getUniformLocation(prog, name), unit);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(canvas.clientWidth * dpr);
      const h = Math.round(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };
    const draw = () => {
      resize();
      gl.uniform1f(uTime, (performance.now() - start) / 1000);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    const frame = () => {
      if (disposed) return;
      if (runningRef.current) draw();
      raf = requestAnimationFrame(frame);
    };

    Promise.all([loadImage(`${ASSET}plate.jpg`), loadImage(`${ASSET}weights.png`)])
      .then(([plate, weights]) => {
        if (disposed) return;
        texture(plate, 0, "uPlate");
        texture(weights, 1, "uWeights");
        draw();
        setReady(true);
        raf = requestAnimationFrame(frame);
      })
      .catch(() => {});

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={cn("absolute inset-0 h-full w-full transition-opacity duration-700", ready ? "opacity-100" : "opacity-0")}
    />
  );
}
