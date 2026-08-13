import SportsFootballIcon from "@mui/icons-material/SportsFootball";
import classes from "./NFLBallLoader.module.css";

const NFLBallLoader = () => {
  return (
    <div className={classes.loaderContainerModal}>
      <SportsFootballIcon
        className={classes.rotatingImage}
        sx={{ fontSize: 150, color: "#D4AF37" }}
      />
      <span className={classes.loader}></span>
    </div>
  );
};

export default NFLBallLoader;
