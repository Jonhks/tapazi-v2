import { useMemo } from "react";
import { Tooltip } from "@mui/material";
import type { Team } from "@/types/index";
import { TeamCrest } from "./TeamCrest";
import classes from "./TeamSeedGrid.module.css";

export interface NflTeam extends Team {
  crest_url?: string;
  disabled?: boolean;
  multiplier?: number;
}

type CellState = "available" | "selected" | "full" | "blocked" | "bye";

interface Props {
  teams: NflTeam[];
  isTeamSelected: (team: NflTeam) => boolean;
  isTeamBlocked: (team: NflTeam) => boolean;
  isTeamOnBye: (team: NflTeam) => boolean;
  isGridFull: boolean;
  onToggleTeam: (team: NflTeam) => void;
  getSeed: (team: NflTeam) => string | number;
  getMultiplier: (team: NflTeam) => string | number;
}

const STATE_TOOLTIP: Record<Exclude<CellState, "available" | "selected">, string> = {
  full: "You already selected the maximum number of teams",
  blocked: "This team is not available",
  bye: "This team is on bye this week",
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
    if (isTeamSelected(team)) return "selected";
    if (isTeamBlocked(team)) return "blocked";
    if (isTeamOnBye(team)) return "bye";
    if (isGridFull) return "full";
    return "available";
  };

  return (
    <div className={classes.grid}>
      {rows.map(([seed, seedTeams]) => (
        <div
          key={seed}
          className={classes.row}
        >
          <div className={classes.seedLabel}>{seed}</div>
          {seedTeams.map((team) => {
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

            if (state === "blocked" || state === "bye" || state === "full") {
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
          })}
        </div>
      ))}
    </div>
  );
}

export default TeamSeedGrid;
