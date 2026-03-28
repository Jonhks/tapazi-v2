import { apiEnv } from "@/lib/axios";
import { isAxiosError } from "axios";

// TODO: Confirmar con el back qué endpoints difieren de ncaa-male para worldcup

export const getTournamentsWorldCup = async (sportId: string) => {
  try {
    const url = `/sports/${sportId}/tournaments`;
    const { data } = await apiEnv(url, {
      headers: { "Content-Type": "application/json;charset=utf-8" },
    });
    if (!data.tournaments) return data.error?.description || "Error";
    if (data.tournaments) return data.tournaments;
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const getTeamsHistoricAllRoundsWorldCup = async (orderBy = "risk") => {
  try {
    // TODO: Verificar endpoint worldcup para historical-all-rounds
    const url = `/reports/historical-all-rounds?order-by=${orderBy}`;
    const { data } = await apiEnv(url, {
      headers: { "Content-Type": "application/json;charset=utf-8" },
    });
    if (!data.data) return data.error?.description || "Error";
    if (data.data) return data.data;
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const getTeamsPerfectPortfoliosWorldCup = async () => {
  try {
    const url = `/reports/historical-perfect-portfolios-header`;
    const { data } = await apiEnv(url, {
      headers: { "Content-Type": "application/json;charset=utf-8" },
    });
    if (!data.data) return data.error?.description || "Error";
    if (data.data) return data.data;
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const getTeamsPerYearLogWorldCup = async (tournamentId: number) => {
  try {
    const url = `/reports/teams-per-year-log?tournament_id=${tournamentId}`;
    const { data } = await apiEnv(url, {
      headers: { "Content-Type": "application/json;charset=utf-8" },
    });
    if (!data.data) return data.error;
    if (data.data) return data.data;
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return error;
  }
};

export const getHistoricalPerfectPortfoliosHistoryWorldCup = async (year: number) => {
  try {
    const url = `historical-perfect-portfolios-history?api-key=TESTAPIKEY&year=${year}`;
    const { data } = await apiEnv(url, {
      headers: { "Content-Type": "application/json;charset=utf-8" },
    });
    if (!data.success) return data.error?.description || "Error";
    if (data.success) return data.data.historicalPerfectPortfoliosHistory;
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const getTeamsPickedLogHistoryWorldCup = async (year: number) => {
  try {
    const url = `teams-picked-log-history?api-key=TESTAPIKEY&year=${year}`;
    const { data } = await apiEnv(url, {
      headers: { "Content-Type": "application/json;charset=utf-8" },
    });
    if (!data.success) return data.error?.description || "Error";
    if (data.success) return data.data.teamsPickedLogHistory;
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};
