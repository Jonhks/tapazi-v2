import { useState } from "react";

import Grid from "@mui/material/Grid2";
import {
  Container,
  Slide,
  Box,
  Button,
  Input,
  InputAdornment,
  CircularProgress,
  Typography,
} from "@mui/material";
import classes from "./Login.module.css";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import HttpsIcon from "@mui/icons-material/Https";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { UserLogin } from "@/types/index";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import { useMutation } from "@tanstack/react-query";
import {
  getLogin,
  getShowTermsOfUseWC,
  getActiveWCTournamentId,
  getTermsOfUseWC,
  postAcceptTermsOfUseWC,
} from "@/api/AuthAPI";
import type { TermsEntry } from "@/api/AuthAPI";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import TermsOfUseModal from "./TermsOfUseModal";
import ReportBugModal from "@/shared/components/ReportBugModal/ReportBugModal";
import { getEnvLabel } from "@/utils/envLabel";
import { resetAppState } from "@/utils/resetAppState";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [pendingUser, setPendingUser] = useState<Record<
    string,
    unknown
  > | null>(null);
  const [termsOpen, setTermsOpen] = useState(false);
  const [termsContent, setTermsContent] = useState<TermsEntry[]>([]);
  const [isCheckingTerms, setIsCheckingTerms] = useState(false);
  const [reportBugOpen, setReportBugOpen] = useState(false);
  // El botón de "reportar" solo aparece DESPUÉS de que ya intentaron
  // refrescar — se marca con un query param porque resetAppState() borra
  // localStorage/sessionStorage/cookies como parte de la limpieza, así que
  // ninguno de esos sobrevive para recordar "ya lo intentó".
  const [alreadyTriedRefresh, setAlreadyTriedRefresh] = useState(
    () => new URLSearchParams(window.location.search).get("triedRefresh") === "1",
  );

  // Una vez que SÍ mandan el reporte, se esconde de nuevo — no tendría
  // sentido dejarlo visible después de ya haberlo usado. Se limpia el query
  // param de la URL (sin recargar) para que quede consistente si refrescan
  // la página a mano más tarde.
  const handleBugReportSubmitted = () => {
    setAlreadyTriedRefresh(false);
    const url = new URL(window.location.href);
    url.searchParams.delete("triedRefresh");
    window.history.replaceState({}, "", url);
  };

  const handleResetAppState = async () => {
    const result = await Swal.fire({
      title: "Reset app data?",
      text: "This will log you out and clear all local data. Use this only if the app is stuck or not loading correctly.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#D4AF37",
      cancelButtonColor: "#666",
      color: "white",
      background: "#0a0a0a",
      confirmButtonText: "Yes, reset it",
    });
    if (result.isConfirmed) {
      await resetAppState(`${window.location.pathname}?triedRefresh=1`);
    }
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
  };

  const navigate = useNavigate();
  const initialValues: UserLogin = { email: "", password: "" };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserLogin>({ defaultValues: initialValues });

  const doNavigate = (userData: Record<string, unknown>) => {
    Object.keys(localStorage).filter(k => k.startsWith("userTapaszi")).forEach(k => localStorage.removeItem(k));
    localStorage.setItem("userTapaszi", JSON.stringify(userData));
    navigate(`/sports/${userData.id}`, { replace: true });
    localStorage.removeItem("datoProv");
  };

  const { mutate, isPending } = useMutation({
    mutationFn: getLogin,
    onSuccess: async (data) => {
      toast.success("User successfully logged in");
      setIsCheckingTerms(true);
      try {
        const { enable_terms_of_use, accepted_terms_of_use, tournament_id } =
          await getShowTermsOfUseWC(String(data.id));

        if (accepted_terms_of_use || !enable_terms_of_use) {
          doNavigate(data);
        } else {
          const tid = tournament_id ?? (await getActiveWCTournamentId());
          const terms = tid ? await getTermsOfUseWC(String(tid)) : [];
          setTermsContent(terms);
          setPendingUser(data);
          setTermsOpen(true);
        }
      } catch {
        doNavigate(data);
      } finally {
        setIsCheckingTerms(false);
      }
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const handleAcceptTerms = async () => {
    if (!pendingUser) return;
    await postAcceptTermsOfUseWC(String(pendingUser.id));
    setTermsOpen(false);
    doNavigate(pendingUser);
  };

  const handleCancelTerms = () => {
    setTermsOpen(false);
    setPendingUser(null);
    toast.warning(
      "You must accept the Terms & Conditions to access the platform.",
    );
  };

  const handleRegister = (formData: UserLogin) => {
    mutate(formData);
  };

  const isLoading = isPending || isCheckingTerms;

  return (
    <>
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
                          style: {
                            textTransform: "lowercase",
                            fontSize: "24px",
                          },
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
                        type={showPassword ? "text" : "password"}
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
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                              sx={{ color: "white" }}
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
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
                          <ErrorMessage>
                            {"All fields are required"}
                          </ErrorMessage>
                        )}
                        <Button
                          type="submit"
                          variant="contained"
                          disabled={isLoading}
                          sx={{ m: 2 }}
                        >
                          {isLoading ? (
                            <CircularProgress
                              size={26}
                              sx={{ color: "white" }}
                            />
                          ) : (
                            "Login"
                          )}
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
                <p className={classes.subtitle}>PortfolioPaul, LLC (2025)</p>
              </Box>
              <p className={classes.version}>
                Version {import.meta.env.VITE_APP_VERSION} ({import.meta.env.VITE_APP_COMMIT})
                {getEnvLabel() && ` — ${getEnvLabel()}`}
              </p>
              <Box
                sx={{
                  mt: 2,
                  mx: "auto",
                  maxWidth: 320,
                  textAlign: "center",
                  backgroundColor: "rgba(0,0,0,0.45)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: "8px",
                  p: 1.5,
                }}
              >
                <Typography sx={{ fontSize: 12, color: "#ddd", mb: 1 }}>
                  Having trouble logging in? Try refreshing the page using the
                  button below.
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={handleResetAppState}
                  sx={{
                    color: "#fff",
                    borderColor: "rgba(255,255,255,0.4)",
                    fontSize: 12,
                    "&:hover": { borderColor: "#fff" },
                  }}
                >
                  Refresh Page
                </Button>

                {/* Solo aparece si ya vino de un refresh (?triedRefresh=1) —
                    no lo mostramos como primera opción a propósito. */}
                {alreadyTriedRefresh && (
                  <Typography sx={{ fontSize: 12, color: "#ddd", mt: 1 }}>
                    Still not working?{" "}
                    <Typography
                      component="button"
                      onClick={() => setReportBugOpen(true)}
                      sx={{
                        fontSize: 12,
                        color: "rgb(148, 197, 249)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        p: 0,
                        textDecoration: "underline",
                      }}
                    >
                      Report the problem
                    </Typography>
                  </Typography>
                )}
              </Box>
            </Container>
          </Grid>
        </Slide>
      </Grid>

      <TermsOfUseModal
        open={termsOpen}
        terms={termsContent}
        onAccept={handleAcceptTerms}
        onCancel={handleCancelTerms}
      />

      <ReportBugModal
        open={reportBugOpen}
        onClose={() => setReportBugOpen(false)}
        onSubmitted={handleBugReportSubmitted}
        source="login"
      />
    </>
  );
};

export default Login;
