import SportsFootballIcon from "@mui/icons-material/SportsFootball";
import classes from "./NFLBallLoader.module.css";

const NFLBallLoader = () => {
  return (
    <div className={classes.loaderContainer}>
      <SportsFootballIcon
        className={classes.rotatingImage}
        sx={{ fontSize: 200, color: "#D4AF37" }}
      />
      <span className={classes.loader}></span>
    </div>
  );
};

export default NFLBallLoader;
