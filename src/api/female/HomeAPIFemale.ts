/**
 * API del Home NCAA Femenino.
 * getTournamentFemale, getHOINFOFemale, getPoponaFemale y getParticipantsFemale
 * usan funciones genéricas de shared/.
 */
import { apiEnv } from "@/lib/axios";
import { isAxiosError } from "axios";
import {
  getTournaments,
  getParticipants as getParticipantsShared,
  getParameter,
} from "@/api/shared/TournamentsAPI";

// ─── Re-exports con nombres originales (Female) ──────────────────────────────

export const getTournamentFemale = (id: string) => getTournaments(id);

export const getParticipantsFemale = (tournamentId: string) =>
  getParticipantsShared(tournamentId);

export const getPoponaFemale = (tournamentId: string) =>
  getParameter(tournamentId, "POPONA");

export const getHOINFOFemale = async (tournamentId: string) => {
  const value = await getParameter(tournamentId, "HOINFO");
  return value ?? [{ value: 0 }];
};

// ─── Funciones específicas de NCAA Female Home ───────────────────────────────

export const getScoresFemale = async (
  tournamentId: string,
  participantId: string,
) => {
  try {
    const { data } = await apiEnv(
      `/tournaments/${tournamentId}/score/home?participant_id=${participantId}&sport=ncaa`,
    );
    return data.score ?? [];
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const gatPayoutFemale = async (tournamentId: string) => {
  try {
    const { data } = await apiEnv(
      `/tournaments/${tournamentId}/payouts?portfolios=25`,
    );
    return data.payouts ?? [{ payouts: 0 }];
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};
