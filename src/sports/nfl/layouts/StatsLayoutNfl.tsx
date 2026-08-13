import { Outlet } from "react-router-dom";
import classes from "./Layouts.module.css";
import MenuNFL from "../components/MenuNFL/MenuNFL";
import { useMediaQuery } from "@mui/material";
import MenuMobileNFL from "../components/MenuNFL/MenuMobileNFL";

const StatsLayoutNfl = () => {
  const isMobile = useMediaQuery("(max-width:900px)");

  return (
    <div className={classes.containerStats}>
      {!isMobile && <MenuNFL />}
      <Outlet />
      {isMobile && <MenuMobileNFL />}
    </div>
  );
};

export default StatsLayoutNfl;
