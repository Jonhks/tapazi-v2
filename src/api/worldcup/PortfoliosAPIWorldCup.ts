import { apiEnv } from "@/lib/axios";
import { isAxiosError } from "axios";
import { PortfolioToSave, User } from "@/types/index";

export const getPortfoliosWorldCup = async (
  participantId: string,
  tournamentId: string,
) => {
  try {
    const url = `/participants/${participantId}/portfolios?tournament_id=${tournamentId}&sport=world-cup`;
    const { data } = await apiEnv(url);
    if (!data.portfolios) return [];
    return data.portfolios;
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return [];
  }
};

export const getTeamsWorldCup = async (tournamentId: User["id"]) => {
  try {
    const url = `/tournaments/${tournamentId}/teams?sport=world-cup&show_all=false`;
    const { data } = await apiEnv.get(url);
    if (!data.teams) return [];
    return data.teams;
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const getDATTOUWorldCup = async (tournamentId: User["id"]) => {
  try {
    const url = `/tournaments/${tournamentId}/parameters?key=DATTOU`;
    const { data } = await apiEnv(url);
    if (!data.value) return "Error";
    return data.value;
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const getHOUTOUWorldCup = async (tournamentId: User["id"]) => {
  try {
    const url = `/tournaments/${tournamentId}/parameters?key=HOUTOU`;
    const { data } = await apiEnv(url);
    if (!data.value) return "Error";
    return data.value;
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const getWinnerOfTeamWorldCup = async (tournamentId: User["id"]) => {
  try {
    const url = `/tournaments/${tournamentId}/winner-of-team?sport=world-cup&limit=99`;
    const { data } = await apiEnv(url);
    if (!data.teams) return [];
    return data.teams;
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const getWinnerOfTeamHasTeamWorldCup = async (
  tournamentId: string,
  teamId: string,
) => {
  try {
    const url = `/tournaments/${tournamentId}/winner-of-team-has-team?team_id=${teamId}`;
    const { data } = await apiEnv(url);
    if (!data.teams) return [];
    return data.teams;
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const postNewPortfolioWorldCup = async (data: PortfolioToSave) => {
  try {
    const { data: responseData } = await apiEnv.post("/portfolios", data);
    if (responseData.message === "success")
      return "Successfully created portfolio";
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error || error.response.data.message);
    return;
  }
};

export const removePortfolioWorldCup = async ({
  portId,
}: {
  portId: number;
}) => {
  try {
    await apiEnv.delete(`/portfolios/${portId}`);
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};
