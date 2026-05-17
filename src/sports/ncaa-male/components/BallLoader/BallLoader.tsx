// import loader from "../../../assets/img/loader.gif";
import loader from "@/assets/img/loader.gif";
import classes from "./BallLoader.module.css";

const Loader = () => {
  return (
    <div className={classes.loaderContainer}>
      <img
        src={loader}
        alt="loader"
        width={200}
        height={200}
      />
      <span className={classes.loader}>Load&nbsp;ng</span>
    </div>
  );
};

export default Loader;
