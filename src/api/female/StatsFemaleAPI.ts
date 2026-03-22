import { apiEnv } from "@/lib/axios";
import { isAxiosError } from "axios";

export const getTournaments = async () => {
  const urlGetTournaments = `/sports/3/tournaments`;
  try {
    const { data } = await apiEnv.get(urlGetTournaments, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });

    if (!data.tournaments) {
      return data.error.description || "Error";
    }

    if (data.tournaments) {
      return data.tournaments;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const getTeamsPickedFemale = async (
  tournamentId: number,
  round: number,
) => {
  try {
    const url = `/tournaments/${tournamentId}/score/stats?sport=ncaa&round=${round}&order=1`;
    const { data } = await apiEnv(url, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });

    return data.stats ?? [];
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return [];
  }
};
