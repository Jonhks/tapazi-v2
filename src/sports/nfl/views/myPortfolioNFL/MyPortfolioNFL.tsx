// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { useEffect, useState } from "react";
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

// aviso flotante: aparece cuando falta esto para el corte de edición
const CUTOFF_WARNING_MINUTES = 3;

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
    isEditableTime,
    editCutoffAt,
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
    isEditableTime,
  });

  const teams = teamsComplete ?? [];
  const selected = selectedTeams ?? [];

  const [cutoffCountdown, setCutoffCountdown] = useState("");
  const [dismissedCutoffWarning, setDismissedCutoffWarning] = useState(false);
  const cutoffTime = editCutoffAt ? editCutoffAt.getTime() : null;

  useEffect(() => {
    if (!cutoffTime) {
      setCutoffCountdown("");
      return;
    }

    const tick = () => {
      const msLeft = cutoffTime - Date.now();
      const warningWindowMs = CUTOFF_WARNING_MINUTES * 60 * 1000;
      if (msLeft <= 0 || msLeft > warningWindowMs) {
        setCutoffCountdown("");
        return;
      }
      const totalSeconds = Math.floor(msLeft / 1000);
      const m = Math.floor(totalSeconds / 60);
      const s = totalSeconds % 60;
      setCutoffCountdown(`${m}:${String(s).padStart(2, "0")}`);
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [cutoffTime]);

  // bye_team_next_week (y por lo tanto esta pantalla) siempre habla de la
  // semana siguiente a la ronda actual del torneo.
  const nextWeekNumber = (validTournament?.[0]?.current_round ?? 0) + 1;

  const isTeamSelected = (team) => selected.some((t) => t && t.id === team.id);

  const isTeamBlocked = (team) =>
    (teamsBloqued ?? []).some((t) => t.id === team.id);

  // los objetos de equipo que vienen de un portfolio guardado
  // (AllPortfolios[0].teams) no siempre traen bye_team_next_week — se busca
  // el equipo "canónico" en teamsComplete por id para no perder el dato.
  const isTeamOnBye = (team) => {
    const canonical = teams.find((t) => t.id === team?.id);
    return !!(canonical?.bye_team_next_week ?? team?.bye_team_next_week);
  };

  // los bye teams seleccionados van SIEMPRE después de los primeros
  // numberInputs cupos (que son solo para equipos de la semana) — son un
  // extra aparte, no compiten por esos cupos.
  const weekSelectedCount = selected.filter(
    (t) => t && t.name && !isTeamOnBye(t),
  ).length;
  const isGridFull = weekSelectedCount >= numberInputs;

  const currentByeCount = selected.filter((t) => t && isTeamOnBye(t)).length;

  // sports/teams/available-bye-teams-per-portfolio devuelve los bye teams
  // que ya vienen "arrastrados" del portfolio (ej. por streak de semanas
  // anteriores) — esos NO se pueden tocar desde acá, quedan bloqueados.
  const lockedByeTeamIds = new Set(
    (availableByeTeams ?? []).map((t) =>
      typeof t === "object" && t !== null ? t.team_id : t,
    ),
  );

  // tope BYTEPO también sigue aplicando sobre lo que sí es libre de elegir.
  const isByeTeamSelectable = (team) =>
    !lockedByeTeamIds.has(team.id) && currentByeCount < maxByeTeams;

  const byeTeams = teams.filter(isTeamOnBye);

  const handleToggleTeam = (team) => {
    const onBye = isTeamOnBye(team);

    // /teams/not-available también trae a los equipos en bye (por eso no
    // se pueden elegir arriba), pero ese bloqueo no debe aplicar cuando se
    // seleccionan desde la sección Bye — ahí es donde SÍ deben poder elegirse.
    if (!onBye && isTeamBlocked(team)) {
      toast.info("This team is not available and cannot be modified.");
      return;
    }

    if (onBye && lockedByeTeamIds.has(team.id)) {
      toast.info(
        "This team is already locked into your portfolio and can't be changed.",
      );
      return;
    }

    const alreadySelectedIndex = selected.findIndex(
      (t) => t && t.id === team.id,
    );
    if (alreadySelectedIndex !== -1) {
      const next = [...selected];
      if (alreadySelectedIndex < numberInputs) {
        // equipo de la semana: se libera el cupo, no se borra la posición
        next[alreadySelectedIndex] = "";
      } else {
        // bye team extra: se quita del todo, no deja hueco
        next.splice(alreadySelectedIndex, 1);
      }
      setSelectedTeams(next);
      return;
    }

    if (onBye) {
      if (currentByeCount >= maxByeTeams) {
        toast.info(
          `You can only select up to ${maxByeTeams} bye-week team${maxByeTeams === 1 ? "" : "s"}.`,
        );
        return;
      }
      // extra: se agrega al final, no ocupa un cupo de numberInputs
      setSelectedTeams([...selected, team]);
      return;
    }

    const emptyIndex = selected.findIndex(
      (t, idx) => idx < numberInputs && (!t || !t.name),
    );
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
    <>
      {cutoffCountdown && !dismissedCutoffWarning && (
        <div className={classes.cutoffBanner}>
          <span>
            Editing will lock in <strong>{cutoffCountdown}</strong> — save
            your changes now.
          </span>
          <button
            type="button"
            className={classes.cutoffBannerClose}
            aria-label="Dismiss"
            onClick={() => setDismissedCutoffWarning(true)}
          >
            ×
          </button>
        </div>
      )}
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
                Week {nextWeekNumber}
                <span className={classes.sectionCount}>
                  {weekSelectedCount} / {numberInputs} selected
                </span>
              </div>
              <TeamSeedGrid
                teams={teams}
                isTeamSelected={isTeamSelected}
                isTeamBlocked={isTeamBlocked}
                isTeamOnBye={isTeamOnBye}
                isGridFull={isGridFull}
                onToggleTeam={handleToggleTeam}
                getSeed={getSeed}
                getMultiplier={getMultiplier}
              />

              {byeTeams.length > 0 && (
                <>
                  <div className={classes.sectionLabel}>
                    Bye Week {nextWeekNumber}
                    <span className={classes.sectionCount}>
                      {currentByeCount} selected
                    </span>
                  </div>
                  <ByeTeamsList
                    teams={byeTeams}
                    isTeamSelected={isTeamSelected}
                    isByeTeamSelectable={isByeTeamSelectable}
                    isByeTeamLocked={(team) => lockedByeTeamIds.has(team.id)}
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
    </>
  );
};

export default MyPortfolioNFL;
