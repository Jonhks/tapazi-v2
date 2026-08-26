import { useMemo } from "react";
import { Tooltip } from "@mui/material";
import type { Team } from "@/types/index";
import { TeamCrest } from "./TeamCrest";
import classes from "./TeamSeedGrid.module.css";

export interface NflTeam extends Team {
  crest_url?: string;
  disabled?: boolean;
  multiplier?: number;
  bye_team_current_week?: boolean;
}

type CellState = "available" | "selected" | "full" | "blocked";

interface Props {
  /** Solo equipos que NO están en bye — los de bye viven en <ByeTeamsList>. */
  teams: NflTeam[];
  isTeamSelected: (team: NflTeam) => boolean;
  isTeamBlocked: (team: NflTeam) => boolean;
  isGridFull: boolean;
  onToggleTeam: (team: NflTeam) => void;
  getSeed: (team: NflTeam) => string | number;
  getMultiplier: (team: NflTeam) => string | number;
}

const STATE_TOOLTIP: Record<Exclude<CellState, "available" | "selected">, string> = {
  full: "You already selected the maximum number of teams",
  blocked: "This team is not available",
};

export function TeamSeedGrid({
  teams,
  isTeamSelected,
  isTeamBlocked,
  isGridFull,
  onToggleTeam,
  getSeed,
  getMultiplier,
}: Props) {
  const ROW_SIZE = 4;

  // filas de 4 equipos ordenados por seed — si a una fila "le faltan" (ej.
  // porque algunos de esa seed están en bye), se completa con los siguientes
  // equipos en el orden, sin dejar huecos a mitad de la lista.
  const rows = useMemo(() => {
    const sorted = [...teams].sort((a, b) => a.seed - b.seed);
    const chunks: NflTeam[][] = [];
    for (let i = 0; i < sorted.length; i += ROW_SIZE) {
      chunks.push(sorted.slice(i, i + ROW_SIZE));
    }
    return chunks;
  }, [teams]);

  const getCellState = (team: NflTeam): CellState => {
    if (isTeamSelected(team)) return "selected";
    if (isTeamBlocked(team)) return "blocked";
    if (isGridFull) return "full";
    return "available";
  };

  return (
    <div className={classes.grid}>
      {rows.map((rowTeams, rowIndex) => {
        const isLastIncompleteRow =
          rowIndex === rows.length - 1 && rowTeams.length < ROW_SIZE;

        const cells = rowTeams.map((team) => {
          const state = getCellState(team);
          const clickable = state === "available" || state === "selected";
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

          if (state === "blocked" || state === "full") {
            return (
              <Tooltip
                key={team.id}
                title={STATE_TOOLTIP[state]}
              >
                <span>{cell}</span>
              </Tooltip>
            );
          }
          return cell;
        });

        return (
          <div
            key={rowIndex}
            className={`${classes.row} ${isLastIncompleteRow ? classes.rowCentered : ""}`}
          >
            <div className={classes.seedLabel}>{rowTeams[0]?.seed}</div>
            {isLastIncompleteRow ? (
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
