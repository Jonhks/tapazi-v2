import { useMemo } from "react";
import { Tooltip } from "@mui/material";
import type { Team } from "@/types/index";
import { TeamCrest } from "./TeamCrest";
import classes from "./TeamSeedGrid.module.css";

export interface NflTeam extends Team {
  crest_url?: string;
  disabled?: boolean;
  multiplier?: number;
  bye_team_next_week?: boolean;
}

type CellState =
  | "available"
  | "selected"
  | "full"
  | "blocked"
  | "bye"
  | "byeSelected";

interface Props {
  /** Todos los equipos, incluidos los de bye (se muestran bloqueados en su seed original). */
  teams: NflTeam[];
  isTeamSelected: (team: NflTeam) => boolean;
  isTeamBlocked: (team: NflTeam) => boolean;
  isTeamOnBye: (team: NflTeam) => boolean;
  isGridFull: boolean;
  onToggleTeam: (team: NflTeam) => void;
  getSeed: (team: NflTeam) => string | number;
  getMultiplier: (team: NflTeam) => string | number;
}

const STATE_TOOLTIP: Record<
  Exclude<CellState, "available" | "selected">,
  string
> = {
  full: "You already selected the maximum number of teams",
  blocked: "This team is not available",
  bye: "This team is on a bye week — select it from the Bye section below if it's available",
  byeSelected:
    "Selected as a bye-week pick — manage it from the Bye section below",
};

export function TeamSeedGrid({
  teams,
  isTeamSelected,
  isTeamBlocked,
  isTeamOnBye,
  isGridFull,
  onToggleTeam,
  getSeed,
  getMultiplier,
}: Props) {
  const rows = useMemo(() => {
    const bySeed = new Map<number, NflTeam[]>();
    teams.forEach((team) => {
      const group = bySeed.get(team.seed) ?? [];
      group.push(team);
      bySeed.set(team.seed, group);
    });
    return [...bySeed.entries()].sort(([seedA], [seedB]) => seedA - seedB);
  }, [teams]);

  const getCellState = (team: NflTeam): CellState => {
    if (isTeamSelected(team)) {
      // elegido desde la sección Bye — se ve distinto al seleccionado
      // normal, porque sigue sin poder tocarse desde esta grilla.
      return isTeamOnBye(team) ? "byeSelected" : "selected";
    }
    if (isTeamBlocked(team)) return "blocked";
    if (isTeamOnBye(team)) return "bye";
    if (isGridFull) return "full";
    return "available";
  };

  const ROW_SIZE = 4;

  return (
    <div className={classes.grid}>
      {rows.map(([seed, seedTeams]) => {
        const isIncomplete = seedTeams.length < ROW_SIZE;

        const cells = seedTeams.map((team) => {
          const state = getCellState(team);
          const onBye = isTeamOnBye(team);
          // en bye nunca es clickeable desde esta grilla — la selección
          // real (si el equipo está disponible) se hace en la sección
          // Bye de abajo.
          const clickable =
            !onBye && (state === "available" || state === "selected");
          const cell = (
            <button
              key={team.id}
              type="button"
              disabled={!clickable}
              onClick={() => clickable && onToggleTeam(team)}
              className={`${classes.cell} ${classes[state]}`}
            >
              {state === "selected" && (
                <span className={classes.seedBadge}>{getSeed(team)}</span>
              )}
              <TeamCrest src={team.crest_url} />
              <span className={classes.teamName}>{team.name}</span>
              {state === "selected" && (
                <span className={classes.multiplierBadge}>
                  {getMultiplier(team)}
                </span>
              )}
            </button>
          );

          if (!clickable) {
            const tooltipTitle =
              STATE_TOOLTIP[state as Exclude<CellState, "available" | "selected">];
            return (
              <Tooltip
                key={team.id}
                title={tooltipTitle}
              >
                <span>{cell}</span>
              </Tooltip>
            );
          }
          return cell;
        });

        return (
          <div
            key={seed}
            className={`${classes.row} ${isIncomplete ? classes.rowCentered : ""}`}
          >
            <div className={classes.seedLabel}>{seed}</div>
            {isIncomplete ? (
              <div className={classes.rowCellsCentered}>{cells}</div>
            ) : (
              cells
            )}
          </div>
        );
      })}
    </div>
  );
}

export default TeamSeedGrid;
