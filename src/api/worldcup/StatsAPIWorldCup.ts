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
//
// ENDPOINT A — score/points-per-round (activo)
//   Respuesta: [{ name: "GROUP ROUND 1", round: 1, consecutive, teams, points }]
//   En la vista: name: r.name  |  roundType = String(r.round)
//
// ENDPOINT B — score/rounds (alternativo)
//   Respuesta: [{ round: "GROUP ROUND 3" }]  ← round es string con el nombre
//   En la vista: name: r.round  |  roundType = r.round (extraer número con regex)
//
export const getScoreRoundsWorldCup = async ({
  tournamentId,
}: {
  tournamentId: string;
}) => {
  try {
    // ENDPOINT A (activo):
    const { data } = await apiEnv.get(
      `tournaments/${tournamentId}/score/points-per-round?sport=wc`,
    );
    return data.data ?? data ?? [];

    // ENDPOINT B (alternativo — descomentar y comentar bloque A):
    // const { data } = await apiEnv.get(
    //   `tournaments/${tournamentId}/score/rounds?sport=wc`,
    // );
    // return data.rounds ?? [];
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};
