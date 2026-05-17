import { Outlet } from "react-router-dom";
import classes from "./AppLayoutWorldCup.module.css";
import MenuWorldCup from "../components/Menu/MenuWorldCup";
import MenuWorldCupMobile from "../components/Menu/MenuWorldCupMobile";
import { useMediaQuery } from "@mui/material";

const HistoryLayoutWorldCup = ({ ImgHistory }: { ImgHistory?: string }) => {
  const isMobile = useMediaQuery("(max-width:900px)");

  return (
    <div
      className={classes.containerHistory}
      style={ImgHistory ? { backgroundImage: `url(${ImgHistory})` } : undefined}
    >
      {!isMobile && <MenuWorldCup />}
      <Outlet />
      {isMobile && <MenuWorldCupMobile />}
    </div>
  );
};

export default HistoryLayoutWorldCup;
