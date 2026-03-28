import { apiEnv } from "@/lib/axios";
import { isAxiosError } from "axios";

// TODO: Confirmar con el back los endpoints específicos de worldcup para portfolios

export const getPortfoliosWorldCup = async (
  tournamentId: string,
  participantId: string,
) => {
  try {
    const url = `/tournaments/${tournamentId}/portfolios?participant_id=${participantId}`;
    const { data } = await apiEnv(url, {
      headers: { "Content-Type": "application/json;charset=utf-8" },
    });
    if (!data.data) return "Error";
    if (data.data) return data.data;
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};
