import { ComponentType, SVGProps } from "react";
import { sportThemes } from "@/shared/theme/colors";
import { FieldSvg, FIELD_VIEWBOX } from "./FieldSvg";
import { SoccerField } from "./SoccerField";
import { NFLField } from "./NFLField";
import { BasketballCourt } from "./BasketballCourt";

export { FieldSvg, FIELD_VIEWBOX };
export { SoccerField, NFLField, BasketballCourt };

export interface FieldSequenceItem {
  id: string;
  name: string;
  Component: ComponentType<SVGProps<SVGSVGElement>>;
  /** Color de acento del deporte — usado para el glow ambiental del morph. */
  color: string;
}

/**
 * Secuencia canónica de deportes que recorre el splash. Orden = orden
 * narrativo del reveal. Solo los 4 deportes reales de Tapazi — EPL y
 * WorldCup comparten la silueta de cancha de soccer, cada uno con su
 * propio color de acento.
 */
export const FIELD_SEQUENCE: FieldSequenceItem[] = [
  {
    id: "ncaa",
    name: "NCAA Basketball",
    Component: BasketballCourt,
    color: sportThemes.ncaaFemale.accent,
  },
  {
    id: "epl",
    name: "EPL Soccer",
    Component: SoccerField,
    color: sportThemes.epl.accent,
  },
  {
    id: "worldcup",
    name: "FIFA World Cup",
    Component: SoccerField,
    color: sportThemes.worldcup.accent,
  },
  {
    id: "nfl",
    name: "NFL",
    Component: NFLField,
    color: sportThemes.nfl.accent,
  },
];
