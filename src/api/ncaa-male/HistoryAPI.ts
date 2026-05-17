/**
 * API de historial NCAA Masculino.
 * Las funciones de /reports/* se re-exportan desde shared/ReportsAPI.
 * getTournaments está preconfigurado con el sport ID 1 (NCAA Male).
 */
import { getTournaments as getTournamentsShared } from "@/api/shared/TournamentsAPI";
import { Tournament } from "@/types/index";

// ─── Re-exports desde shared ─────────────────────────────────────────────────
export {
  getTeamsPerYearLog,
  getTeamsPerfectPortfolios,
  getTeamsHistoricAllRounds,
  getHistoricalPerfectPortfoliosHistory,
  getTeamsPickedLogHistory,
} from "@/api/shared/ReportsAPI";

// ─── Torneo NCAA Masculino (sport ID 1) ──────────────────────────────────────
/** Devuelve los torneos de NCAA Masculino (sport_id = 1). */
export const getTournaments = () => getTournamentsShared("1");

// ─── Funciones legacy / sin uso activo ───────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getScorePPR = async (_id: Tournament["id"]) => {
  // Endpoint no disponible — función mantenida por compatibilidad
};

export const getScoreHistory = () => {
  // Endpoint legacy comentado — función mantenida por compatibilidad
};
