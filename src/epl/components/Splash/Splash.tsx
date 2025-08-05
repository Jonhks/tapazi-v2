import classes from "./Splash.module.css";
import { Slide } from "@mui/material";
import { useParams } from "react-router-dom";

const Splash = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const encodedData = urlParams.get("data");
  const params = useParams();
  const userId = params.userId || "";
  console.log("userId", userId);

  if (window.location.pathname === `/${userId}`) {
    if (encodedData) {
      const user = JSON.parse(atob(encodedData));
      setTimeout(() => {
        if (user && +user.id === +userId) {
          localStorage.setItem("userTapaszi", JSON.stringify(user));
          console.log("user", user);
          window.location.pathname = `/home/${user.id}`;
        } else {
          window.location.href = "https://tapazi-v2.vercel.app/login";
        }
      }, 3000);
    }
  }

  return (
    <div className={classes.splashContainer}>
      <Slide
        direction={"down"}
        in
      >
        <div className={classes.container}>
          <div className={classes.shadow}></div>
          <div className={classes.ball}></div>
        </div>
      </Slide>
    </div>
  );
};

export default Splash;
