import { SVGProps } from "react";

/** ViewBox retrato compartido — todas las canchas alinean igual en el morph. */
export const FIELD_VIEWBOX = "0 0 300 620";

interface Props extends SVGProps<SVGSVGElement> {
  title: string;
}

/**
 * Shell común para cada cancha. Solo líneas blancas: los trazos heredan
 * `currentColor`, así el padre decide color y glow.
 */
export function FieldSvg({ title, className, children, ...rest }: Props) {
  return (
    <svg
      viewBox={FIELD_VIEWBOX}
      className={className}
      role="img"
      aria-label={title}
      {...rest}
    >
      <g
        stroke="currentColor"
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        {children}
      </g>
    </svg>
  );
}
