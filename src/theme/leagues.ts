export type LeagueId = "ncaa-male" | "female" | "epl" | "worldcup";

export type LeagueTheme = {
  /** Color de fondo del AppBar y Drawer */
  appbarBg: string;
  /** Color del texto/iconos del AppBar (barra superior/lateral) */
  appbarTextColor: string;
  /** Color del ítem activo y títulos del drawer */
  accentColor: string;
  /** Color de íconos en estado inactivo */
  defaultIconColor: string;
  /** Fondo del modal SweetAlert2 */
  swalBg: string;
  /** Color del botón de confirmar en SweetAlert2 */
  swalConfirm: string;
  /** Si el título del drawer va en negrita */
  titleBold?: boolean;
  /** Color de fondo de la barra mobile */
  mobileBg: string;
};

export const leagueThemes: Record<LeagueId, LeagueTheme> = {
  "ncaa-male": {
    appbarBg: "rgba(0, 0, 0, 0.8)",
    appbarTextColor: "#05fa05",
    accentColor: "#05fa87",
    defaultIconColor: "#DC903B",
    swalBg: "rgba(0, 0, 0, 0.8)",
    swalConfirm: "rgba(5, 250, 5, .8)",
    mobileBg: "#000",
  },
  female: {
    appbarBg: "rgba(36, 37, 62, 0.8)",
    appbarTextColor: "#df2af9",
    accentColor: "#e040fb",
    defaultIconColor: "#DC903B",
    swalBg: "rgba(36, 37, 62, .8)",
    swalConfirm: "rgba(223, 42, 249, .8)",
    mobileBg: "#24253e",
  },
  epl: {
    appbarBg: "rgba(56, 15, 81, 0.8)",
    appbarTextColor: "white",
    accentColor: "#4BF589",
    defaultIconColor: "gray",
    swalBg: "#200930",
    swalConfirm: "#3ED076",
    titleBold: true,
    mobileBg: "#380f51",
  },
  // TODO: reemplazar con los colores reales de World Cup
  worldcup: {
    appbarBg: "rgba(0, 0, 0, 0.85)",
    appbarTextColor: "#FFD700",
    accentColor: "#FFD700",
    defaultIconColor: "#888",
    swalBg: "rgba(0, 0, 0, 0.9)",
    swalConfirm: "#FFD700",
    mobileBg: "#000",
  },
};

export type NavItem = {
  text: string;
  /** Ruta de navegación o "logOut" / "more" como ids especiales */
  id: string;
};

/**
 * Retorna los ítems de navegación para cada liga.
 * Los ids especiales "logOut" y "more" son manejados por los componentes de menú.
 */
export const getNavItems = (
  league: LeagueId,
  userId: string,
  sportId = "1",
): NavItem[] => {
  const navMap: Record<LeagueId, NavItem[]> = {
    "ncaa-male": [
      { text: "Home", id: `home/${userId}` },
      { text: "My Portfolios", id: `myPortfolio/${userId}` },
      { text: "Instructions", id: `instructions/${userId}` },
      { text: "Stats", id: `stats/${userId}` },
      { text: "History", id: `history/${userId}` },
      { text: "LogOut", id: "logOut" },
    ],
    female: [
      { text: "Home", id: `/ncaa-female/home/${userId}/${sportId}` },
      { text: "My Portfolios", id: `/ncaa-female/myPortfolio/${userId}/${sportId}` },
      { text: "Instructions", id: `/ncaa-female/instructions/${userId}/${sportId}` },
      { text: "Stats", id: `/ncaa-female/stats/${userId}/${sportId}` },
      { text: "History", id: `/ncaa-female/history/${userId}/${sportId}` },
      { text: "LogOut", id: "logOut" },
    ],
    epl: [
      { text: "Home", id: `epl/home/${userId}/${sportId}` },
      { text: "My Portfolio", id: `epl/myPortfolio/${userId}/${sportId}` },
      { text: "Instructions", id: `epl/instructions/${userId}/${sportId}` },
      { text: "Stats", id: `epl/stats/${userId}/${sportId}` },
      { text: "LogOut", id: "logOut" },
    ],
    worldcup: [
      { text: "Home", id: `worldcup/home/${userId}/${sportId}` },
      { text: "My Portfolio", id: `worldcup/myPortfolio/${userId}/${sportId}` },
      { text: "Instructions", id: `worldcup/instructions/${userId}/${sportId}` },
      { text: "Stats", id: `worldcup/stats/${userId}/${sportId}` },
      { text: "History", id: `worldcup/history/${userId}/${sportId}` },
      { text: "LogOut", id: "logOut" },
    ],
  };

  return navMap[league];
};
