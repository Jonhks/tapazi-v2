import { apiEnv } from "@/lib/axios";
import { isAxiosError } from "axios";

export const getTournaments = async (id: string) => {
  const urlGetTournaments = `/sports/${id}/tournaments`;
  try {
    const { data } = await apiEnv.get(urlGetTournaments);

    if (!data.tournaments) {
      return "Error";
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
