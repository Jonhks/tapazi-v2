import { Outlet } from "react-router-dom";
import classes from "./Layouts.module.css";
import MenuNFL from "../components/MenuNFL/MenuNFL";
import MenuMobileNFL from "../components/MenuNFL/MenuMobileNFL";
import { useMediaQuery } from "@mui/material";

const HistoryLayoutNfl = () => {
  const isMobile = useMediaQuery("(max-width:900px)");

  return (
    <div className={classes.containerHistory}>
      {!isMobile && <MenuNFL />}
      <Outlet />
      {isMobile && <MenuMobileNFL />}
    </div>
  );
};

export default HistoryLayoutNfl;
