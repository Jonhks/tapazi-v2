import { useState } from "react";
import SportsFootballIcon from "@mui/icons-material/SportsFootball";
import classes from "./TeamSeedGrid.module.css";

interface Props {
  src?: string;
}

/** Escudo del equipo, con el balón de NFL como respaldo si falta la URL o si la imagen falla al cargar. */
export function TeamCrest({ src }: Props) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return <SportsFootballIcon className={classes.crestFallback} />;
  }

  return (
    <img
      src={src}
      alt=""
      className={classes.crest}
      onError={() => setFailed(true)}
    />
  );
}

export default TeamCrest;
