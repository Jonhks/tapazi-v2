import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

type BuildTimeline = (
  root: HTMLElement,
  gsapInstance: typeof gsap,
) => gsap.core.Timeline;

/**
 * Dueño del ciclo de vida de un timeline de GSAP para un splash.
 *
 * - Corre `build(root, gsap)` dentro de un `gsap.context` acotado a la raíz,
 *   así cada tween se revierte solo al desmontar (cero memory leaks).
 * - Respeta `prefers-reduced-motion`: el timeline avanza rápido para que
 *   el usuario llegue a la app sin la espera cinemática.
 */
export function useSplashTimeline(
  build: BuildTimeline,
  deps: unknown[] = [],
) {
  const rootRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useLayoutEffect(() => {
    if (!rootRef.current) return undefined;

    const ctx = gsap.context(() => {
      const tl = build(rootRef.current!, gsap);
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        tl.timeScale(100);
      }
      timelineRef.current = tl;
    }, rootRef);

    return () => {
      timelineRef.current?.kill();
      timelineRef.current = null;
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { rootRef, timelineRef };
}
