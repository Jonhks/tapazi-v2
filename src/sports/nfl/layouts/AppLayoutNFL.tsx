import { Outlet } from "react-router-dom";
import classes from "./Layouts.module.css";
import MenuNFL from "../components/MenuNFL/MenuNFL";
import MenuMobileNFL from "../components/MenuNFL/MenuMobileNFL";
import useMediaQuery from "@mui/material/useMediaQuery";

const AppLayoutNFL = () => {
  const isMobile = useMediaQuery("(max-width:800px)");

  return (
    <div className={classes.containerApp}>
      {!isMobile && <MenuNFL />}
      <Outlet />
      {isMobile && <MenuMobileNFL />}
    </div>
  );
};

export default AppLayoutNFL;
