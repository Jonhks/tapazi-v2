// import React, { useState, useContext } from "react";
// import * as alertify from "alertifyjs";
// import "alertifyjs/build/css/alertify.css";
import { useNavigate } from "react-router-dom";
// import UserContext from "../../../context/UserContext";
import Grid from "@mui/material/Grid2";

import {
  Container,
  // Grid,
  Slide,
  Box,
  Button,
  Input,
  InputAdornment,
} from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import classes from "./Login.module.css";

const Forgot = () => {
  const navigate = useNavigate();
  // const [userData, setUserData] = useState({});
  // const [error, setError] = useState(false);
  // const { postForgot } = useContext(UserContext);

  // const getUserData = (e) => {
  //   setUserData({
  //     ...userData,
  //     [e?.target?.name]: e?.target.value,
  //   });
  // };

  // const validateForm = () => {
  //   setError(true);
  //   const { user } = userData;
  //   if (user && user?.length >= 2) {
  //     setError(false);
  //     postForgot(userData);
  //   } else {
  //     setError(true);
  //     alertify.error("All fields are mandatory!!");
  //     setTimeout(() => setError(false), 2000);
  //   }
  // };

  return (
    <Grid
      container
      spacing={2}
      className={classes.background}
    >
      <Slide
        direction={"up"}
        in
      >
        <Grid
          container
          spacing={2}
          className={classes.container}
        >
          <Container maxWidth="sm">
            <Box className={classes.box}>
              <div className={classes.head}>
                <p className={classes.title}>Forgot</p>
                <p className={classes.titleTwo}>Your password ?</p>
                <p
                  className={classes.subtitle}
                  style={{ textAlign: "center" }}
                >
                  Enter your credentials and we will send you a link with your
                  new password
                </p>
              </div>
              <div className={classes.containerForm}>
                <Grid
                  size={12}
                  display={"flex"}
                  className={classes.form}
                >
                  <Input
                    required
                    type={"e-mail"}
                    sx={{ width: "80%", m: 2 }}
                    id="input-with-icon-adornment"
                    name="user"
                    placeholder="E-mail or Username"
                    startAdornment={
                      <InputAdornment position="start">
                        <MailOutlineIcon color="inherit" />
                      </InputAdornment>
                    }
                    // onChange={(e) => getUserData(e)}
                  />
                  <Grid
                    size={12}
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    flexDirection={"column"}
                    className={classes.containerBtnLogin}
                  >
                    <Button
                      variant="contained"
                      // onClick={() => validateForm()}
                      sx={{ m: 2 }}
                    >
                      Send
                    </Button>
                    {/* {error && (
                      <div>
                        <p className={classes.error}>
                          All fields are mandatory
                        </p>
                      </div>
                    )} */}
                  </Grid>
                  <div
                    className={classes.containerCheckBox}
                    style={{ textAlign: "center" }}
                  >
                    <span onClick={() => navigate("/login")}>
                      {"<"} Back to Login
                    </span>
                  </div>
                </Grid>
              </div>
            </Box>
          </Container>
        </Grid>
      </Slide>
    </Grid>
  );
};

export default Forgot;
