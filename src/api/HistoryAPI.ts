import { apiGet } from "@/lib/apiClient";
import { Tournament } from "@/types/index";

export const getTournaments = (): Promise<Tournament[]> =>
  apiGet<{ tournaments: Tournament[] }>(`/sports/1/tournaments`).then(
    (d) => d.tournaments ?? [],
  );

export const getTeamsPerYearLog = () =>
  apiGet<{ data: { teamsPerYearLog: unknown[] } }>(`/teams-per-year-log`).then(
    (d) => d.data?.teamsPerYearLog ?? [],
  );

export const getTeamsPerfectPortfolios = () =>
  apiGet<{ data: { historicalPerfectPortfoliosHeader: unknown[] } }>(
    `/historical-perfect-portfolios-header?api-key=TESTAPIKEY`,
  ).then((d) => d.data?.historicalPerfectPortfoliosHeader ?? []);

export const getTeamsHistoricAllRounds = (param: string) =>
  apiGet<{ data: { historicalAllRounds: unknown[] } }>(
    `historical-all-rounds?api-key=TESTAPIKEY&order-by=${param}`,
  ).then((d) => d.data?.historicalAllRounds ?? []);

export const getHistoricalPerfectPortfoliosHistory = (year: number) =>
  apiGet<{ data: { historicalPerfectPortfoliosHistory: unknown[] } }>(
    `historical-perfect-portfolios-history?api-key=TESTAPIKEY&year=${year}`,
  ).then((d) => d.data?.historicalPerfectPortfoliosHistory ?? []);

export const getTeamsPickedLogHistory = (year: number) =>
  apiGet<{ data: { teamsPickedLogHistory: unknown[] } }>(
    `teams-picked-log-history?api-key=TESTAPIKEY&year=${year}`,
  ).then((d) => d.data?.teamsPickedLogHistory ?? []);
