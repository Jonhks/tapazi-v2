import gsap from "gsap";

interface CrossMorphOptions {
  at?: number | string;
  outDuration?: number;
  inDuration?: number;
  drift?: number;
}

/**
 * Cross-morph cinematográfico entre dos capas de cancha apiladas.
 * Simula el morph superponiendo opacidad, escala y blur — la capa saliente
 * "se derrite" mientras la entrante condensa hasta enfocarse.
 */
export function crossMorph(
  tl: ReturnType<typeof gsap.timeline>,
  fromLayer: Element,
  toLayer: Element,
  opts: CrossMorphOptions = {},
) {
  const { at = ">", outDuration = 0.45, inDuration = 0.6, drift = 0 } = opts;

  tl.to(
    fromLayer,
    {
      autoAlpha: 0,
      scale: 1.06 + drift,
      filter: "blur(12px)",
      duration: outDuration,
      ease: "power2.in",
    },
    at,
  );

  // Overlap: la cancha nueva condensa mientras la vieja aún se derrite.
  tl.fromTo(
    toLayer,
    { autoAlpha: 0, scale: 0.94 - drift, filter: "blur(12px)" },
    {
      autoAlpha: 1,
      scale: 1,
      filter: "blur(0px)",
      duration: inDuration,
      ease: "power3.out",
    },
    `<${outDuration * 0.4}`,
  );

  return tl;
}
