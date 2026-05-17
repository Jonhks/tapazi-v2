import { Outlet } from "react-router-dom";
import classes from "./AuthLayout.module.css";
import Menu from "../components/Menu/Menu";
import { useMediaQuery } from "@mui/material";
import MenuMobile from "../components/Menu/MenuMobile";

const InstructionsLayout = ({ ImgInstructions }: { ImgInstructions: string }) => {
  const isMobile = useMediaQuery("(max-width:900px)");

  return (
    <div
      className={classes.containerHistory}
      style={{ backgroundImage: `url(${ImgInstructions})` }}
    >
      {!isMobile && <Menu />}
      <Outlet />
      {isMobile && <MenuMobile />}
    </div>
  );
};

export default InstructionsLayout;
