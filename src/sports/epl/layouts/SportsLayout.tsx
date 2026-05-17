import { Outlet } from "react-router-dom";
import classes from "./AuthLayout.module.css";

const HistoryLayout = ({ ImgSports }: { ImgSports: string }) => {
  return (
    <div
      className={classes.containerStats}
      style={{ backgroundImage: `url(${ImgSports})` }}
    >
      <Outlet />
    </div>
  );
};

export default HistoryLayout;
