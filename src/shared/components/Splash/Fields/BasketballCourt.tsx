import { SVGProps } from "react";
import { FieldSvg } from "./FieldSvg";

/** Cancha de basket minimalista — llaves, arcos y círculo central. */
export function BasketballCourt(props: SVGProps<SVGSVGElement>) {
  return (
    <FieldSvg
      title="Basketball court"
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
        r="45"
      />

      {/* Llave superior + semicírculo de tiros libres + arco de triples */}
      <rect
        data-draw
        x="100"
        y="20"
        width="100"
        height="110"
      />
      <path
        data-draw
        d="M115 130 A35 35 0 0 0 185 130"
      />
      <path
        data-draw
        d="M40 20 L40 75 A112 112 0 0 0 260 75 L260 20"
      />

      {/* Llave inferior + semicírculo de tiros libres + arco de triples */}
      <rect
        data-draw
        x="100"
        y="490"
        width="100"
        height="110"
      />
      <path
        data-draw
        d="M115 490 A35 35 0 0 1 185 490"
      />
      <path
        data-draw
        d="M40 600 L40 545 A112 112 0 0 1 260 545 L260 600"
      />
    </FieldSvg>
  );
}
