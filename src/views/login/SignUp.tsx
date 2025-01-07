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
  // InputLabel,
  // Select,
  // MenuItem,
} from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import HttpsIcon from "@mui/icons-material/Https";
// import FlagIcon from "@mui/icons-material/Flag";
import PersonIcon from "@mui/icons-material/Person";
import SecurityIcon from "@mui/icons-material/Security";
import classes from "./Login.module.css";
import { User } from "types";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import { useMutation } from "@tanstack/react-query";
import { getSignUp } from "@/api/AuthAPI";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();

  const initialValues: User = {
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
    // watch,
    // reset,
    formState: { errors },
  } = useForm<User>({ defaultValues: initialValues });

  const { mutate } = useMutation({
    mutationFn: getSignUp,
    onSuccess: (resp) => {
      console.log(resp);

      toast.success("Usuario registrado");
    },
    onError: (error) => toast.error(error.message),
  });

  const handleRegister = (formData: User) => {
    mutate(formData);
  };

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
                    // name="name"
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
                    {/* <InputLabel className={classes.selectClass}>
                      <FlagIcon color="inherit" />
                      State
                    </InputLabel> */}
                    {/* <Select
                      labelId="demo-simple-select-standard-label"
                      onChange={() => {
                        // handleChange(e);
                        // getUserData(e);
                      }}
                      // name="stateId"
                      // label="State"
                      // placeholder="State"
                      className={classes.selectClass}
                    >
                      <MenuItem
                        // key={state?.id}
                        // id={state?.id}
                        value={""}
                      >
                        {"state?.name"}
                      </MenuItem>
                      {states &&
                        states?.map((state) => {
                          return (
                            <MenuItem
                              key={state?.id}
                              id={state?.id}
                              value={state?.id}
                            >
                              {state?.name}
                            </MenuItem>
                          );
                        })}
                    </Select> */}
                  </FormControl>
                  <Input
                    required
                    type={"e-mail"}
                    sx={{ width: "80%", m: 2 }}
                    placeholder="Username"
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
