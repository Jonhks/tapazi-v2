/**
 * API de portfolios NCAA Masculino.
 * getDATTOU / getHOUTOU usan getParameter desde shared/.
 */
import { apiEnv } from "@/lib/axios";
import { isAxiosError } from "axios";
import { getParameter } from "@/api/shared/TournamentsAPI";
import { CreatePortfolio, PortfolioComplete, User } from "@/types/index";

export const getPortfolios = async (
  id: User["id"],
  tournamentId: User["id"],
) => {
  try {
    const { data } = await apiEnv(
      `/participants/${id}/portfolios?tournament_id=${tournamentId}&sport=ncaa`,
    );
    return data.portfolios ?? [];
  } catch (error) {
    console.error("Error fetching portfolios:", error);
    return [];
  }
};

export const getTeamsMale = async (tournamentId: User["id"]) => {
  try {
    const { data } = await apiEnv.get(
      `/tournaments/${tournamentId}/teams?sport=ncaa&show_all=false`,
    );
    return data.teams ?? undefined;
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const getTeamsAvailable = async (
  sport: User["id"],
  tournamentId: User["id"],
) => {
  try {
    const { data } = await apiEnv.get(
      `/sports/${sport}/teams/not-available?tournament_id=${tournamentId}`,
    );
    return data.teams ?? undefined;
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const postNewPortfolio = async (data: CreatePortfolio) => {
  const response = await apiEnv.post("/portfolios", data);
  return response.data?.message ?? "Successfully saved portfolio";
};

export const removeportfolio = async ({
  portId,
}: {
  portId: PortfolioComplete["id"];
}) => {
  try {
    await apiEnv.delete(`/portfolios/${portId}`);
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

/** Parámetro DATTOU del torneo. */
export const getDATTOU = (tournamentId: User["id"]) =>
  getParameter(String(tournamentId), "DATTOU");

/** Parámetro HOUTOU del torneo. */
export const getHOUTOU = (tournamentId: User["id"]) =>
  getParameter(String(tournamentId), "HOUTOU");

export const getWinnerOfTeam = async (tournamentId: User["id"]) => {
  try {
    const { data } = await apiEnv(
      `/tournaments/${tournamentId}/winner-of-team?sport=ncaa&limit=99`,
    );
    return data.teams ?? "Error";
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const getWinnerOfTeamHasTeam = async (
  tournamentId: User["id"],
  id: string,
) => {
  try {
    const { data } = await apiEnv(
      `/tournaments/${tournamentId}/winner-of-team-has-team?sport=ncaa&winner_of_team_id=${id}`,
    );
    return data.teams ?? "Error";
  } catch (error) {
    if (isAxiosError(error) && error.response)
      console.error("getWinnerOfTeamHasTeam error:", error.response.data.error);
    return [];
  }
};
