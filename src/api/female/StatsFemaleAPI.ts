/**
 * API de estadísticas NCAA Femenino.
 * Las funciones de /reports/* son re-exports desde shared/ReportsAPI
 * con los nombres originales (sufijo Female) para no cambiar los views.
 * getTournaments apunta al sport ID 3 (NCAA Female).
 */
import { getTournaments as getTournamentsShared } from "@/api/shared/TournamentsAPI";

// ─── Torneo NCAA Femenino (sport ID 3) ───────────────────────────────────────
export const getTournaments = () => getTournamentsShared("3");

// ─── Re-exports desde shared con nombres originales (Female) ─────────────────
export {
  getTeamsPicked as getTeamsPickedFemale,
  getMostPickedTeams as getMostPickedTeamsFemale,
  getLeastPickedTeams as getLeastPickedTeamsFemale,
  getTeamsNotPickedLog as getTeamsNotPickedLogFemale,
  getTeamsPickedLog as getTeamsPickedLogFemale,
  getSeedPickTotal as getSeedPickTotalFemale,
  getPortfolioSeedSelections as getPortfolioSeedSelectionsFemale,
} from "@/api/shared/ReportsAPI";
