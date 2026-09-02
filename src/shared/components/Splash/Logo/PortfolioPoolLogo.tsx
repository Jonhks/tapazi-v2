import { SVGProps } from "react";

/**
 * ─────────────────────────────────────────────────────────────
 * TODO: reemplazar este placeholder por el logo oficial cuando esté listo.
 * Mantener los atributos `data-logo-mark` y `data-logo-word` en los nodos
 * nuevos — todos los timelines de splash apuntan a ellos.
 * ─────────────────────────────────────────────────────────────
 *
 * Wordmark placeholder: monograma "P" geométrico + "THE PORTFOLIO POOL".
 * Renderiza en `currentColor` así el splash controla el tono (blanco sobre negro).
 */
export function PortfolioPoolLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 260 100"
      fill="none"
      role="img"
      aria-label="The Portfolio Pool"
      {...props}
    >
      <g data-logo-mark>
        <path
          d="M110 10h30a16 16 0 0 1 0 32h-18v18h-12z"
          fill="currentColor"
        />
      </g>
      <text
        data-logo-word
        x="130"
        y="72"
        textAnchor="middle"
        fill="currentColor"
        fontFamily="Inter, -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif"
        fontSize="15"
        fontWeight={700}
        letterSpacing="0.1em"
      >
        THE PORTFOLIO
      </text>
      <text
        data-logo-word
        x="130"
        y="92"
        textAnchor="middle"
        fill="currentColor"
        fontFamily="Inter, -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif"
        fontSize="15"
        fontWeight={700}
        letterSpacing="0.3em"
      >
        POOL
      </text>
    </svg>
  );
}
