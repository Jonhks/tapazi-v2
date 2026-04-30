import { apiEnv } from "@/lib/axios";
import { isAxiosError } from "axios";

export const getStatsEpl = async ({ week }: { week: string }) => {
  try {
    const url = `tournaments/3/score/stats/portfolio?week=${week}`;
    const { data } = await apiEnv.get(url);
    return data.data ?? [];
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const getScoreWeeksEpl = async ({
  tournamentId,
}: {
  tournamentId: string;
}) => {
  try {
    const url = `tournaments/${tournamentId}/score/weeks`;
    const { data } = await apiEnv.get(url);
    return data.weeks ?? [];
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};
