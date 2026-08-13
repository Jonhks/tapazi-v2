import { apiEnv } from "@/lib/axios";
import { isAxiosError } from "axios";
import { User } from "../../types";

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

export const getPayoutNfl = async (
  tournamentId: User["id"],
  portfolioCount: number,
) => {
  try {
    const url = `/tournaments/${tournamentId}/payouts?portfolios=${portfolioCount}`;
    const { data } = await apiEnv(url);
    return data.payouts ?? "Error payouts";
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const getParticipantsNfl = async (tournamentId: User["id"]) => {
  try {
    const url = `/tournaments/${tournamentId}/stats`;
    const { data } = await apiEnv(url);
    return data.data?.participants ?? 0;
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const getPoponaNfl = async (tournamentId: string) => {
  try {
    const url = `/tournaments/${tournamentId}/parameters?key=POPONA`;
    const { data } = await apiEnv(url);
    return data.value ?? "Error popona";
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const getHOINFONfl = async (tournamentId: string) => {
  try {
    const url = `/tournaments/${tournamentId}/parameters?key=HOINFO`;
    const { data } = await apiEnv(url);
    return data.value ?? "Error Hinfo";
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const getAllPortfoliosNfl = async (tournamentId: string) => {
  try {
    const url = `/tournaments/${tournamentId}/stats`;
    const { data } = await apiEnv(url);
    return data.data ?? [];
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const getScoreHomeNfl = async (
  tournamentId: User["id"],
  participantId: string,
) => {
  try {
    const url = `/tournaments/${tournamentId}/score/home?participant_id=${participantId}&sport=nfl`;
    const { data } = await apiEnv(url);
    return data.score ?? [];
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const getScorePeerWeekHomeNfl = async (
  week: string,
  portfolioId: string,
) => {
  try {
    const url = `/portfolios/${portfolioId}/per-week?week=${week}`;
    const { data } = await apiEnv(url);
    return data.teams ?? "Error teams";
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};
