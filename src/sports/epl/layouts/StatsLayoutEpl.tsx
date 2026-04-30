import { Outlet } from "react-router-dom";
import classes from "./AuthLayout.module.css";
import MenuEPL from "../components/MenuEPL/MenuEPL";
import { useMediaQuery } from "@mui/material";
import MenuMobile from "../components/MenuEPL/MenuMobileEPL";

const HistoryLayout = () => {
  const isMobile = useMediaQuery("(max-width:900px)");

  return (
    <div className={classes.containerStats}>
      {!isMobile && <MenuEPL />}
      <Outlet />
      {isMobile && <MenuMobile />}
    </div>
  );
};

export default HistoryLayout;
