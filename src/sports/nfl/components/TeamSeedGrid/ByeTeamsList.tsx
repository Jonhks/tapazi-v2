import type { NflTeam } from "./TeamSeedGrid";
import { TeamCrest } from "./TeamCrest";
import classes from "./TeamSeedGrid.module.css";

interface Props {
  teams: NflTeam[];
  isTeamSelected: (team: NflTeam) => boolean;
  getSeed: (team: NflTeam) => string | number;
  getMultiplier: (team: NflTeam) => string | number;
}

/**
 * Equipos que descansan esta semana (bye week). Solo informativos: nunca
 * son clickeables, aunque si ya forman parte del portfolio guardado se
 * muestran en su estado "seleccionado" para que el usuario los ubique.
 */
export function ByeTeamsList({ teams, isTeamSelected, getSeed, getMultiplier }: Props) {
  if (teams.length === 0) return null;

  return (
    <div className={classes.cells}>
      {teams.map((team) => {
        const selected = isTeamSelected(team);
        return (
          <div
            key={team.id}
            className={`${classes.cell} ${selected ? classes.selected : classes.bye}`}
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
          </div>
        );
      })}
    </div>
  );
}

export default ByeTeamsList;
