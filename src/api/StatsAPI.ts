import { apiGet } from "@/lib/apiClient";
import {
  MostPickedTeams,
  TeamsPickedLog,
  TeamsNotPicked,
} from "@/types/index";

export const getTeamsPicked = (
  id: string,
  round: string,
  order: string,
): Promise<any[]> => {
  if (round === "0") round = "1";
  return apiGet<{ data: { stats: any[] } }>(
    `/score/stats?api-key=TESTAPIKEY&tournament-id=${id}&round=${round}&order=${order}`,
  ).then((d) => d.data?.stats ?? []);
};

export const getMostPickedTeams = (id: number): Promise<MostPickedTeams[]> =>
  apiGet<{ data: { mostPickedTeams: MostPickedTeams[] } }>(
    `/most-picked-teams?api-key=TESTAPIKEY&tournament-id=${id}`,
  ).then((d) => d.data?.mostPickedTeams ?? []);

export const getTeamsPickedLog = (id: number): Promise<TeamsPickedLog[]> =>
  apiGet<{ data: { teamsPickedLog: TeamsPickedLog[] } }>(
    `/teams-picked-log?api-key=TESTAPIKEY&tournament-id=${id}`,
  ).then((d) => d.data?.teamsPickedLog ?? []);

export const getLeastPickedTeams = (id: number): Promise<MostPickedTeams[]> =>
  apiGet<{ data: { leastPickedTeams: MostPickedTeams[] } }>(
    `/least-picked-teams?api-key=TESTAPIKEY&tournament-id=${id}`,
  ).then((d) => d.data?.leastPickedTeams ?? []);

export const getTeamsNotPickedLog = (id: number): Promise<TeamsNotPicked[]> =>
  apiGet<{ data: { teamsNotPickedLog: TeamsNotPicked[] } }>(
    `/teams-not-picked-log?api-key=TESTAPIKEY&tournament-id=${id}`,
  ).then((d) => d.data?.teamsNotPickedLog ?? []);

export const getSeedPickTotal = (id: number): Promise<unknown[]> =>
  apiGet<{ data: { seedPickTotals: unknown[] } }>(
    `/seed-pick-totals?api-key=TESTAPIKEY&tournament-id=${id}`,
  ).then((d) => d.data?.seedPickTotals ?? []);

export const getPortfolioSeedSelections = (id: number): Promise<unknown[]> =>
  apiGet<{ data: { portfolioSeedSelections: unknown[] } }>(
    `/portfolio-seed-selections?api-key=TESTAPIKEY&tournament-id=${id}`,
  ).then((d) => d.data?.portfolioSeedSelections ?? []);
