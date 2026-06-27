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
        height: "auto",
        overflowY: "scroll",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {!isMobile && <SportsMenu />}
      <Box
        sx={{
          flexGrow: 1,
          width: "100%",
          pb: isMobile ? "72px" : 0,
        }}
      >
        <Outlet />
      </Box>
      {isMobile && <SportsMenuMobile />}
    </div>
  );
};

export default HistoryLayout;
