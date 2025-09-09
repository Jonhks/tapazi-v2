// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-disable no-extra-boolean-cast */
/* eslint-disable no-unsafe-optional-chaining */

import { useCallback, useEffect, useState } from "react";
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
// import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import {
  getNumberInputs,
  getPortfolios,
  getTeams,
  // getTeamsDynamic,
  getTeamsNotAvailable,
  getTournamentsId,
  // getTeamsAvailable,
  // postNewPortfolio,
} from "@/api/epl/PortfoliosEplAPI";
import { NewPortfolio, Portfolios } from "@/types/index";
import Loader from "../../components/EPLBallLoader/EPLBallLoader";

const MyPortfolioEPL = () => {
  const params = useParams();
  const userId = params.userId!;
  // const queryClient = useQueryClient();

  const [teamsComplete, setTeamsComplete] = useState<Portfolios>([]);
  const [numberInputs, setNumberInputs] = useState<string[] | NewPortfolio>([]);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);

  const { data: tournamentsId, isLoading: isLoadingTournamentId } = useQuery({
    queryKey: ["tournamentsId", userId],
    queryFn: () => getTournamentsId(),
    refetchOnWindowFocus: false,
  });

  const { data: portfolios, isLoading: isLoadingPortfolios } = useQuery({
    queryKey: ["portfolios", userId, tournamentsId],
    queryFn: () =>
      getPortfolios("2", tournamentsId ? tournamentsId[0].id.toString() : "0"),
    refetchOnWindowFocus: false,
  });

  const { data: teamsEPL, isLoading } = useQuery({
    queryKey: ["teamsEpl", userId],
    queryFn: () => getTeams("2"),
    refetchOnWindowFocus: false,
  });

  const { data: numberInputsRecived, isLoading: isLoadingNumberInputs } =
    useQuery({
      queryKey: ["numberInputsRecived", userId],
      queryFn: () => getNumberInputs(),
      refetchOnWindowFocus: false,
    });

  // const { data: teamsDynamic, isLoading: isLoadingTeamsDynamic } = useQuery({
  //   queryKey: ["teamsDynamic", userId, portfolios],
  //   queryFn: () => getTeamsDynamic("2", portfolios ? portfolios[0].id : "0"),
  //   refetchOnWindowFocus: false,
  // });

  const { data: teamsNotAvailable, isLoading: isLoadingTeamsNotAvailable } =
    useQuery({
      queryKey: ["teamsNotAvailable", userId, tournamentsId],
      queryFn: () => getTeamsNotAvailable("2", "3"),
      refetchInterval: 60 * 1000, // Ejecuta la consulta cada minuto (60 segundos)
      refetchOnWindowFocus: false,
    });

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
  }, [numberInputsRecived]);

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
          return { ...team, ...matchingPortfolioTeam, disabled: true };
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
    console.log(teamsComplete);
    newSelectedTeams[index] = teamsComplete.filter(
      (team) => team.name === value
    )[0];
    setSelectedTeams(newSelectedTeams);
  };

  const addportFolio = useCallback(() => {
    const allFilled = selectedTeams.every((team) => team !== "");

    console.log(selectedTeams);

    // // ? Verifica que los portfolios vayan llenos
    // if (!allFilled) {
    //   toast.error("You must select all teams!");
    //   setValidTournament(true);

    //   setTimeout(() => {
    //     setValidTournament(false);
    //   }, 2500);
    //   return;
    // }
    // const newPortfolio = {
    //   tournament_id: "3",
    //   participant_id: userId,
    //   championshipPoints: 0,
    //   teams: selectedTeams.map((team) => {
    //     if (team === "") return false;
    //     const found = teamsEPL?.find((opt) => opt.name === team);
    //     return found ? { id: found.id } : false;
    //   }),
    // };
    // Solo guarda un portfolio, actualizándolo
    // setPortfolios([newPortfolio]);

    // postNewPortfolioMutate({
    //   port: newPortfolio,
    //   userId: userId,
    //   portId: portfolios[0]?.id,
    // });
  }, [selectedTeams, teamsEPL, userId, portfolios]);

  const renderTeams = () => {
    return numberInputs.map((team, idx: number) => {
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
              marginLeft: "20px",
              color: "white",
              fontSize: "14px",
              fontWeight: "bold",
            }}
          ></div>
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
          >
            <InputLabel
              id={`select-label-${idx}`}
              shrink={selectedTeams[idx] !== ""}
              sx={{
                color: "white",
                fontWeight: "bold",
                fontSize: "18px",
                transition: "opacity 0.2s",
                opacity: selectedTeams[idx] ? 0 : 1,
              }}
            >
              Team
            </InputLabel>
            <Select
              labelId={`select-label-${idx}`}
              value={team.name || ""}
              label="Team"
              // disabled={team.disabled}
              readOnly={team.disabled}
              onChange={(e) => {
                handleChangeSelect(e.target.value, idx);
              }}
            >
              {teamsComplete
                // ?.filter((opt) => opt.selected === true)
                .map((opt) => (
                  <MenuItem
                    key={opt.id}
                    value={opt.name || ""}
                    disabled={opt.selected} // Deshabilita si available es false
                    style={{
                      // backgroundColor: "red",
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
                      <ListItemText className={classes.clasePrueba}>
                        {opt.name}
                      </ListItemText>
                    </div>
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
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
              <div
                style={{ width: "80%", margin: "0 auto", textAlign: "right" }}
              >
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
                    width: "30%",
                    color: "black",
                    fontWeight: "bold",
                    fontSize: "14px",
                    margin: 10,
                  }}
                  onClick={addportFolio}
                >
                  {portfolios && portfolios[0].teams.length > 0
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
                  // onClick={() => removeportfolioFunction(1)}
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
