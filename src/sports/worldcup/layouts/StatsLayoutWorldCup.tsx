import { Outlet } from "react-router-dom";
import classes from "./AppLayoutWorldCup.module.css";
import MenuWorldCup from "../components/Menu/MenuWorldCup";
import MenuWorldCupMobile from "../components/Menu/MenuWorldCupMobile";
import { useMediaQuery } from "@mui/material";

const StatsLayoutWorldCup = ({ ImgStats }: { ImgStats?: string }) => {
  const isMobile = useMediaQuery("(max-width:900px)");

  return (
    <div
      className={classes.containerStats}
      style={ImgStats ? { backgroundImage: `url(${ImgStats})` } : undefined}
    >
      {!isMobile && <MenuWorldCup />}
      <Outlet />
      {isMobile && <MenuWorldCupMobile />}
    </div>
  );
};

export default StatsLayoutWorldCup;
