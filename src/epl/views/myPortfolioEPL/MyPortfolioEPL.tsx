import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider,
  FormControl,
  InputLabel,
  ListItemIcon,
  ListItemText,
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
  getTeamsDynamic,
  getTeamsNotAvailable,
  getTournamentsId,
  // getTeamsAvailable,
  // postNewPortfolio,
} from "@/api/epl/PortfoliosEplAPI";
import { Portfolios } from "@/types/index";
import Loader from "../../components/EPLBallLoader/EPLBallLoader";
import { set } from "zod";

const MyPortfolioEPL = () => {
  const params = useParams();
  const userId = params.userId!;
  // const queryClient = useQueryClient();

  const [teamsComplete, setTeamsComplete] = useState<Portfolios>([]);
  const [numberInputs, setNumberInputs] = useState<string[]>([]);
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
      // staleTime: 30 * 60 * 1000, // 30 minutes
      refetchOnWindowFocus: false,
    });

  const { data: teamsDynamic, isLoading: isLoadingTeamsDynamic } = useQuery({
    queryKey: ["teamsDynamic", userId, portfolios],
    // queryFn: () => getTeamsDynamic("2", portfolios ? portfolios[0].id : "0"),
    queryFn: () => getTeamsDynamic("2", portfolios ? portfolios[0].id : "0"),
    // staleTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
  });

  const { data: teamsNotAvailable, isLoading: isLoadingTeamsNotAvailable } =
    useQuery({
      queryKey: ["teamsNotAvailable", userId, tournamentsId],
      queryFn: () =>
        // getTeamsNotAvailable("2", tournamentsId ? tournamentsId[0].id : "0"),
        getTeamsNotAvailable("2", "3"),
      refetchInterval: 60 * 1000, // Ejecuta la consulta cada minuto (60 segundos)
      refetchOnWindowFocus: false,
    });

  // console.log(selectedTeams);

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
          available: !isNotAvailable, // Si está en teamsNotAvailable, `available` será false
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
    if (portfolios && portfolios.length > 0) {
      setSelectedTeams(portfolios[0].teams);
    }
  }, [portfolios]);

  useEffect(() => {
    if (selectedTeams) {
      setNumberInputs(
        numberInputs.map((_, index) => selectedTeams[index] || "")
      );
    }
  }, [selectedTeams]);

  const renderTeams = () => {
    type Team = {
      id: number;
      name: string;
      crest_url: string;
      current_streak: number;
      current_seed: number;
      streak_multiplier: number;
      streak_seed: string;
    };

    return numberInputs.map((team: Team, idx: number) => {
      // Opciones disponibles para este select (excluye las ya seleccionadas en otros selects)
      // const availableOptions = teamsEPL?.filter(
      //   (opt) =>
      //     !selectedTeams.includes(opt.name) || selectedTeams[idx] === opt.name
      // );
      // const teamDetails = teamsEPL?.find(
      //   (team) => team.name === selectedTeams[idx]
      // );
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
              // shrink={selectedTeams[idx] !== ""}
              sx={{
                color: "white",
                fontWeight: "bold",
                fontSize: "18px",
                transition: "opacity 0.2s",
                // opacity: selectedTeams[idx] ? 0 : 1,
              }}
            >
              Team
            </InputLabel>
            <Select
              labelId={`select-label-${idx}`}
              value={team.name}
              label="Team"
              onChange={(e) => {
                console.log(selectedTeams[idx], idx);

                console.log("asdlñmaskd");
                // handleChangeSelect(e.target.value, idx)
              }}
              sx={{
                "& .MuiSelect-icon": {
                  color: "white",
                },
              }}
            >
              {teamsComplete?.map((opt) => (
                <MenuItem
                  key={opt.id}
                  value={opt.name || ""}
                  disabled={!opt.available} // Deshabilita si available es false
                >
                  <div
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
                    <ListItemText
                      style={{ textAlign: "left", fontWeight: "bold" }}
                    >
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
    isLoadingTeamsDynamic ||
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
                  // onClick={addportFolio}
                >
                  {/* {portExist ? "EDIT" : "SUBMIT"} */}
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
