// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-disable no-extra-boolean-cast */
/* eslint-disable no-unsafe-optional-chaining */

import { useCallback, useEffect } from "react";
import {
  Box,
  Button,
  Divider,
  FormControl,
  InputLabel,
  ListItemIcon,
  ListItemText,
  // makeStyles,
  MenuItem,
  Select,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import classes from "./MyPortfolioEPL.module.css";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import Loader from "../../components/EPLBallLoader/EPLBallLoader";
import { toast } from "react-toastify";
import { usePortfolio } from "../../../context/PortfolioContext";
import Swal from "sweetalert2";
import {
  postEditPortfolio,
  postNewPortfolioEpl,
} from "@/api/epl/PortfoliosEplAPI";

const MyPortfolioEPL = () => {
  const params = useParams();
  const userId = params.userId!;
  const queryClient = useQueryClient();

  const {
    setUserId,
    setValidTournament,
    AllPortfolios,
    teamsComplete,
    numberInputs,
    teamsBloqued,
    isLoadingData,
    selectedTeams,
    setSelectedTeams,
    teamsDynamics,
    weekParameter,
    validTournament,
  } = usePortfolio();

  useEffect(() => {
    setUserId(userId);
  }, [userId, setUserId]);

  const { mutate: postNewPortfolioMutate } = useMutation({
    mutationFn: postNewPortfolioEpl,
    onSuccess: () => {
      Swal.close(); // Cierra el loader
      Swal.fire({
        title: "Saved!",
        text: "Your portfolio was created successfully.",
        icon: "success",
        background: "#421065",
        confirmButtonColor: "#3ED076",
        color: "white",
      });
      queryClient.refetchQueries(); // Refresca todas
    },
    onError: () => {
      Swal.close(); // Cierra el loader
      Swal.fire({
        title: "Error!",
        text: "There was a problem creating the portfolio.",
        icon: "error",
        background: "#421065",
        confirmButtonColor: "#c7630b",
        color: "white",
        didOpen: () => {
          Swal.showLoading();
        },
      });
      console.log("There was a problem creating the portfolio");
    },
  });

  const { mutate: postEditPortfolioMutate } = useMutation({
    mutationFn: postEditPortfolio,
    onLoading: () => {
      Swal.fire({
        title: "Updating...",
        text: "Please wait while we update your portfolio.",
        allowOutsideClick: false,
        background: "#200930",
        color: "white",
        didOpen: () => {
          Swal.showLoading();
        },
      });
    },
    onSuccess: () => {
      Swal.close();
      Swal.fire({
        title: "Updated!",
        text: "Your portfolio was updated successfully.",
        icon: "success",
        background: "#421065",
        confirmButtonColor: "#3ED076",
        color: "white",
      });
      queryClient.refetchQueries(); // Refresca todas
    },
    onError: () => {
      Swal.close();
      Swal.fire({
        title: "Error!",
        text: "There was a problem updating the portfolio.",
        icon: "error",
        background: "#421065",
        confirmButtonColor: "#c7630b",
        color: "white",
      });
    },
  });

  const areAllInputsValid = () => {
    return (
      selectedTeams?.length === numberInputs && // Verifica que el número de equipos coincida con el número de inputs
      selectedTeams.every((team) => team && team.name) // Verifica que cada equipo tenga un nombre válido
    );
  };

  const handleChangeSelect = (value: string, index: number) => {
    const newSelectedTeams = [...selectedTeams];
    newSelectedTeams[index] = teamsComplete.filter(
      (team) => team.name === value
    )[0];
    setSelectedTeams(newSelectedTeams);
  };

  const addportFolioAlert = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to save changes",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3ED076",
      cancelButtonColor: "#c7630b",
      color: "white",
      background: "#200930",
      confirmButtonText: "Yes, I want to save changes!",
    });
    if (result.isConfirmed) {
      await addportFolio();
    }
  };

  const showErrorEnCero = async () => {
    const result = await Swal.fire({
      title: "Error!",
      text: "There are 0 seeds, please wait a few minutes",
      icon: "error",
      showCancelButton: false,
      confirmButtonColor: "#3ED076",
      color: "white",
      background: "#200930",
      confirmButtonText: "Ok",
    });
    if (result.isConfirmed) {
      setTimeout(() => {
        window.location.reload();
      }, 100);
      Swal.fire({
        title: "Changes discarded!",
        text: "You have changes discarded successfully.",
        icon: "success",
        background: "#421065", // Cambia el color de fondo
        confirmButtonColor: "#3ED076",
        color: "white", // Cambia el color del texto
      });
    }
  };

  const cancelAlert = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to discard changes",
      icon: "error",
      showCancelButton: true,
      confirmButtonColor: "#3ED076",
      cancelButtonColor: "#c7630b",
      color: "white",
      background: "#200930", //
      confirmButtonText: "Yes, I want to discard changes!",
    }).then((result) => {
      if (result.isConfirmed) {
        setTimeout(() => {
          window.location.reload();
        }, 100);
        Swal.fire({
          title: "Changes discarded!",
          text: "You have changes discarded successfully.",
          icon: "success",
          background: "#421065", // Cambia el color de fondo
          confirmButtonColor: "#3ED076",
          color: "white", // Cambia el color del texto
        });
      }
    });
  };

  const addportFolio = useCallback(() => {
    const allFilled = areAllInputsValid();
    // // ? Verifica que los portfolios vayan llenos
    if (!allFilled) {
      toast.error("You must select all teams!");
      setValidTournament(true);

      setTimeout(() => {
        setValidTournament(false);
      }, 2500);
      return;
    }

    const newPortfolio = {
      tournament_id: "3",
      participant_id: userId,
      championship_points: 0,
      teams: selectedTeams.map((team) => {
        return {
          id: team.id,
          seed: getSeed(team),
          streak_multiplier: getMultiplier(team),
        };
      }),
    };

    const estaEn0 = newPortfolio.teams?.some((port) => {
      return port.seed === 0 || port.streak_multiplier === "0";
    });

    if (estaEn0) {
      showErrorEnCero();
      return;
    }
    // console.log(AllPortfolios);
    console.log(AllPortfolios?.length === 0 && true);
    // return;

    if (AllPortfolios?.length === 0) {
      console.log("lo esta creando");
      // Crea un nuevo portfolio
      postNewPortfolioMutate({
        port: newPortfolio,
        userId: userId,
        portId: AllPortfolios[0]?.id,
      });
      return;
    }
    if (AllPortfolios?.length > 0) {
      // Actualiza el primer portfolio
      console.log("lo esta editando");
      postEditPortfolioMutate({
        port: newPortfolio.teams,
        portId: AllPortfolios[0]?.id,
      });
      return;
    }
  }, [selectedTeams, userId, AllPortfolios]);

  const checkNotValidTeam = (team: Team) =>
    teamsBloqued.some((bloquedTeam) => bloquedTeam.id === team.id);

  const checkTeamSelected = (team: Team) =>
    !!selectedTeams?.some((selectedTeam) => selectedTeam.id === team.id);

  const getSeed = (team: Team) => {
    let seed = "";
    const currentTeamDynamics = teamsDynamics?.filter(
      (t) => t?.id === team?.id
    )[0];
    const currentTeamPortfolios = AllPortfolios[0]?.teams?.filter(
      (t) => t?.id === team?.id
    )[0];
    // console.log(weekParameter, validTournament?.[0]?.current_round);

    // ? Primer caso, usuario completamente nuevo semanas iguales  Sin portafolios ni equipos
    if (
      !AllPortfolios?.length &&
      !AllPortfolios[0]?.teams?.length &&
      team &&
      weekParameter === validTournament?.[0]?.current_round
    ) {
      // console.log(
      //   "No hay portafolios y Ni portfolio.teams, no hay team y las semanas son iguales "
      // );
      seed = team?.seed;
      return seed;
    }

    // ? Semanas iguales si hay portafolios y portfolio.teams
    if (
      AllPortfolios &&
      AllPortfolios[0]?.teams?.length > 0 &&
      weekParameter === validTournament?.[0]?.current_round
    ) {
      // console.log("Hay portafolios y portfolio.teams son semanas iguales");
      if (team) {
        seed = currentTeamPortfolios?.current_seed
          ? currentTeamPortfolios?.current_seed
          : team?.seed;
        return seed;
      }
    }

    // ? Semanas diferentes no hay portafolios ni portfolio.teams (nuevo escenario)!
    if (
      !AllPortfolios.length &&
      !AllPortfolios[0]?.teams?.length > 0 &&
      team &&
      weekParameter !== validTournament?.[0]?.current_round
    ) {
      seed = team?.seed;
      return seed;
    }

    // ? Semanas diferentes si hay portafolios y no exista portfolio.teams => Dynamics
    if (AllPortfolios && !AllPortfolios[0]?.teams?.length > 0) {
      if (team && weekParameter !== validTournament?.[0]?.current_round) {
        seed = currentTeamDynamics?.current_seed
          ? currentTeamDynamics?.current_seed
          : team?.seed;
      }
    }

    // ? Semanas diferentes si hay portafolios y portfolio.teams
    if (
      AllPortfolios.length &&
      AllPortfolios[0]?.teams?.length > 0 &&
      weekParameter !== validTournament?.[0]?.current_round
    ) {
      // console.log("Hay portafolios y portfolio.teams son semanas diferentes");
      if (team) {
        seed = currentTeamPortfolios?.current_seed
          ? currentTeamPortfolios?.current_seed
          : currentTeamDynamics?.current_seed;
        return seed;
      }
    }
    return seed;
  };

  // ? multiplier
  const getMultiplier = (team: Team) => {
    // console.log(team);

    let multiplier = "";
    const currentTeamDynamics = teamsDynamics?.filter(
      (t) => t?.id === team?.id
    )[0];
    const currentTeamPortfolios = AllPortfolios[0]?.teams?.filter(
      (t) => t?.id === team?.id
    )[0];

    // console.log(currentTeamPortfolios);

    // ? las semanas son iguales
    if (team && weekParameter === validTournament?.[0]?.current_round) {
      multiplier = "1";
      return multiplier;
    }

    // ? No hay portafolios no equipos y la semanas son diferentes
    if (
      !AllPortfolios.length &&
      !AllPortfolios[0]?.teams?.length > 0 &&
      team &&
      weekParameter !== validTournament?.[0]?.current_round
    ) {
      multiplier = "1";
      return multiplier;
    }

    // ? Si hay portafolios si equipos y la semanas son diferentes tiene datos del team
    if (
      AllPortfolios.length &&
      AllPortfolios[0]?.teams?.length > 0 &&
      team &&
      weekParameter !== validTournament?.[0]?.current_round
    ) {
      console.log("");

      multiplier = currentTeamPortfolios?.current_streak
        ? currentTeamPortfolios?.current_streak
        : currentTeamDynamics?.current_streak;
      return multiplier;
    }

    // ? Si hay portafolios no hay equipos y la semanas son diferentes
    if (
      AllPortfolios &&
      !AllPortfolios[0]?.teams?.length > 0 &&
      team &&
      weekParameter !== validTournament?.[0]?.current_round
    ) {
      multiplier = currentTeamPortfolios?.current_streak
        ? currentTeamPortfolios?.current_streak
        : currentTeamDynamics?.current_streak;
      return multiplier;
    }

    // ? Semanas diferentes si hay portafolios y portfolio.teams no hay datos del team
    if (
      AllPortfolios.length &&
      AllPortfolios[0]?.teams?.length > 0 &&
      weekParameter !== validTournament?.[0]?.current_round
    ) {
      // console.log("Hay portafolios y portfolio.teams son semanas diferentes");
      if (team) {
        multiplier = currentTeamPortfolios?.current_streak
          ? currentTeamPortfolios?.current_streak
          : currentTeamDynamics?.current_streak;
        return multiplier;
      }
    }
    return multiplier;
  };

  const renderTeams = () => {
    return selectedTeams?.map((team, idx: number) => {
      return (
        <div
          key={idx}
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginBottom: "20px",
            backgroundColor: idx % 2 === 0 ? "#380f65" : "#200930",
          }}
        >
          <div
            style={{
              backgroundColor: idx % 2 === 0 ? "#380f65" : "#200930",
              width: "80px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "#05fa87",
              fontWeight: "bold",
            }}
          >
            {getSeed(team)}
          </div>
          <FormControl
            fullWidth
            sx={{
              backgroundColor: idx % 2 === 0 ? "#380f65" : "#200930",
              "& .MuiInputLabel-root": {
                color: "white",
                fontWeight: "bold",
                fontSize: "18px",
              },
            }}
            onClick={(e) => {
              // Handle click event
              e.stopPropagation();
              e.preventDefault();
              if (team.disabled) {
                toast.error("This team is not available");
              }
            }}
          >
            <InputLabel
              id={`select-label-${idx}`}
              shrink={selectedTeams[idx] !== ""}
              sx={{
                color: "white",
                fontWeight: "bold",
                fontSize: "18px",
                transition: "opacity 0.2s",
                // opacity: selectedTeams[idx] ? 0.5 : 1,
              }}
            >
              Team
            </InputLabel>
            <Select
              labelId={`select-label-${idx}`}
              value={team.name || ""}
              label="Team"
              readOnly={checkNotValidTeam(team)}
              disabled={checkNotValidTeam(team)}
              onChange={(e) => {
                handleChangeSelect(e.target.value, idx);
              }}
              sx={{
                backgroundColor: checkNotValidTeam(team) && "#72598cff",
                opacity: checkNotValidTeam(team) && 0.7,
                "& .MuiSelect-icon": {
                  color: checkNotValidTeam(team) ? "gray" : "white",
                },
              }}
            >
              {teamsComplete.map((opt) => (
                <MenuItem
                  key={opt.id}
                  value={opt.name || ""}
                  disabled={checkNotValidTeam(opt) || checkTeamSelected(opt)}
                  style={{
                    color: "white",
                  }}
                >
                  <div
                    className={classes.selectMio}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "18px",
                      color: "white",
                    }}
                  >
                    <ListItemIcon style={{ color: "white" }}>
                      <img
                        src={opt.crest_url}
                        alt={opt.name}
                        style={{
                          width: 28,
                          height: 28,
                          objectFit: "contain",
                          marginRight: 8,
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      style={{
                        color: opt.disabled ? "#595757ff" : "white",
                        textAlign: "left",
                        fontWeight: "bold",
                      }}
                    >
                      {opt.name}
                    </ListItemText>
                  </div>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <div
            style={{
              backgroundColor: idx % 2 === 0 ? "#380f65" : "#200930",
              width: "80px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "#05fa87",
              fontWeight: "bold",
            }}
          >
            {getMultiplier(team)}
          </div>
        </div>
      );
    });
  };

  if (isLoadingData) {
    return <Loader />;
  }

  return (
    <Grid
      size={12}
      sx={{
        minHeight: "650px",
        height: "calc(100vh - 56px)",
        overflow: "scroll",
      }}
    >
      <Grid
        container
        spacing={2}
        justifyContent={"center"}
        alignContent={"center"}
      >
        <Grid size={{ xs: 12, sm: 10, lg: 8 }}>
          <Box
            component="section"
            className={classes.boxPortfolio}
            m={3}
          >
            <div className={classes.headerPortfolio}>
              <div style={{ color: "white" }}>
                <EmojiEventsOutlinedIcon
                  color="inherit"
                  style={{ fontSize: "2.6rem" }}
                />

                <h2 style={{ color: "#05fa87", fontSize: "40px" }}>
                  My Portfolio
                  <p style={{ fontSize: "16px" }}>
                    {AllPortfolios && AllPortfolios[0]?.name}
                  </p>
                </h2>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <h2
                style={{
                  color: "white",
                  fontSize: "24px",
                  textAlign: "center",
                }}
              >
                Tournament
              </h2>
              <Divider
                style={{
                  backgroundColor: "white",
                  width: "60%",
                }}
              />
            </div>

            <Grid
              size={12}
              style={{ marginTop: "30px" }}
            >
              <div style={{ width: "80%", margin: "0 auto" }}>
                <Grid
                  size={{ xs: 12 }}
                  style={{
                    marginTop: "30px",
                    margin: "10px 0",
                    padding: "5px 10px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: "#200930",
                  }}
                >
                  <Grid size={12}>Seed</Grid>
                  <Grid
                    size={12}
                    style={{ textAlign: "right", fontWeight: "bold" }}
                  >
                    Multiplier
                  </Grid>
                </Grid>
                {renderTeams()}
              </div>
            </Grid>
            <Grid
              mt={3}
              mb={2}
            >
              {/* {validTournament && (
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <ErrorMessage>You must select all teams</ErrorMessage>
                </div>
              )} */}

              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: "#05fa87",
                    backgroundColor: `${
                      areAllInputsValid() ? "#05fa87" : "#0c5031ff"
                    }`,
                    width: "30%",
                    color: "black",
                    fontWeight: "bold",
                    fontSize: "14px",
                    margin: 10,
                    "&:disabled": { backgroundColor: "grey" },
                  }}
                  onClick={() =>
                    // areAllInputsValid() &&
                    addportFolioAlert()
                  }
                >
                  {AllPortfolios && AllPortfolios[0]?.teams?.length > 0
                    ? "EDIT"
                    : "SUBMIT"}
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  style={{
                    width: "30%",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "14px",
                    margin: 10,
                  }}
                  onClick={() => cancelAlert()}
                  // onClick={() => removeportfolioFunction()}
                >
                  Cancel
                </Button>
              </div>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default MyPortfolioEPL;
