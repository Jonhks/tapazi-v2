// import loader from "../../../assets/img/loader.gif";
// import loader from "@/assets/img/loader.gif";
import loader from "@/assets/img/ball-epl.png";
import classes from "./EPLBallLoader.module.css";

const EPLBallLoader = () => {
  return (
    <div className={classes.loaderContainer}>
      <img
        src={loader}
        alt="loader"
        width={200}
        height={200}
        className={classes.rotatingImage}
      />
      <span className={classes.loader}></span>
    </div>
  );
};

export default EPLBallLoader;
