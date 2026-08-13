import { SVGProps } from "react";
import { FieldSvg } from "./FieldSvg";

const YARD_LINES = [126, 172, 218, 264, 310, 356, 402, 448, 494];
const HASH_COLUMNS = [122, 172];

/** Cancha de NFL minimalista — end zones, líneas de yarda y hash marks. */
export function NFLField(props: SVGProps<SVGSVGElement>) {
  return (
    <FieldSvg
      title="NFL field"
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

      {/* Líneas de end zone */}
      <line
        data-draw
        x1="20"
        y1="80"
        x2="280"
        y2="80"
      />
      <line
        data-draw
        x1="20"
        y1="540"
        x2="280"
        y2="540"
      />

      {/* Líneas de yarda */}
      {YARD_LINES.map((y) => (
        <line
          key={y}
          data-draw
          x1="20"
          y1={y}
          x2="280"
          y2={y}
        />
      ))}

      {/* Hash marks entre líneas de yarda */}
      {YARD_LINES.slice(0, -1).map((y) =>
        HASH_COLUMNS.map((x) => (
          <line
            key={`${x}-${y}`}
            x1={x}
            y1={y + 23}
            x2={x + 6}
            y2={y + 23}
            strokeWidth={2}
          />
        )),
      )}

      {/* Marca de mitad de cancha */}
      <circle
        cx="150"
        cy="310"
        r="3"
        fill="currentColor"
        stroke="none"
      />
    </FieldSvg>
  );
}
