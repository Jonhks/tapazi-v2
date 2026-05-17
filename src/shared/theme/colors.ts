/**
 * Sistema centralizado de colores por deporte.
 * Por ahora solo worldcup usa este archivo activamente.
 * Los demás módulos tienen sus colores hardcodeados en sus propios componentes
 * y se migrarán aquí progresivamente.
 */

export const sportThemes = {
  ncaaMale: {
    // Tabla — strongBg=headerEven, softBg=cellOddColOddRow, rowHoverBg=punto medio
    headerEven: "#0d0d0d",
    headerOdd: "#1a1a1a",
    cellEvenColEvenRow: "#0d0d0d",
    cellEvenColOddRow: "#141414",
    cellOddColEvenRow: "#1a1a1a",
    cellOddColOddRow: "#212121",
    rowHoverBg: "#1a1a1a",
    // Menú
    appBar: "#000000",
    drawer: "#000000",
    accent: "#05fa87",
    defaultIcon: "#DC903B",
    // General
    bg: "#000000",
    text: "#ffffff",
    textSecondary: "#bbbbbb",
    positive: "#05fa87",
    negative: "#ff3636",
    searchBg: "#d6cfcfff",
  },

  ncaaFemale: {
    // Tabla (tema morado/navy con acento magenta) — strongBg=headerEven, softBg=cellOddColOddRow
    headerEven: "#24253e",
    headerOdd: "#2d2d44",
    cellEvenColEvenRow: "#111120",
    cellEvenColOddRow: "#1c1c2e",
    cellOddColEvenRow: "#252538",
    cellOddColOddRow: "#303048",
    rowHoverBg: "#2d2d44",
    // Menú
    appBar: "#24253e",
    drawer: "#24253e",
    accent: "#e040fb", // magenta — primera columna, íconos, resaltados
    defaultIcon: "#e040fb",
    // General
    bg: "#111120",
    text: "#ffffff",
    textSecondary: "#bbbbbb",
    positive: "#00e676", // verde brillante para puntos pagados
    negative: "#ff5252", // rojo para puntos no pagados
    searchBg: "#d6cfcfff",
  },

  epl: {
    // Tabla (tema morado) — strongBg=headerEven, softBg=cellOddColOddRow, rowHoverBg=punto medio
    headerEven: "#2C0C37",
    headerOdd: "#380F55",
    cellEvenColEvenRow: "#220931",
    cellEvenColOddRow: "#19071F",
    cellOddColEvenRow: "#2C0C37",
    cellOddColOddRow: "#380F55",
    rowHoverBg: "#320D46",
    // Menú
    appBar: "#19071F",
    drawer: "#19071F",
    accent: "#9B59B6",
    defaultIcon: "#9B59B6",
    // General
    bg: "#19071F",
    text: "#ffffff",
    textSecondary: "#bbbbbb",
    positive: "#05fa87",
    negative: "#ff3636",
    searchBg: "#d6cfcfff",
  },

  worldcup: {
    // Tabla (tema teal/cyan oscuro) — strongBg=headerEven, softBg=cellOddColOddRow, rowHoverBg=punto medio
    headerEven: "#001A1D",
    headerOdd: "#003B40",
    cellEvenColEvenRow: "#001A1D",
    cellEvenColOddRow: "#00292C",
    cellOddColEvenRow: "#002730",
    cellOddColOddRow: "#003440",
    rowHoverBg: "#00292C",
    // Menú
    appBar: "#00292C",
    drawer: "#00292C",
    accent: "#00E2F6", // cyan — ítem activo, textos destacados
    defaultIcon: "#00E2F6",
    // General
    bg: "#000000",
    text: "#ffffff",
    textSecondary: "#bbbbbb",
    positive: "#05fa87", // verde — puntaje positivo
    negative: "#ff3636", // rojo  — puntaje negativo
    searchBg: "#d6cfcfff",
  },
} as const;

export type SportTheme = (typeof sportThemes)[keyof typeof sportThemes];
export type SportKey = keyof typeof sportThemes;
