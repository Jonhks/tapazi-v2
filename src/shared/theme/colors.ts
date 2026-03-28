/**
 * Sistema centralizado de colores por deporte.
 * Por ahora solo worldcup usa este archivo activamente.
 * Los demás módulos tienen sus colores hardcodeados en sus propios componentes
 * y se migrarán aquí progresivamente.
 */

export const sportThemes = {
  ncaaMale: {
    // Tabla
    headerEven: "#0d0d0d",
    headerOdd: "#1a1a1a",
    cellEvenColEvenRow: "#0d0d0d",
    cellEvenColOddRow: "#141414",
    cellOddColEvenRow: "#1a1a1a",
    cellOddColOddRow: "#212121",
    // Menú
    appBar: "#000000",
    drawer: "#000000",
    accent: "#05fa87",
    defaultIcon: "#DC903B",
    // General
    bg: "#000000",
    text: "#ffffff",
    positive: "#05fa87",
    negative: "#ff3636",
    searchBg: "#d6cfcfff",
  },

  ncaaFemale: {
    // Tabla (tema naranja)
    headerEven: "#572d03",
    headerOdd: "#874607",
    cellEvenColEvenRow: "#572d03",
    cellEvenColOddRow: "#3d1f00",
    cellOddColEvenRow: "#874607",
    cellOddColOddRow: "#e27d25",
    // Menú
    appBar: "#572d03",
    drawer: "#572d03",
    accent: "#eaad2b",
    defaultIcon: "#eaad2b",
    // General
    bg: "#3d1f00",
    text: "#ffffff",
    positive: "#05fa87",
    negative: "#ff3636",
    searchBg: "#d6cfcfff",
  },

  epl: {
    // Tabla (tema morado)
    headerEven: "#380F55",
    headerOdd: "#2C0C37",
    cellEvenColEvenRow: "#220931",
    cellEvenColOddRow: "#19071F",
    cellOddColEvenRow: "#2C0C37",
    cellOddColOddRow: "#380F55",
    // Menú
    appBar: "#19071F",
    drawer: "#19071F",
    accent: "#9B59B6",
    defaultIcon: "#9B59B6",
    // General
    bg: "#19071F",
    text: "#ffffff",
    positive: "#05fa87",
    negative: "#ff3636",
    searchBg: "#d6cfcfff",
  },

  worldcup: {
    // Tabla (tema teal/cyan oscuro — imagen de diseño)
    headerEven: "#00292C",
    headerOdd: "#003B40",
    cellEvenColEvenRow: "#001A1D",
    cellEvenColOddRow: "#00292C",
    cellOddColEvenRow: "#002730",
    cellOddColOddRow: "#003440",
    // Menú
    appBar: "#00292C",
    drawer: "#00292C",
    accent: "#00E2F6", // cyan — ítem activo, textos destacados
    defaultIcon: "#00E2F6",
    // General
    bg: "#000000",
    text: "#ffffff",
    positive: "#05fa87", // verde — puntaje positivo
    negative: "#ff3636", // rojo  — puntaje negativo
    searchBg: "#d6cfcfff",
  },
} as const;

export type SportTheme = (typeof sportThemes)[keyof typeof sportThemes];
export type SportKey = keyof typeof sportThemes;
