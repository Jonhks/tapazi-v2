// import { Outlet } from "react-router-dom";
import classes from "./AuthLayout.module.css";
import Menu from "@/components/Menu/Menu";
import { useMediaQuery } from "@mui/material";
import MenuMobile from "@/components/Menu/MenuMobile";

const HistoryLayout = () => {
  const isMobile = useMediaQuery("(max-width:900px)");

  return (
    <div
      className={classes.containerStats}
      style={{
        backgroundImage: `url(https://s3.mx-central-1.amazonaws.com/portfolio.pool/resources/under_construction_purple.png)`,
      }}
    >
      {!isMobile && <Menu />}
      {/* <Outlet /> */}
      {isMobile && <MenuMobile />}
    </div>
  );
};

export default HistoryLayout;
