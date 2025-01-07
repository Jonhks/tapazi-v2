import Grid from "@mui/material/Grid2";
import {
  Container,
  Slide,
  Box,
  Button,
  Input,
  InputAdornment,
} from "@mui/material";
import classes from "./Login.module.css";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import HttpsIcon from "@mui/icons-material/Https";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
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
                <p className={classes.title}>Welcome to</p>
                <p className={classes.titleTwo}>The Portfolio Pool</p>
                <p className={classes.subtitle}>
                  Enter your credentials to login
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
                  <Input
                    required
                    type={"password"}
                    sx={{ width: "80%", m: 2 }}
                    id="input-with-icon-adornment"
                    name="password"
                    placeholder="Password"
                    startAdornment={
                      <InputAdornment position="start">
                        <HttpsIcon color="inherit" />
                      </InputAdornment>
                    }
                    // onChange={(e) => getUserData(e)}
                  />
                  <div className={classes.containerCheckBox}>
                    <span onClick={() => navigate("/forgot")}>
                      Forgot password?
                    </span>
                  </div>
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
                      Login
                    </Button>
                    {/* {error && (
                      <div>
                        <p className={classes.error}>
                          All fields are mandatory
                        </p>
                      </div>
                    )} */}
                  </Grid>
                </Grid>
              </div>
              <div className={classes.containerSignUp}>
                <p>Don't have an account ?</p>
                <div
                  onClick={() => {
                    navigate("/signup");
                  }}
                >
                  Sign up
                </div>
              </div>
            </Box>
          </Container>
        </Grid>
      </Slide>
    </Grid>
  );
};

export default Login;
