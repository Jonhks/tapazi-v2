import { SVGProps } from "react";
import { FieldSvg } from "./FieldSvg";

/**
 * Cancha de soccer minimalista — solo líneas blancas.
 * Cada trazo lleva `data-draw` para que los timelines corran un efecto
 * de "dibujado" via stroke-dashoffset, o muestreen posiciones de partículas.
 */
export function SoccerField(props: SVGProps<SVGSVGElement>) {
  return (
    <FieldSvg
      title="Soccer field"
      {...props}
    >
      <rect
        data-draw
        x="20"
        y="20"
        width="260"
        height="580"
        rx="2"
      />
      <line
        data-draw
        x1="20"
        y1="310"
        x2="280"
        y2="310"
      />
      <circle
        data-draw
        cx="150"
        cy="310"
        r="50"
      />
      <circle
        data-dot
        cx="150"
        cy="310"
        r="3"
        fill="currentColor"
        stroke="none"
      />

      {/* Área grande + área chica (arriba) */}
      <rect
        data-draw
        x="70"
        y="20"
        width="160"
        height="90"
      />
      <rect
        data-draw
        x="110"
        y="20"
        width="80"
        height="35"
      />
      <circle
        data-dot
        cx="150"
        cy="90"
        r="3"
        fill="currentColor"
        stroke="none"
      />
      <path
        data-draw
        d="M104.2 110 A50 50 0 0 0 195.8 110"
      />

      {/* Área grande + área chica (abajo) */}
      <rect
        data-draw
        x="70"
        y="510"
        width="160"
        height="90"
      />
      <rect
        data-draw
        x="110"
        y="565"
        width="80"
        height="35"
      />
      <circle
        data-dot
        cx="150"
        cy="530"
        r="3"
        fill="currentColor"
        stroke="none"
      />
      <path
        data-draw
        d="M104.2 510 A50 50 0 0 1 195.8 510"
      />

      {/* Arcos de esquina */}
      <path
        data-draw
        d="M20 32 A12 12 0 0 0 32 20"
      />
      <path
        data-draw
        d="M268 20 A12 12 0 0 0 280 32"
      />
      <path
        data-draw
        d="M280 588 A12 12 0 0 0 268 600"
      />
      <path
        data-draw
        d="M32 600 A12 12 0 0 0 20 588"
      />
    </FieldSvg>
  );
}
