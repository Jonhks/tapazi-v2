// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { Box, Button, Divider } from "@mui/material";
import Grid from "@mui/material/Grid2";
import classes from "./MyPortfolioNFL.module.css";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import Loader from "../../components/NFLBallLoader/NFLBallLoader";
import { TeamSeedGrid } from "../../components/TeamSeedGrid/TeamSeedGrid";
import { ByeTeamsList } from "../../components/TeamSeedGrid/ByeTeamsList";
import { usePortfolioNflData } from "@/hooks/usePortfolioNflData";
import { usePortfolioNflActions } from "@/hooks/usePortfolioNflActions";

// TODO: el backend de NFL aún no expone un campo de "bye week" por equipo
// (ni en teamSchema ni en las respuestas de /teams, /teams/dynamics, etc.).
// Mientras tanto usamos esta lista fija (equipos de bye del mockup/ticket)
// para poder mostrar la sección completa en el muck up. Reemplazar por el
// campo real (ej. team.bye_week) en cuanto el backend lo entregue.
const MOCK_BYE_TEAM_NAMES = [
  "atlanta",
  "cleveland",
  "green bay",
  "seattle",
  "los angeles rams",
  "new england",
];

const isMockByeTeam = (team) =>
  MOCK_BYE_TEAM_NAMES.some((name) => team?.name?.toLowerCase().includes(name));

const MyPortfolioNFL = () => {
  const params = useParams();
  const userId = params.userId!;
  const sportId = params.sportId!;

  const {
    validTournament,
    setValidTournament,
    AllPortfolios,
    teamsComplete,
    numberInputs,
    teamsBloqued,
    selectedTeams,
    setSelectedTeams,
    teamsDynamics,
    weekParameter,
    tournamentId,
    isLoadingData,
  } = usePortfolioNflData(userId, sportId);

  const {
    areAllInputsValid,
    getSeed,
    getMultiplier,
    addportFolioAlert,
    cancelAlert,
  } = usePortfolioNflActions({
    userId,
    tournamentId,
    AllPortfolios,
    selectedTeams,
    numberInputs,
    setValidTournament,
    teamsDynamics,
    validTournament,
    weekParameter,
  });

  const teams = teamsComplete ?? [];
  const selected = selectedTeams ?? [];

  const isTeamSelected = (team) => selected.some((t) => t && t.id === team.id);

  const isTeamBlocked = (team) =>
    (teamsBloqued ?? []).some((t) => t.id === team.id);

  const isGridFull = selected.length > 0 && selected.every((t) => t && t.name);

  const byeTeams = teams.filter(isMockByeTeam);

  const handleToggleTeam = (team) => {
    // un equipo bloqueado/bye no se puede tocar, ni para seleccionarlo ni
    // para quitarlo si ya estaba elegido de antes.
    if (isTeamBlocked(team)) {
      toast.info("This team is not available and cannot be modified.");
      return;
    }
    if (isMockByeTeam(team)) {
      toast.info("This team is on a bye week and cannot be modified.");
      return;
    }

    const alreadySelectedIndex = selected.findIndex(
      (t) => t && t.id === team.id,
    );
    if (alreadySelectedIndex !== -1) {
      const next = [...selected];
      next[alreadySelectedIndex] = "";
      setSelectedTeams(next);
      return;
    }

    const emptyIndex = selected.findIndex((t) => !t || !t.name);
    if (emptyIndex === -1) {
      toast.info("You already selected the maximum number of teams.");
      return;
    }

    const next = [...selected];
    next[emptyIndex] = team;
    setSelectedTeams(next);
  };

  if (isLoadingData) {
    return <Loader />;
  }

  return (
    <Grid
      container
      justifyContent={"center"}
      alignContent={"start"}
      size={12}
      style={{
        minHeight: "700px",
        height: "calc(100vh - 56px)",
        overflowY: "scroll",
        overflowX: "hidden",
      }}
      className={`${classes.gridInstructions}`}
    >
      <Grid size={{ xs: 12, sm: 10, lg: 10 }}>
        <Box
          component="section"
          className={classes.boxPortfolio}
          m={3}
        >
          <div
            className={classes.headerPortfolio}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div style={{ color: "white" }}>
              <EmojiEventsOutlinedIcon
                color="inherit"
                style={{ fontSize: "2.6rem" }}
              />
              <h2 style={{ color: "#D4AF37", fontSize: "40px" }}>
                My Portfolio
                <p
                  style={{
                    color: "white",
                    fontSize: "16px",
                    fontWeight: "normal",
                  }}
                >
                  {validTournament ? validTournament[0]?.name : "Tournament"}
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
              fontSize: "22px",
              fontWeight: "bold",
            }}
          >
            <p style={{ textAlign: "center", color: "#D4AF37" }}>
              {AllPortfolios && AllPortfolios[0]?.name}
            </p>
            <Divider style={{ backgroundColor: "white", width: "60%" }} />
          </div>

          {numberInputs === 0 ? (
            <p
              style={{
                color: "white",
                fontWeight: "bold",
                textAlign: "center",
                fontSize: "24px",
              }}
            >
              No teams are available for selection.
            </p>
          ) : (
            <Grid
              size={12}
              style={{ marginTop: "30px" }}
            >
              <div className={classes.sectionLabel}>
                Normal Week
                <span className={classes.sectionCount}>
                  {selected.filter((t) => t && t.name).length} / {numberInputs}{" "}
                  selected
                </span>
              </div>
              <TeamSeedGrid
                teams={teams}
                isTeamSelected={isTeamSelected}
                isTeamBlocked={isTeamBlocked}
                isTeamOnBye={isMockByeTeam}
                isGridFull={isGridFull}
                onToggleTeam={handleToggleTeam}
                getSeed={getSeed}
                getMultiplier={getMultiplier}
              />

              {byeTeams.length > 0 && (
                <>
                  <div className={classes.sectionLabel}>Bye</div>
                  <ByeTeamsList
                    teams={byeTeams}
                    isTeamSelected={isTeamSelected}
                    getSeed={getSeed}
                    getMultiplier={getMultiplier}
                  />
                </>
              )}
            </Grid>
          )}

          <Grid
            mt={3}
            mb={2}
          >
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button
                variant="contained"
                style={{
                  backgroundColor: `${areAllInputsValid() ? "#05fa87" : "#0c5031ff"}`,
                  width: "30%",
                  color: "black",
                  fontWeight: "bold",
                  fontSize: "14px",
                  margin: 10,
                  "&:disabled": { backgroundColor: "grey" },
                }}
                onClick={() => addportFolioAlert()}
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
              >
                Cancel
              </Button>
            </div>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};

export default MyPortfolioNFL;
