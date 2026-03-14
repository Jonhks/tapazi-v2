import { Outlet } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import type { ReactNode } from "react";
import classes from "./SharedAppLayout.module.css";

type SharedAppLayoutProps = {
  /** Componente de menú desktop */
  menu: ReactNode;
  /** Componente de menú mobile */
  menuMobile: ReactNode;
  /** URL o path de imagen de fondo para el layout principal */
  backgroundImage: string;
};

/**
 * Layout principal compartido para todas las ligas.
 * Alterna entre menú desktop y mobile según el breakpoint.
 */
const SharedAppLayout = ({
  menu,
  menuMobile,
  backgroundImage,
}: SharedAppLayoutProps) => {
  const isMobile = useMediaQuery("(max-width:800px)");

  return (
    <div
      className={classes.container}
      style={
        {
          "--layout-bg-image": `url("${backgroundImage}")`,
        } as React.CSSProperties
      }
    >
      {!isMobile && menu}
      <Outlet />
      {isMobile && menuMobile}
    </div>
  );
};

export default SharedAppLayout;
