import { Outlet } from "react-router-dom";
import classes from "./AuthLayout.module.css";

const AuthLayout = () => {
  return (
    <div className={classes.container}>
      <Outlet />
    </div>
  );
};

export default AuthLayout;
