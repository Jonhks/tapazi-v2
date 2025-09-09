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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation, useParams } from "react-router-dom";

import {
  getNumberInputs,
  getPortfolios,
  getTeams,
  getTeamsNotAvailable,
  getTournamentsId,
  postEditPortfolio,
  postNewPortfolio,
} from "@/api/epl/PortfoliosEplAPI";
import Loader from "../../components/EPLBallLoader/EPLBallLoader";
import { toast } from "react-toastify";
import { usePortfolio } from "../../../context/PortfolioContext";
import Swal from "sweetalert2";

const MyPortfolioEPL = () => {
  const params = useParams();
  const userId = params.userId!;
  const location = useLocation();
  const queryClient = useQueryClient();

  const {
    teamsComplete,
    setTeamsComplete,
    numberInputs,
    setNumberInputs,
    selectedTeams,
    setSelectedTeams,
  } = usePortfolio();

  const { data: tournamentsId, isLoading: isLoadingTournamentId } = useQuery({
    queryKey: ["tournamentsId", userId],
    queryFn: () => getTournamentsId(),
    refetchOnWindowFocus: "always",
  });

  const { data: portfolios, isLoading: isLoadingPortfolios } = useQuery({
    queryKey: ["portfolios", userId, tournamentsId],
    queryFn: () =>
      getPortfolios(
        userId,
        tournamentsId ? tournamentsId[0].id.toString() : "0"
      ),
    refetchOnWindowFocus: "always",
  });

  const { data: teamsEPL, isLoading } = useQuery({
    queryKey: ["teamsEpl", userId, location.pathname],
    queryFn: () => getTeams("2"),
    refetchOnWindowFocus: "always",
  });

  const { data: numberInputsRecived, isLoading: isLoadingNumberInputs } =
    useQuery({
      queryKey: ["numberInputsRecived", userId, location.pathname],
      queryFn: () => getNumberInputs(),
      refetchOnWindowFocus: "always",
    });

  const { data: teamsNotAvailable, isLoading: isLoadingTeamsNotAvailable } =
    useQuery({
      queryKey: ["teamsNotAvailable", userId, tournamentsId],
      queryFn: () => getTeamsNotAvailable("2", "3"),
      refetchInterval: 60 * 1000, // Ejecuta la consulta cada minuto (60 segundos)
      refetchOnWindowFocus: "always",
    });

  const { mutate: postNewPortfolioMutate } = useMutation({
    mutationFn: postNewPortfolio,
    onSuccess: (resp) => {
      toast.success(resp);
      queryClient.invalidateQueries(["portfolios", userId]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: postEditPortfolioMutate } = useMutation({
    mutationFn: postEditPortfolio,
    onSuccess: (resp) => {
      toast.success(resp);
      queryClient.invalidateQueries(["portfolios", userId]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const areAllInputsValid = () => {
    return (
      selectedTeams.length === numberInputs.length && // Verifica que el número de equipos coincida con el número de inputs
      selectedTeams.every((team) => team && team.name) // Verifica que cada equipo tenga un nombre válido
    );
  };

  useEffect(() => {
    if (teamsEPL) {
      setTeamsComplete((prev) => [...prev, ...teamsEPL]);
    }
  }, [teamsEPL]);

  useEffect(() => {
    if (teamsComplete && teamsNotAvailable) {
      const updatedTeams = teamsComplete.map((team) => {
        const isNotAvailable = teamsNotAvailable.some(
          (notAvailableTeam: { id: number }) => notAvailableTeam.id === team.id
        );
        return {
          ...team,
          disabled: isNotAvailable, // Si está en teamsNotAvailable, `disabled` será true
        };
      });
      setTeamsComplete(updatedTeams); // Actualiza el estado con los equipos modificados
    }
  }, [teamsNotAvailable]);

  useEffect(() => {
    if (numberInputsRecived) {
      setNumberInputs(Array(numberInputsRecived).fill(""));
    }
  }, [numberInputsRecived]); // Se ejecuta cada vez que cambia la ruta

  useEffect(() => {
    if (portfolios && portfolios.length > 0 && teamsComplete) {
      const combinedTeams = teamsComplete
        .filter((team) =>
          portfolios[0].teams.some(
            (portfolioTeam) => portfolioTeam.id === team.id
          )
        )
        .map((team) => {
          const matchingPortfolioTeam = portfolios[0].teams.find(
            (portfolioTeam) => portfolioTeam.id === team.id
          );

          // Combina las propiedades de ambos equipos
          return { ...team, ...matchingPortfolioTeam };
        });

      setSelectedTeams(combinedTeams);
    }
  }, [portfolios]);

  useEffect(() => {
    if (selectedTeams) {
      setNumberInputs(
        numberInputs.map((_, index) => {
          if (!selectedTeams[index]) return "";
          return {
            ...selectedTeams[index],
          };
        })
      );
    }
  }, [selectedTeams]);

  useEffect(() => {
    if (selectedTeams && teamsComplete) {
      const teamsNotSelected = teamsComplete.map((team) => {
        if (
          !selectedTeams.some((selectedTeam) => selectedTeam.id === team.id)
        ) {
          return { ...team, selected: false };
        } else {
          return { ...team, selected: true };
        }
      });
      setTeamsComplete(teamsNotSelected);
    }
  }, [selectedTeams, numberInputs]);

  const handleChangeSelect = (value: string, index: number) => {
    const newSelectedTeams = [...selectedTeams];
    newSelectedTeams[index] = teamsComplete.filter(
      (team) => team.name === value
    )[0];
    setSelectedTeams(newSelectedTeams);
  };

  const addportFolioAlert = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to save changes",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3ED076",
      cancelButtonColor: "#c7630b",
      color: "white",
      background: "#200930", //
      confirmButtonText: "Yes, I want to save changes!",
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("Confirmed");
        addportFolio();
        Swal.fire({
          title: "Changes saved!",
          text: "You have changes saved successfully.",
          icon: "success",
          background: "#421065", // Cambia el color de fondo
          confirmButtonColor: "#3ED076",
          color: "white", // Cambia el color del texto
        });
      }
    });
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
        return { id: team.id };
      }),
    };
    if (!portfolios || portfolios.length === 0) {
      // Crea un nuevo portfolio
      postNewPortfolioMutate({
        port: newPortfolio,
        userId: userId,
        portId: portfolios[0]?.id,
      });
    } else if (portfolios && portfolios.length > 0) {
      // Actualiza el primer portfolio
      postEditPortfolioMutate({
        port: newPortfolio.teams,
        portId: portfolios[0]?.id,
      });
    }
  }, [selectedTeams, teamsEPL, userId, portfolios]);

  const renderTeams = () => {
    return numberInputs.map((team, idx: number) => {
      console.log(team);

      return (
        <div
          key={idx}
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          {/* Select */}
          <div
            style={{
              backgroundColor: idx % 2 === 0 ? "#380f65" : "#200930",
              height: "-webkit-fill-available",
              width: "80px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "#05fa87",
              fontWeight: "bold",
            }}
          >
            {team.seed}
          </div>
          <FormControl
            fullWidth
            sx={{
              backgroundColor: idx % 2 === 0 ? "#380f65" : "#200930",
              "& .MuiInputLabel-root": {
                color: "white",
                fontWeight: "bold",
                fontSize: "18px",
                // transition: "opacity 0.2s",
              },
            }}
            onClick={(e) => {
              // Handle click event
              // e.stopPropagation();
              // e.preventDefault();
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
                opacity: selectedTeams[idx] ? 0.5 : 1,
              }}
            >
              Team
            </InputLabel>
            <Select
              labelId={`select-label-${idx}`}
              value={team.name || ""}
              label="Team"
              readOnly={team.disabled}
              disabled={team.disabled}
              onChange={(e) => {
                handleChangeSelect(e.target.value, idx);
              }}
              sx={{
                backgroundColor: team.disabled && "#72598cff",
                opacity: team.disabled && 0.7,
                "& .MuiSelect-icon": {
                  color: team.disabled ? "gray" : "white",
                },
              }}
            >
              {teamsComplete.map((opt) => (
                <MenuItem
                  key={opt.id}
                  value={opt.name || ""}
                  disabled={opt.selected} // Deshabilita si available es false
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
              height: "-webkit-fill-available",
              width: "80px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "#05fa87",
              fontWeight: "bold",
            }}
          >
            {team.streak_multiplier}
          </div>
        </div>
      );
    });
  };

  if (
    isLoadingTournamentId ||
    isLoading ||
    isLoadingPortfolios ||
    isLoadingNumberInputs ||
    // isLoadingTeamsDynamic ||
    isLoadingTeamsNotAvailable
  ) {
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
                  Portfolio
                  {portfolios?.length > 1 && "s"}
                  <p style={{ fontSize: "14px" }}>
                    {portfolios && portfolios[0]?.name}
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
                  <Grid size={12}>Seeds</Grid>
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
                    // backgroundColor: "#05fa87",
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
                  onClick={() => areAllInputsValid() && addportFolioAlert()}
                >
                  {portfolios && portfolios[0]?.teams.length > 0
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
