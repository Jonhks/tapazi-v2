import { Outlet } from "react-router-dom";
import classes from "./SharedBackgroundLayout.module.css";

type SharedBackgroundLayoutProps = {
  /** URL o path de la imagen de fondo */
  backgroundImage: string;
  /** Posición de la imagen en mobile (default: center) */
  mobilePosition?: "center" | "left" | "right";
};

/**
 * Layout de fondo genérico para vistas de Stats, History, Instructions.
 * Solo aporta la imagen de fondo; el contenido lo renderiza <Outlet />.
 */
const SharedBackgroundLayout = ({
  backgroundImage,
  mobilePosition = "center",
}: SharedBackgroundLayoutProps) => {
  return (
    <div
      className={classes.container}
      style={
        {
          "--bg-image": `url("${backgroundImage}")`,
          "--bg-position-mobile": mobilePosition,
        } as React.CSSProperties
      }
    >
      <Outlet />
    </div>
  );
};

export default SharedBackgroundLayout;
