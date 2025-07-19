// import { useEffect } from "react";

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
import { useForm } from "react-hook-form";
import { UserLogin } from "@/types/index";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import { useMutation } from "@tanstack/react-query";
import { getLogin } from "@/api/AuthAPI";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const initialValues: UserLogin = {
    email: "",
    password: "",
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserLogin>({ defaultValues: initialValues });

  const { mutate } = useMutation({
    mutationFn: getLogin,
    onSuccess: (data) => {
      if (!data.success) {
        toast.error(data.error.description);
      } else {
        toast.success("User successfully logged in");
        localStorage.setItem("userTapaszi", JSON.stringify(data?.data));
        navigate(`/sports/${data.data.id}`, {
          replace: true,
        });
        localStorage.removeItem("datoProv");
      }
    },
    onError: (err) => toast.error(err.message),
  });

  const handleRegister = (formData: UserLogin) => {
    mutate(formData);
  };

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
                  <form
                    onSubmit={handleSubmit(handleRegister)}
                    style={{ textAlign: "center" }}
                    noValidate
                  >
                    <Input
                      required
                      type={"e-mail"}
                      sx={{
                        width: "80%",
                        m: 2,
                        border: "1px solid white",
                        padding: "5px",
                        borderRadius: "4px",
                        paddingLeft: "5px",
                      }}
                      id="input-with-icon-adornment-1"
                      placeholder="E-mail or Username"
                      color={"warning"}
                      inputProps={{
                        style: { textTransform: "lowercase", fontSize: "24px" },
                        autoCapitalize: "none",
                        color: "white",
                      }}
                      startAdornment={
                        <InputAdornment position="start">
                          <MailOutlineIcon color="inherit" />
                        </InputAdornment>
                      }
                      {...register("email", {
                        required: "The user is required",
                      })}
                    />
                    <Input
                      required
                      type={"password"}
                      sx={{
                        width: "80%",
                        m: 2,
                        border: "1px solid white",
                        padding: "5px",
                        borderRadius: "4px",
                        paddingLeft: "5px",
                      }}
                      id="input-with-icon-adornment"
                      placeholder="Password"
                      color={"warning"}
                      inputProps={{
                        style: { fontSize: "24px" },
                        autoCapitalize: "none",
                        color: "white",
                      }}
                      startAdornment={
                        <InputAdornment position="start">
                          <HttpsIcon color="inherit" />
                        </InputAdornment>
                      }
                      {...register("password", {
                        required: "The password is required",
                      })}
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
                      {!!Object.keys(errors).length && (
                        <ErrorMessage>{"All fields are required"}</ErrorMessage>
                      )}
                      <Button
                        type="submit"
                        variant="contained"
                        sx={{ m: 2 }}
                      >
                        Login
                      </Button>
                    </Grid>
                  </form>
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
