import { FIELD_VIEWBOX } from "../Fields/FieldSvg";

const [, , VIEW_W, VIEW_H] = FIELD_VIEWBOX.split(" ").map(Number);

export interface Point {
  x: number;
  y: number;
}

/**
 * Muestrea `count` puntos distribuidos uniformemente sobre cada forma
 * `[data-draw]` de un SVG de cancha ya renderizado. Devuelve offsets en
 * píxeles relativos al centro de la cancha, listos para animar x/y con GSAP.
 *
 * Usa `getScreenCTM()` (la matriz real de transformación a pantalla) en vez
 * de un cálculo manual de escala, así los puntos quedan correctos incluso
 * si la cancha está rotada/escalada por CSS (ej. "acostada" en desktop).
 *
 * El SVG debe estar en el layout (no display:none) para poder medir longitudes.
 */
export function sampleFieldPoints(
  svg: SVGSVGElement | null,
  count: number,
): Point[] {
  if (!svg) return [];
  const shapes = [...svg.querySelectorAll<SVGGeometryElement>("[data-draw]")];
  if (shapes.length === 0) return [];

  const lengths = shapes.map((shape) => shape.getTotalLength());
  const totalLength = lengths.reduce((sum, len) => sum + len, 0);

  const ctm = svg.getScreenCTM();
  const rect = svg.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  // fallback (sin transform de pantalla disponible): escala simple por viewBox
  const fallbackScale = Math.min(rect.width / VIEW_W, rect.height / VIEW_H);

  const points: Point[] = [];
  for (let i = 0; i < count; i++) {
    let distance = (i / count) * totalLength;
    for (let j = 0; j < shapes.length; j++) {
      if (distance <= lengths[j]) {
        const p = shapes[j].getPointAtLength(distance);
        if (ctm) {
          const screenPoint = new DOMPoint(p.x, p.y).matrixTransform(ctm);
          points.push({
            x: screenPoint.x - centerX,
            y: screenPoint.y - centerY,
          });
        } else {
          points.push({
            x: (p.x - VIEW_W / 2) * fallbackScale,
            y: (p.y - VIEW_H / 2) * fallbackScale,
          });
        }
        break;
      }
      distance -= lengths[j];
    }
  }
  return points;
}
