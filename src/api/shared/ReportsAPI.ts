/**
 * Funciones de API compartidas entre todos los módulos de deporte.
 * Todas estas llamadas son idénticas — solo el tournament_id cambia.
 * Antes existían duplicadas en StatsAPI.ts, StatsFemaleAPI.ts,
 * HistoryAPI.ts y HistoryFemaleAPI.ts.
 */
import { apiEnv } from "@/lib/axios";
import { isAxiosError } from "axios";

// ─── Stats / Reports ─────────────────────────────────────────────────────────

export const getTeamsPicked = async (tournamentId: number, round: number) => {
  try {
    const { data } = await apiEnv(
      `/tournaments/${tournamentId}/score/stats?sport=ncaa&round=${round}&order=1`,
    );
    return data.stats ?? [];
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return [];
  }
};

export const getMostPickedTeams = async (tournamentId: number) => {
  try {
    const { data } = await apiEnv(
      `/reports/most-picked-teams?tournament_id=${tournamentId}`,
    );
    return data.data ?? "Error";
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const getLeastPickedTeams = async (tournamentId: number) => {
  try {
    const { data } = await apiEnv(
      `/reports/least-picked-teams?tournament_id=${tournamentId}`,
    );
    return data.data ?? "Error";
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const getTeamsNotPickedLog = async (tournamentId: number) => {
  try {
    const { data } = await apiEnv(
      `/reports/teams-not-picked-log?tournament_id=${tournamentId}`,
    );
    return data.data ?? "Error";
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const getTeamsPickedLog = async (tournamentId: number) => {
  try {
    const { data } = await apiEnv(
      `/reports/teams-picked-log?tournament_id=${tournamentId}`,
    );
    return data.data ?? "Error";
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const getSeedPickTotal = async (tournamentId: number) => {
  try {
    const { data } = await apiEnv(
      `/reports/seed-pick-totals?tournament_id=${tournamentId}`,
    );
    return data.data ?? "Error";
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const getPortfolioSeedSelections = async (tournamentId: number) => {
  try {
    const { data } = await apiEnv(
      `/reports/portfolio-seed-selections?tournament_id=${tournamentId}`,
    );
    return data.data ?? "Error";
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

// ─── History Reports ──────────────────────────────────────────────────────────

export const getTeamsPerYearLog = async (tournamentId: number) => {
  try {
    const { data } = await apiEnv(
      `/reports/teams-per-year-log?tournament_id=${tournamentId}`,
    );
    return data.data ?? data.error;
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return error;
  }
};

export const getTeamsPerfectPortfolios = async () => {
  try {
    const { data } = await apiEnv(`/reports/historical-perfect-portfolios-header`);
    return data.data ?? data.error?.description ?? "Error";
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const getTeamsHistoricAllRounds = async (orderBy = "risk") => {
  try {
    const { data } = await apiEnv(
      `/reports/historical-all-rounds?order-by=${orderBy}`,
    );
    return data.data ?? data.error?.description ?? "Error";
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const getHistoricalPerfectPortfoliosHistory = async (year: number) => {
  try {
    const { data } = await apiEnv(
      `historical-perfect-portfolios-history?api-key=TESTAPIKEY&year=${year}`,
    );
    if (!data.success) return data.error?.description ?? "Error";
    return data.data.historicalPerfectPortfoliosHistory;
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const getTeamsPickedLogHistory = async (year: number) => {
  try {
    const { data } = await apiEnv(
      `teams-picked-log-history?api-key=TESTAPIKEY&year=${year}`,
    );
    if (!data.success) return data.error?.description ?? "Error";
    return data.data.teamsPickedLogHistory;
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};
