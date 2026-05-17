/**
 * API del Home NCAA Masculino.
 * getTournamentMale y getParticipants usan funciones genéricas de shared/.
 * getPopona / getHOINFO usan getParameter con sus claves respectivas.
 */
import { apiEnv } from "@/lib/axios";
import { isAxiosError } from "axios";
import {
  getTournaments,
  getParticipants as getParticipantsShared,
  getParameter,
} from "@/api/shared/TournamentsAPI";

// ─── Re-exports con nombres originales ───────────────────────────────────────

/** Torneos NCAA Masculino (sport_id = 2). */
export const getTournamentMale = (id: string) => getTournaments(id);

/** Participantes / stats de un torneo. */
export const getParticipants = (tournamentId: string) =>
  getParticipantsShared(tournamentId);

/** Idéntico a getParticipants — consolidado en shared. */
export const getPortfoliosCount = (tournamentId: string) =>
  getParticipantsShared(tournamentId);

/** Parámetro POPONA del torneo. */
export const getPopona = (tournamentId: string) =>
  getParameter(tournamentId, "POPONA");

/** Parámetro HOINFO del torneo. */
export const getHOINFO = async (tournamentId: string) => {
  const value = await getParameter(tournamentId, "HOINFO");
  return value ?? [{ value: 0 }];
};

// ─── Funciones específicas de NCAA Male Home ─────────────────────────────────

export const getScores = async (
  tournamentId: string,
  participantId: string,
) => {
  try {
    const { data } = await apiEnv(
      `/tournaments/${tournamentId}/score/home?participant_id=${participantId}&sport=ncaa`,
    );
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const gatPayout = async (tournamentId: string) => {
  try {
    const { data } = await apiEnv(
      `/tournaments/${tournamentId}/payouts?portfolios=99`,
    );
    return data.payouts ?? [{ payouts: 0 }];
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const getInstructions = async (tournamentId: string) => {
  try {
    const { data } = await apiEnv(`tournaments/${tournamentId}/instructions`);
    return data.instructions ?? [];
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};
