import { getTournaments as getTournamentsShared } from "@/api/shared/TournamentsAPI";
import { apiEnv } from "@/lib/axios";
import { isAxiosError } from "axios";

export const getTournaments = () => getTournamentsShared("4");

export const getStatsWorldCup = async ({
  tournamentId,
  round,
}: {
  tournamentId: string;
  round: string;
}) => {
  try {
    const { data } = await apiEnv.get(
      `tournaments/${tournamentId}/score/stats/portfolios?round=${round}&sport=wc`,
    );
    return data.data ?? [];
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

// ─── Rounds dropdown ──────────────────────────────────────────────────────────
// Respuesta: [{ consecutive: 3, round: "GROUP ROUND 3" }]
//   consecutive = número para la API  |  round = display label
export const getScoreRoundsWorldCup = async ({
  tournamentId,
}: {
  tournamentId: string;
}) => {
  try {
    const { data } = await apiEnv.get(
      `tournaments/${tournamentId}/score/rounds?sport=wc`,
    );
    return data.rounds ?? [];
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};
