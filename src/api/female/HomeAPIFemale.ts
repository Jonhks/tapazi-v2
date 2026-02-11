import { apiEnv } from "@/lib/axios";
import { isAxiosError } from "axios";
// import { User } from "../types";

export const getScoresFemale = async (
  tournamentId: string,
  participantId: string,
) => {
  try {
    const url = `/tournaments/${tournamentId}/score/home?participant_id=${participantId}&sport=ncaa`;
    const { data } = await apiEnv(url, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });

    // console.log(data);
    if (!data.score) {
      return [];
    }
    if (data.score) {
      return data.score;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};
