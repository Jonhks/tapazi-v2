import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid2";

import {
  Container,
  Slide,
  Box,
  Button,
  Input,
  InputAdornment,
} from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import classes from "./Login.module.css";
import { UserForgot } from "@/types/index";
import { useForm } from "react-hook-form";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import { useMutation } from "@tanstack/react-query";
import { postForgot } from "@/api/AuthAPI";
import { toast } from "react-toastify";

const Forgot = () => {
  const navigate = useNavigate();

  const initialValues: UserForgot = {
    email: "",
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserForgot>({ defaultValues: initialValues });

  const { mutate } = useMutation({
    mutationFn: postForgot,
    onSuccess: () => {
      toast.success("your new password has been sent");
    },
    onError: () => toast.error("An error has occurred"),
  });

  const handleRegister = (formData: UserForgot) => {
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
                <form
                  onSubmit={handleSubmit(handleRegister)}
                  noValidate
                >
                  <Grid
                    size={12}
                    display={"flex"}
                    className={classes.form}
                  >
                    <Input
                      required
                      type={"e-mail"}
                      sx={{ width: "80%", m: 2 }}
                      color={"warning"}
                      id="input-with-icon-adornment"
                      placeholder="E-mail or Username"
                      startAdornment={
                        <InputAdornment position="start">
                          <MailOutlineIcon color="inherit" />
                        </InputAdornment>
                      }
                      {...register("email", {
                        required: "The email is required",
                      })}
                      inputProps={{
                        style: { textTransform: "lowercase" },
                        autoCapitalize: "none",
                      }}
                    />
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
                        Send
                      </Button>
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
                </form>
              </div>
            </Box>
          </Container>
        </Grid>
      </Slide>
    </Grid>
  );
};

export default Forgot;
