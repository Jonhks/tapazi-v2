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
  IconButton,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import HttpsIcon from "@mui/icons-material/Https";
import FlagIcon from "@mui/icons-material/Flag";
import PersonIcon from "@mui/icons-material/Person";
import SecurityIcon from "@mui/icons-material/Security";
import classes from "./Login.module.css";
import { State } from "types";

// Define Country type if not imported
type Country = {
  id: string | number;
  name: string;
};

type User = {
  id: string;
  name: string;
  surname: string;
  email: string;
  username: string;
  password: string;
  state_id: string;
  country_id: string;
  code: string;
};
import ErrorMessage from "@/shared/components/ErrorMessage/ErrorMessage";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getSignUp, getStates, getCountries } from "@/api/AuthAPI";
import { toast } from "react-toastify";
import Loader from "../../components/BallLoader/BallLoader";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  const [showCode, setShowCode] = useState(false);
  const handleClickShowCode = () => setShowCode(!showCode);
  const handleMouseDownCode = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const navigate = useNavigate();
  // const [countrySelect, setCountrySelect] = useState("");
  // const [stateSelect, setStateSelect] = useState("");

  const initialValues: User = {
    id: "",
    name: "",
    surname: "",
    email: "",
    username: "",
    password: "",
    state_id: "",
    country_id: "",
    code: "",
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<User>({ defaultValues: initialValues });

  const { data: states, isLoading } = useQuery({
    queryKey: ["states", watch("country_id")],
    queryFn: () => getStates(watch("country_id")),
    enabled: !!watch("country_id"),
    retry: false,
  });
  const { data: countries, isLoading: isLoadingCountries } = useQuery({
    queryKey: ["countries"],
    queryFn: getCountries,
    retry: false,
  });

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

  if (isLoading && isLoadingCountries) return <Loader />;

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
              <p className={classes.title}>SIGN UP TO THE</p>
              <p className={classes.titleTwo}>Portfolio Pool</p>
              <p className={classes.subtitle}>CREATE YOUR ACCOUNT</p>
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
                  style={{ textAlign: "center" }}
                >
                  <Input
                    required
                    type={"text"}
                    sx={{
                      width: "80%",
                      m: 2,
                      border: "1px solid white",
                      padding: "5px",
                      borderRadius: "4px",
                      paddingLeft: "5px",
                    }}
                    color={"warning"}
                    placeholder="FIRST NAME"
                    inputProps={{
                      style: { textTransform: "uppercase" },
                      autoCapitalize: "characters",
                    }}
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
                    sx={{
                      width: "80%",
                      m: 2,
                      border: "1px solid white",
                      padding: "5px",
                      borderRadius: "4px",
                      paddingLeft: "5px",
                    }}
                    placeholder="LAST NAME"
                    inputProps={{
                      style: { textTransform: "uppercase" },
                      autoCapitalize: "characters",
                    }}
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
                    sx={{
                      width: "80%",
                      m: 2,
                      border: "1px solid white",
                      padding: "5px",
                      borderRadius: "4px",
                      paddingLeft: "5px",
                    }}
                    color={"warning"}
                    placeholder="E-mail"
                    inputProps={{
                      style: { textTransform: "lowercase" },
                      autoCapitalize: "none",
                    }}
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
                    sx={{
                      m: 1,
                      minWidth: "78%",
                      border: "1px solid white",
                      padding: "0px",
                      borderRadius: "4px",
                      paddingLeft: "5px",
                    }}
                  >
                    <InputLabel
                      className={classes.selectClass}
                      style={{ top: "-7px", opacity: "0.6" }}
                    >
                      <FlagIcon
                        color="inherit"
                        style={{
                          paddingRight: "7px",
                          paddingLeft: "2px",
                          opacity: "1",
                        }}
                      />{" "}
                      country
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard-country"
                      color={"warning"}
                      label="country"
                      style={{ marginTop: "14px" }}
                      className={classes.selectClass}
                      defaultValue={""}
                      {...register("country_id", {
                        required: "The country_id is required",
                      })}
                      MenuProps={{
                        slotProps: {
                          paper: {
                            className: "enable-vertical-scroll",
                            sx: {
                              // maxHeight: 250,
                              backgroundColor: "rgba(0, 0, 0, 0.9)",
                              color: "#fff",
                            },
                          },
                        },
                      }}
                    >
                      {countries &&
                        countries?.map((country: Country) => {
                          return (
                            <MenuItem
                              key={country?.id.toString()}
                              value={country?.id}
                              style={{ fontSize: ".7rem" }}
                            >
                              {country?.name}
                            </MenuItem>
                          );
                        })}
                    </Select>
                  </FormControl>
                  <FormControl
                    variant="standard"
                    sx={{
                      m: 1,
                      minWidth: "78%",
                      border: "1px solid white",
                      padding: "0px",
                      borderRadius: "4px",
                      paddingLeft: "5px",
                    }}
                  >
                    <InputLabel
                      className={classes.selectClass}
                      style={{ top: "-7px", opacity: "0.6" }}
                    >
                      <FlagIcon
                        color="inherit"
                        style={{
                          paddingRight: "7px",
                          paddingLeft: "2px",
                          opacity: "1",
                        }}
                      />{" "}
                      state
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      color={"warning"}
                      label="State"
                      style={{ marginTop: "14px" }}
                      className={classes.selectClass}
                      defaultValue={""}
                      {...register("state_id", {
                        required: "The state_id is required",
                      })}
                      MenuProps={{
                        slotProps: {
                          paper: {
                            className: "enable-vertical-scroll",
                            sx: {
                              // maxHeight: 250,
                              backgroundColor: "rgba(0, 0, 0, 0.9)",
                              color: "#fff",
                            },
                          },
                        },
                      }}
                      // onChange={(e) => setStateSelect(e.target.value)}
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
                    sx={{
                      width: "80%",
                      m: 2,
                      border: "1px solid white",
                      padding: "5px",
                      borderRadius: "4px",
                      paddingLeft: "5px",
                    }}
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
                    inputProps={{
                      style: { textTransform: "lowercase" },
                      autoCapitalize: "none",
                    }}
                  />
                  <Input
                    required
                    type={showPassword ? "text" : "password"}
                    sx={{
                      width: "80%",
                      m: 2,
                      border: "1px solid white",
                      padding: "5px",
                      borderRadius: "4px",
                      paddingLeft: "5px",
                    }}
                    placeholder="Password"
                    color={"warning"}
                    startAdornment={
                      <InputAdornment position="start">
                        <HttpsIcon color="inherit" />
                      </InputAdornment>
                    }
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          sx={{ color: "white" }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    {...register("password", {
                      required: "The passsword is required",
                    })}
                  />
                  <Input
                    required
                    type={showCode ? "text" : "password"}
                    sx={{
                      width: "80%",
                      m: 2,
                      border: "1px solid white",
                      padding: "5px",
                      borderRadius: "4px",
                      paddingLeft: "5px",
                    }}
                    placeholder="Code"
                    color={"warning"}
                    startAdornment={
                      <InputAdornment position="start">
                        <SecurityIcon color="inherit" />
                      </InputAdornment>
                    }
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle code visibility"
                          onClick={handleClickShowCode}
                          onMouseDown={handleMouseDownCode}
                          edge="end"
                          sx={{ color: "white" }}
                        >
                          {showCode ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
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
            <p className={classes.subtitle}>PortfolioPaul, LLC (2025)</p>
          </Box>
          <p className={classes.version}>
            Version {import.meta.env.VITE_APP_VERSION}
          </p>
        </Container>
      </Grid>
    </Slide>
  );
};

export default Login;
