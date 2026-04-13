import { apiEnv } from "@/lib/axios";
import { isAxiosError } from "axios";
import { User } from "../../types";

export const getPayoutEpl = async (
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

export const getParticipantsEpl = async (tournamentId: User["id"]) => {
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

export const getPoponaEpl = async () => {
  try {
    const url = `/tournaments/3/parameters?key=POPONA`;
    const { data } = await apiEnv(url);
    return data.value ?? "Error popona";
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const getHOINFOEpl = async () => {
  try {
    const url = `/tournaments/3/parameters?key=HOINFO`;
    const { data } = await apiEnv(url);
    return data.value ?? "Error Hinfo";
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const getAllPortfoliosEpl = async () => {
  try {
    const url = `/tournaments/3/stats`;
    const { data } = await apiEnv(url);
    return data.data ?? [];
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const getScoreHomeEpl = async (
  tournamentId: User["id"],
  portfolioId: string,
) => {
  try {
    const url = `/tournaments/${tournamentId}/score/home?portfolio_id=${portfolioId}&epl`;
    const { data } = await apiEnv(url);
    return data.score ?? [];
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const getScorePeerWeekHomeEpl = async (
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
