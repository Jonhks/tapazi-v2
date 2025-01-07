import { Outlet } from "react-router-dom";
import classes from "./AuthLayout.module.css";

const AppLayout = () => {
  return (
    <div className={classes.containerApp}>
      <Outlet />
    </div>
  );
};

export default AppLayout;
