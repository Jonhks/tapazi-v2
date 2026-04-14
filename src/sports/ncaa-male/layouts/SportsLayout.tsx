import { Outlet } from "react-router-dom";
import classes from "./AuthLayout.module.css";
import { useMediaQuery, Box } from "@mui/material";
import SportsMenu from "../components/SportsMenu/SportsMenu";
import SportsMenuMobile from "../components/SportsMenu/SportsMenuMobile";

const HistoryLayout = ({ ImgSports }: { ImgSports: string }) => {
  const isMobile = useMediaQuery("(max-width:900px)");

  return (
    <div
      className={classes.containerStats}
      style={{
        backgroundImage: `url(${ImgSports})`,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {!isMobile && <SportsMenu />}
      <Box
        sx={{
          flexGrow: 1,
          mt: !isMobile ? "64px" : 0,
          mb: isMobile ? "64px" : 0,
          overflow: "scroll",
        }}
      >
        <Outlet />
      </Box>
      {isMobile && <SportsMenuMobile />}
    </div>
  );
};

export default HistoryLayout;
