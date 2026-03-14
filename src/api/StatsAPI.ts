import { apiGet } from "@/lib/apiClient";
import { User } from "@/types/index";

export const getTeamsPicked = (
  id: User["id"],
  round: User["id"],
  order: User["id"],
) => {
  if (round === "0") round = "1";
  return apiGet<{ data: { stats: unknown } }>(
    `/score/stats?api-key=TESTAPIKEY&tournament-id=${id}&round=${round}&order=${order}`,
  ).then((d) => d.data?.stats);
};

export const getMostPickedTeams = (id: number) =>
  apiGet<{ data: { mostPickedTeams: unknown[] } }>(
    `/most-picked-teams?api-key=TESTAPIKEY&tournament-id=${id}`,
  ).then((d) => d.data?.mostPickedTeams ?? []);

export const getTeamsPickedLog = (id: number) =>
  apiGet<{ data: { teamsPickedLog: unknown[] } }>(
    `/teams-picked-log?api-key=TESTAPIKEY&tournament-id=${id}`,
  ).then((d) => d.data?.teamsPickedLog ?? []);

export const getLeastPickedTeams = (id: number) =>
  apiGet<{ data: { leastPickedTeams: unknown[] } }>(
    `/least-picked-teams?api-key=TESTAPIKEY&tournament-id=${id}`,
  ).then((d) => d.data?.leastPickedTeams ?? []);

export const getTeamsNotPickedLog = (id: number) =>
  apiGet<{ data: { teamsNotPickedLog: unknown[] } }>(
    `/teams-not-picked-log?api-key=TESTAPIKEY&tournament-id=${id}`,
  ).then((d) => d.data?.teamsNotPickedLog ?? []);

export const getSeedPickTotal = (id: number) =>
  apiGet<{ data: { seedPickTotals: unknown[] } }>(
    `/seed-pick-totals?api-key=TESTAPIKEY&tournament-id=${id}`,
  ).then((d) => d.data?.seedPickTotals ?? []);

export const getPortfolioSeedSelections = (id: number) =>
  apiGet<{ data: { portfolioSeedSelections: unknown[] } }>(
    `/portfolio-seed-selections?api-key=TESTAPIKEY&tournament-id=${id}`,
  ).then((d) => d.data?.portfolioSeedSelections ?? []);
