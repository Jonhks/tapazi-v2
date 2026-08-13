import gsap from "gsap";

/**
 * Beat final compartido: la luz converge, un flash suave aparece y el
 * logo se asienta. Vivir en un solo lugar garantiza que el brand reveal
 * se sienta igual en todos los conceptos de splash.
 *
 * Nodos esperados dentro de la raíz del splash:
 *   [data-logo], [data-logo-glow], [data-flash] (opcional)
 */
export function addLogoReveal(
  tl: ReturnType<typeof gsap.timeline>,
  q: (selector: string) => Element[],
  at: number | string,
) {
  const logo = q("[data-logo]");
  const glow = q("[data-logo-glow]");
  const flash = q("[data-flash]");

  tl.fromTo(
    glow,
    { autoAlpha: 0, scale: 0.35 },
    { autoAlpha: 0.9, scale: 1, duration: 0.5, ease: "power3.out" },
    at,
  );

  if (flash.length > 0) {
    tl.fromTo(
      flash,
      { autoAlpha: 0 },
      { autoAlpha: 0.5, duration: 0.12, ease: "power1.in" },
      ">-0.15",
    ).to(flash, { autoAlpha: 0, duration: 0.55, ease: "power2.out" });
  }

  tl.fromTo(
    logo,
    { autoAlpha: 0, scale: 0.92, y: 10 },
    { autoAlpha: 1, scale: 1, y: 0, duration: 0.75, ease: "expo.out" },
    typeof at === "number" ? at + 0.18 : "<0.1",
  );

  // El glow se relaja detrás del logo en vez de morir de golpe.
  tl.to(glow, { autoAlpha: 0.35, scale: 1.18, duration: 0.8, ease: "sine.out" }, "<0.35");

  return tl;
}
