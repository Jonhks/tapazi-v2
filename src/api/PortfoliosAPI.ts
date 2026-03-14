import { apiGet, apiPost, apiDelete } from "@/lib/apiClient";
import { CreatePortfolio, User } from "../types";

export const getPortfolios = (id: User["id"], tournamentId: User["id"]) =>
  apiGet<{ portfolios: unknown[] }>(
    `/participants/${id}/portfolios?tournament_id=${tournamentId}&sport=ncaa`,
  )
    .then((d) => d.portfolios ?? [])
    .catch(() => []);

export const getTeamsMale = (tournamentId: User["id"]) =>
  apiGet<{ teams: unknown[] }>(
    `/tournaments/${tournamentId}/teams?sport=ncaa&show_all=false`,
  ).then((d) => d.teams ?? []);

export const getTeamsAvailable = (
  sport: User["id"],
  tournamentId: User["id"],
) =>
  apiGet<{ teams: unknown[] }>(
    `/sports/${sport}/teams/not-available?tournament_id=${tournamentId}`,
  ).then((d) => d.teams ?? []);

export const postNewPortfolio = async (data: CreatePortfolio) => {
  const result = await apiPost<{ message?: string }, CreatePortfolio>(
    "/portfolios",
    data,
  );
  return result?.message || "Successfully saved portfolio";
};

export const removeportfolio = ({ portId }: { portId: number | undefined }) =>
  apiDelete(`/portfolios/${portId}`);

export const getDATTOU = (tournamentId: User["id"]) =>
  apiGet<{ value: string }>(
    `/tournaments/${tournamentId}/parameters?key=DATTOU`,
  ).then((d) => d.value);

export const getHOUTOU = (tournamentId: User["id"]) =>
  apiGet<{ value: string }>(
    `/tournaments/${tournamentId}/parameters?key=HOUTOU`,
  ).then((d) => d.value);

export const getWinnerOfTeam = (tournamentId: User["id"]) =>
  apiGet<{ teams: unknown[] }>(
    `/tournaments/${tournamentId}/winner-of-team?sport=ncaa&limit=99`,
  ).then((d) => d.teams ?? []);

export const getWinnerOfTeamHasTeam = (
  tournamentId: User["id"],
  id: string,
) =>
  apiGet<{ teams: unknown[] }>(
    `/tournaments/${tournamentId}/winner-of-team-has-team?sport=ncaa&winner_of_team_id=${id}`,
  )
    .then((d) => d.teams ?? [])
    .catch(() => []);
