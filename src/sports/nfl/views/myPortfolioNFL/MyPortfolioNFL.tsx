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
    availableByeTeams,
    maxByeTeams,
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

  const isTeamOnBye = (team) => !!team?.bye_team_current_week;

  const availableByeTeamIds = new Set(
    (availableByeTeams ?? []).map((t) =>
      typeof t === "object" && t !== null ? t.id : t,
    ),
  );

  const currentByeCount = selected.filter((t) => t && isTeamOnBye(t)).length;

  // un bye team solo se muestra como seleccionable si además todavía hay
  // cupo disponible (BYTEPO) — si ya se llegó al máximo, se ve bloqueado
  // aunque el equipo en sí sea elegible.
  const isByeTeamSelectable = (team) =>
    availableByeTeamIds.has(team.id) && currentByeCount < maxByeTeams;

  const byeTeams = teams.filter(isTeamOnBye);
  const weekTeams = teams.filter((t) => !isTeamOnBye(t));

  const handleToggleTeam = (team) => {
    if (isTeamBlocked(team)) {
      toast.info("This team is not available and cannot be modified.");
      return;
    }

    const onBye = isTeamOnBye(team);
    if (onBye && !isByeTeamSelectable(team)) {
      toast.info(
        "This team is on a bye week and was not part of a previous selection.",
      );
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

    if (onBye && currentByeCount >= maxByeTeams) {
      toast.info(
        `You can only select up to ${maxByeTeams} bye-week team${maxByeTeams === 1 ? "" : "s"}.`,
      );
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
                Week
                <span className={classes.sectionCount}>
                  {selected.filter((t) => t && t.name).length} / {numberInputs}{" "}
                  selected
                </span>
              </div>
              <TeamSeedGrid
                teams={weekTeams}
                isTeamSelected={isTeamSelected}
                isTeamBlocked={isTeamBlocked}
                isGridFull={isGridFull}
                onToggleTeam={handleToggleTeam}
                getSeed={getSeed}
                getMultiplier={getMultiplier}
              />

              {byeTeams.length > 0 && (
                <>
                  <div className={classes.sectionLabel}>
                    Bye
                    {maxByeTeams > 0 && (
                      <span className={classes.sectionCount}>
                        {currentByeCount} selected
                      </span>
                    )}
                  </div>
                  <ByeTeamsList
                    teams={byeTeams}
                    isTeamSelected={isTeamSelected}
                    isByeTeamSelectable={isByeTeamSelectable}
                    onToggleTeam={handleToggleTeam}
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
