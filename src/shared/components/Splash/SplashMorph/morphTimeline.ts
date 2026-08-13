import type gsap from "gsap";
import { FIELD_SEQUENCE } from "../Fields";
import { crossMorph } from "../utils/crossMorph";
import { addLogoReveal } from "../utils/logoReveal";
import { sampleFieldPoints } from "../utils/samplePoints";
import { createRandom, range } from "../utils/random";

const MORPH_START = 2.1;
const MORPH_STEP = 0.55;
const COLLAPSE = MORPH_START + (FIELD_SEQUENCE.length - 1) * MORPH_STEP + 0.35;

interface BuildArgs {
  root: HTMLElement;
  gsap: typeof gsap;
  duration?: number;
  onComplete?: () => void;
}

/**
 * Morph Sports — todo arranca como polvo de estrellas.
 *
 * partículas dispersas → convergen sobre las líneas de la primera cancha →
 * la luz condensa en líneas reales → la energía muta por cada deporte de
 * Tapazi (el glow ambiental toma el color propio de cada uno) → la última
 * cancha colapsa → logo.
 */
export function buildMorphTimeline({ root, gsap, duration, onComplete }: BuildArgs) {
  const q = gsap.utils.selector(root);
  const layers = q("[data-field-layer]");
  const particles = q("[data-particle]");
  const glows = q("[data-energy-glow]"); // mismo orden que FIELD_SEQUENCE

  const firstFieldId = FIELD_SEQUENCE[0].id;
  const firstSvg = root.querySelector<SVGSVGElement>(
    `[data-field="${firstFieldId}"] svg`,
  );
  const linePoints = sampleFieldPoints(firstSvg, particles.length);

  const { width, height } = root.getBoundingClientRect();
  const random = createRandom(23);
  const scatter = particles.map(() => ({
    x: range(random, -width * 0.42, width * 0.42),
    y: range(random, -height * 0.44, height * 0.44),
  }));
  const target = (i: number) =>
    linePoints[i % Math.max(linePoints.length, 1)] ?? { x: 0, y: 0 };

  gsap.set(layers, { autoAlpha: 0 });
  gsap.set(glows, { autoAlpha: 0 });

  const tl = gsap.timeline({ onComplete });

  // ── 1. El polvo de estrellas despierta, disperso por el cuadro ──
  tl.set(particles, { x: (i: number) => scatter[i].x, y: (i: number) => scatter[i].y }, 0)
    .to(
      particles,
      {
        autoAlpha: (_i: number, el: Element) =>
          parseFloat((el as HTMLElement).style.getPropertyValue("--p-opacity")) || 1,
        duration: 0.5,
        stagger: { each: 0.004, from: "random" },
      },
      0.05,
    )
    .to(glows[0], { autoAlpha: 0.45, duration: 0.8, ease: "sine.inOut" }, 0.15);

  // ── 2. El polvo converge en la geometría de la primera cancha ──
  tl.to(
    particles,
    {
      x: (i: number) => target(i).x,
      y: (i: number) => target(i).y,
      duration: 0.95,
      ease: "power2.inOut",
      stagger: { each: 0.0035, from: "random" },
    },
    0.7,
  );

  // ── 3. La luz condensa en líneas reales ──
  tl.fromTo(
    layers[0],
    { autoAlpha: 0, filter: "blur(10px)" },
    { autoAlpha: 1, filter: "blur(0px)", duration: 0.5, ease: "power2.out" },
    1.6,
  ).to(
    particles,
    { autoAlpha: 0, duration: 0.35, stagger: { each: 0.002, from: "random" } },
    1.65,
  );

  // ── 4. Cadena de morphs — el glow ambiental toma el color de cada deporte ──
  for (let i = 0; i < layers.length - 1; i++) {
    const at = MORPH_START + i * MORPH_STEP;
    crossMorph(tl, layers[i], layers[i + 1], {
      at,
      outDuration: 0.42,
      inDuration: 0.58,
      drift: 0.02,
    });
    tl.to(glows[i + 1], { autoAlpha: 0.5, duration: 0.4, ease: "sine.inOut" }, at).to(
      glows[i],
      { autoAlpha: 0.12, duration: 0.4, ease: "sine.inOut" },
      at,
    );
  }

  // ── 5. La última cancha colapsa en pura energía ──
  tl.to(
    layers[layers.length - 1],
    {
      autoAlpha: 0,
      scale: 0.25,
      filter: "blur(16px)",
      duration: 0.55,
      ease: "power3.in",
    },
    COLLAPSE,
  ).to(glows, { autoAlpha: 0.18, duration: 0.6, ease: "sine.inOut" }, COLLAPSE + 0.1);

  // ── 6. Brand reveal + fundido a negro ──
  addLogoReveal(tl, q, COLLAPSE + 0.45);
  tl.to(root, { autoAlpha: 0, duration: 0.55, ease: "power2.inOut" }, "+=0.6");

  if (duration) tl.timeScale(tl.duration() / duration);
  return tl;
}
