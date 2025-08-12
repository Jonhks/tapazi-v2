import { Outlet } from "react-router-dom";
import classes from "./AuthLayout.module.css";
import MenuEPL from "@/epl/components/MenuEPL/MenuEPL";
import { useMediaQuery } from "@mui/material";
import MenuMobile from "@/epl/components/MenuEPL/MenuMobileEPL";

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
