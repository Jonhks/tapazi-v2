/**
 * Funciones genéricas de torneos compartidas entre módulos.
 * Antes getTournamentMale / getTournamentFemale / getTournaments(hardcoded)
 * eran copias idénticas con sport ID hardcodeado.
 */
import { apiEnv } from "@/lib/axios";
import { isAxiosError } from "axios";

/** Devuelve los torneos de cualquier deporte por su ID. */
export const getTournaments = async (sportId: string) => {
  try {
    const { data } = await apiEnv(`/sports/${sportId}/tournaments`);
    return data.tournaments ?? [];
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return [];
  }
};

/**
 * Devuelve las estadísticas/participantes de un torneo.
 * Antes duplicada como getParticipants y getParticipantsFemale.
 */
export const getParticipants = async (tournamentId: string) => {
  try {
    const { data } = await apiEnv(`/tournaments/${tournamentId}/stats`);
    return data.data ?? "Error";
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

/**
 * Devuelve el valor de un parámetro de torneo por su clave.
 * Generaliza: getPopona(POPONA), getHOINFO(HOINFO), getDATTOU(DATTOU), getHOUTOU(HOUTOU).
 */
export const getParameter = async (tournamentId: string, key: string) => {
  try {
    const { data } = await apiEnv(
      `/tournaments/${tournamentId}/parameters?key=${key}`,
    );
    return data.value ?? null;
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};
