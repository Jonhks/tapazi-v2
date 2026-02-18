import { Outlet } from "react-router-dom";
import classes from "./AuthLayoutFemale.module.css";
import MenuFemale from "../components/Menufemale/MenuFemale";
import MenuMobileFemale from "../components/Menufemale/MenuMobilefemale";
import useMediaQuery from "@mui/material/useMediaQuery";

const HistoryFemaleLayout = () => {
  const isMobile = useMediaQuery("(max-width:800px)");

  return (
    <div className={classes.containerHistoryFemale}>
      {!isMobile && <MenuFemale />}
      <Outlet />
      {isMobile && <MenuMobileFemale />}
    </div>
  );
};

export default HistoryFemaleLayout;
