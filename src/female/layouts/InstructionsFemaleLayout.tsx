import { Outlet } from "react-router-dom";
import classes from "./AuthLayoutFemale.module.css";
import MenuFemale from "../components/Menufemale/MenuFemale";
import MenuMobileFemale from "../components/Menufemale/MenuMobilefemale";
import useMediaQuery from "@mui/material/useMediaQuery";

const InstructionsFemaleLayout = () => {
  const isMobile = useMediaQuery("(max-width:800px)");

  return (
    <div className={classes.containerInstructionsFemale}>
      {!isMobile && <MenuFemale />}
      <Outlet />
      {isMobile && <MenuMobileFemale />}
    </div>
  );
};

export default InstructionsFemaleLayout;
