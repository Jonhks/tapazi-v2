/**
 * API de estadísticas NCAA Masculino.
 * Las funciones compartidas se re-exportan desde shared/ReportsAPI
 * para que los views no necesiten cambiar sus imports.
 */
import { apiEnv } from "@/lib/axios";
import { isAxiosError } from "axios";

// ─── Re-exports desde shared (idénticas entre módulos) ───────────────────────
export {
  getTeamsPicked,
  getMostPickedTeams,
  getLeastPickedTeams,
  getTeamsNotPickedLog,
  getTeamsPickedLog,
  getSeedPickTotal,
  getPortfolioSeedSelections,
} from "@/api/shared/ReportsAPI";

// ─── Funciones específicas de NCAA Masculino ─────────────────────────────────

export const getScoreWeeksMale = async (tournamentId: number) => {
  try {
    const { data } = await apiEnv(`/tournaments/${tournamentId}/score/weeks`);
    return data.weeks ?? [];
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const getPortfolioStatsWeek = async (week: number) => {
  try {
    const { data } = await apiEnv(
      `/tournaments/3/score/stats/portfolio?week=${week}`,
    );
    return data.data ?? [];
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return [];
  }
};

export const getNcaaMaleTeams = async (tournamentId: number) => {
  try {
    const { data } = await apiEnv(
      `/sports/2/teams?sport=ncaa&tournament_id=${tournamentId}`,
    );
    return data.teams ?? [];
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return [];
  }
};
