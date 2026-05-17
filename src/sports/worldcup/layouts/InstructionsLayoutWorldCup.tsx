import { Outlet } from "react-router-dom";
import classes from "./AppLayoutWorldCup.module.css";
import MenuWorldCup from "../components/Menu/MenuWorldCup";
import MenuWorldCupMobile from "../components/Menu/MenuWorldCupMobile";
import { useMediaQuery } from "@mui/material";

const InstructionsLayoutWorldCup = ({ ImgInstructions }: { ImgInstructions?: string }) => {
  const isMobile = useMediaQuery("(max-width:900px)");

  return (
    <div
      className={classes.containerInstructions}
      style={ImgInstructions ? { backgroundImage: `url(${ImgInstructions})` } : undefined}
    >
      {!isMobile && <MenuWorldCup />}
      <Outlet />
      {isMobile && <MenuWorldCupMobile />}
    </div>
  );
};

export default InstructionsLayoutWorldCup;
