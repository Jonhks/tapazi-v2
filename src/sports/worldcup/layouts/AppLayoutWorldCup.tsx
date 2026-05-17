import { Outlet } from "react-router-dom";
import classes from "./AppLayoutWorldCup.module.css";
import MenuWorldCup from "../components/Menu/MenuWorldCup";
import MenuWorldCupMobile from "../components/Menu/MenuWorldCupMobile";
import useMediaQuery from "@mui/material/useMediaQuery";

const AppLayoutWorldCup = () => {
  const isMobile = useMediaQuery("(max-width:800px)");

  return (
    <div className={classes.containerApp}>
      {!isMobile && <MenuWorldCup />}
      <Outlet />
      {isMobile && <MenuWorldCupMobile />}
    </div>
  );
};

export default AppLayoutWorldCup;
