import { apiEnv } from "@/lib/axios";
import { isAxiosError } from "axios";

// TODO: Confirmar con el back los endpoints específicos de worldcup para stats

export const getStatsWorldCup = async (tournamentId: string) => {
  try {
    const url = `/tournaments/${tournamentId}/stats`;
    const { data } = await apiEnv(url);
    if (!data.data) return "Error";
    if (data.data) return data.data;
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};
