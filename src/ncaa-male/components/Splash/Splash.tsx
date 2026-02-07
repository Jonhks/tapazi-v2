import classes from "./Splash.module.css";
import { Slide } from "@mui/material";

const Splash = () => {
  if (window.location.pathname === "/") {
    // setTimeout(() => (window.location.pathname = "/login"), 3000);
  }
  return (
    <div className={classes.splashContainer}>
      <Slide
        direction={"down"}
        in
      >
        <div className={classes.container}>
          <div className={classes.shadow}></div>
          <div className={classes.shadowEpl}></div>
          <div className={classes.shadowWC}></div>
          <div className={classes.ballEpl}></div>
          <div className={classes.ball}></div>
          <div className={classes.ballWC}></div>
        </div>
      </Slide>
    </div>
  );
};

export default Splash;
