/**
 * API de historial NCAA Femenino.
 * Las funciones históricas son re-exports desde shared/ReportsAPI
 * con sus nombres originales (sufijo Female).
 * getTournaments apunta al sport ID 3 (NCAA Female).
 */
import { getTournaments as getTournamentsShared } from "@/api/shared/TournamentsAPI";

// ─── Torneo NCAA Femenino (sport ID 3) ───────────────────────────────────────
export const getTournaments = () => getTournamentsShared("3");

// ─── Re-exports desde shared con nombres originales (Female) ─────────────────
export {
  getTeamsPerYearLog as getTeamsPerYearLogFemale,
  getTeamsPerfectPortfolios as getTeamsPerfectPortfoliosFemale,
  getTeamsHistoricAllRounds as getTeamsHistoricAllRoundsFemale,
} from "@/api/shared/ReportsAPI";

// ─── Funciones legacy / sin uso activo ───────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getScorePPR = async (_id: unknown) => {
  // Endpoint no disponible — función mantenida por compatibilidad
};

export const getScoreHistory = () => {
  // Endpoint legacy comentado — función mantenida por compatibilidad
};
