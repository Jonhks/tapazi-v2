import { Tooltip } from "@mui/material";
import type { NflTeam } from "./TeamSeedGrid";
import { TeamCrest } from "./TeamCrest";
import classes from "./TeamSeedGrid.module.css";

interface Props {
  teams: NflTeam[];
  isTeamSelected: (team: NflTeam) => boolean;
  isByeTeamSelectable: (team: NflTeam) => boolean;
  onToggleTeam: (team: NflTeam) => void;
  getSeed: (team: NflTeam) => string | number;
  getMultiplier: (team: NflTeam) => string | number;
}

/**
 * Equipos que descansan esta semana (bye week) — se pueden seleccionar/
 * quitar libremente desde acá hasta llegar al tope (BYTEPO); una vez
 * alcanzado, los que no están elegidos quedan bloqueados.
 */
export function ByeTeamsList({
  teams,
  isTeamSelected,
  isByeTeamSelectable,
  onToggleTeam,
  getSeed,
  getMultiplier,
}: Props) {
  if (teams.length === 0) return null;

  return (
    <div className={classes.cells}>
      {teams.map((team) => {
        const selected = isTeamSelected(team);
        const selectable = isByeTeamSelectable(team);
        const clickable = selected || selectable;
        const stateClass = selected
          ? classes.selected
          : selectable
            ? classes.available
            : classes.bye;

        const cell = (
          <button
            key={team.id}
            type="button"
            disabled={!clickable}
            onClick={() => clickable && onToggleTeam(team)}
            className={`${classes.cell} ${stateClass}`}
          >
            {selected && (
              <span className={classes.seedBadge}>{getSeed(team)}</span>
            )}
            <TeamCrest src={team.crest_url} />
            <span className={classes.teamName}>{team.name}</span>
            {selected && (
              <span className={classes.multiplierBadge}>
                {getMultiplier(team)}
              </span>
            )}
          </button>
        );

        if (!selected && !selectable) {
          return (
            <Tooltip
              key={team.id}
              title="You already selected the maximum number of bye-week teams"
            >
              <span>{cell}</span>
            </Tooltip>
          );
        }
        return cell;
      })}
    </div>
  );
}

export default ByeTeamsList;
