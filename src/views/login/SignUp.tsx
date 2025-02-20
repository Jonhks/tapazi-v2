import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid2";
import { useForm } from "react-hook-form";
import {
  Container,
  Slide,
  Box,
  Button,
  Input,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import HttpsIcon from "@mui/icons-material/Https";
import FlagIcon from "@mui/icons-material/Flag";
import PersonIcon from "@mui/icons-material/Person";
import SecurityIcon from "@mui/icons-material/Security";
import classes from "./Login.module.css";
import { State, User } from "types";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getSignUp, getStates } from "@/api/AuthAPI";
import { toast } from "react-toastify";
import Loader from "@/components/BallLoader/BallLoader";

const Login = () => {
  const navigate = useNavigate();
  const [select, setSelect] = useState("");

  const { data: states, isLoading } = useQuery({
    queryKey: ["states"],
    queryFn: getStates,
    retry: false,
  });

  const initialValues: User = {
    id: "",
    name: "",
    surname: "",
    email: "",
    username: "",
    password: "",
    stateId: "",
    code: "",
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<User>({ defaultValues: initialValues });

  const { mutate } = useMutation({
    mutationFn: getSignUp,
    onSuccess: (resp) => {
      if (resp === "User Registered Successfully") {
        toast.success(resp);
        navigate(`/login`, {
          replace: true,
        });
      } else {
        toast.error(resp || "An error has occurred");
        return;
      }
    },
    onError: () => toast.error("An error has occurred"),
  });

  const handleRegister = (formData: User) => {
    mutate(formData);
  };

  if (isLoading) return <Loader />;

  return (
    <Slide
      direction={"up"}
      in
      style={{ marginTop: "2%" }}
    >
      <Grid
        container
        spacing={2}
        className={classes.container}
      >
        <Container maxWidth="sm">
          <Box className={classes.box}>
            <div className={classes.head}>
              <p className={classes.title}>Sign up to</p>
              <p className={classes.titleTwo}>The Portfolio Pool</p>
              <p className={classes.subtitle}>Create your account</p>
            </div>
            <div className={classes.containerForm}>
              <Grid
                size={12}
                display={"flex"}
                className={classes.form}
              >
                <form
                  onSubmit={handleSubmit(handleRegister)}
                  noValidate
                >
                  <Input
                    required
                    type={"text"}
                    sx={{ width: "80%", m: 2 }}
                    color={"warning"}
                    placeholder="First Name"
                    startAdornment={
                      <InputAdornment position="start">
                        <PersonIcon color="inherit" />
                      </InputAdornment>
                    }
                    {...register("name", {
                      required: "The username is required",
                    })}
                  />
                  <Input
                    required
                    color={"warning"}
                    type={"text"}
                    sx={{ width: "80%", m: 2 }}
                    placeholder="Last Name"
                    startAdornment={
                      <InputAdornment position="start">
                        <PersonIcon color="inherit" />
                      </InputAdornment>
                    }
                    {...register("surname", {
                      required: "The surname is required",
                    })}
                  />
                  <Input
                    required
                    type={"e-mail"}
                    sx={{ width: "80%", m: 2 }}
                    color={"warning"}
                    placeholder="E-mail"
                    startAdornment={
                      <InputAdornment position="start">
                        <MailOutlineIcon color="inherit" />
                      </InputAdornment>
                    }
                    {...register("email", {
                      required: "The email is required",
                      pattern: {
                        value: /\S+@\S+\.\S+/,
                        message: "E-mail no válido",
                      },
                    })}
                  />
                  <FormControl
                    variant="standard"
                    sx={{ m: 1, minWidth: "80%" }}
                  >
                    <InputLabel className={classes.selectClass}>
                      <FlagIcon color="inherit" />
                      State
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      color={"warning"}
                      label="State"
                      className={classes.selectClass}
                      value={select}
                      {...register("stateId", {
                        required: "The stateId is required",
                      })}
                      onChange={(e) => setSelect(e.target.value)}
                    >
                      {states &&
                        states?.map((state: State) => {
                          return (
                            <MenuItem
                              key={state?.id.toString()}
                              value={state?.id}
                              style={{ fontSize: ".7rem" }}
                            >
                              {state?.name}
                            </MenuItem>
                          );
                        })}
                    </Select>
                  </FormControl>
                  <Input
                    required
                    type={"e-mail"}
                    sx={{ width: "80%", m: 2 }}
                    placeholder="Username"
                    color={"warning"}
                    startAdornment={
                      <InputAdornment position="start">
                        <PersonIcon color="inherit" />
                      </InputAdornment>
                    }
                    {...register("username", {
                      required: "The username is required",
                    })}
                  />
                  <Input
                    required
                    type={"password"}
                    sx={{ width: "80%", m: 2 }}
                    placeholder="Password"
                    color={"warning"}
                    startAdornment={
                      <InputAdornment position="start">
                        <HttpsIcon color="inherit" />
                      </InputAdornment>
                    }
                    {...register("password", {
                      required: "The passsword is required",
                    })}
                  />
                  <Input
                    required
                    type={"password"}
                    sx={{ width: "80%", m: 2 }}
                    placeholder="Code"
                    color={"warning"}
                    startAdornment={
                      <InputAdornment position="start">
                        <SecurityIcon color="inherit" />
                      </InputAdornment>
                    }
                    {...register("code", {
                      required: "The passsword is required",
                    })}
                  />
                  <Grid
                    // item
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
                      Sign Up
                    </Button>
                  </Grid>
                </form>
              </Grid>
            </div>
            <div className={classes.containerSignUp}>
              <p>Already have an account?</p>
              <div
                onClick={() => {
                  navigate("/login");
                }}
              >
                Login
              </div>
            </div>
          </Box>
        </Container>
      </Grid>
    </Slide>
  );
};

export default Login;
