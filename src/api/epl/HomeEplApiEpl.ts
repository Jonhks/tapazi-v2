import { apiGet } from "@/lib/apiClient";
import { PayOut } from "@/types/index";
import { User } from "../../types";

export const getPayoutEpl = (
  tournamentId: User["id"],
  portfolioCount: number,
) =>
  apiGet<{ payouts: PayOut[] }>(
    `/tournaments/${tournamentId}/payouts?portfolios=${portfolioCount}`,
  ).then((d) => d.payouts ?? []);

export const getParticipantsEpl = (tournamentId: User["id"]) =>
  apiGet<{ data: { participants: number } }>(
    `/tournaments/${tournamentId}/stats`,
  ).then((d) => d.data?.participants ?? 0);

export const getPoponaEpl = () =>
  apiGet<{ value: string }>(`/tournaments/3/parameters?key=POPONA`).then(
    (d) => d.value ?? "",
  );

export const getHOINFOEpl = () =>
  apiGet<{ value: string }>(`/tournaments/3/parameters?key=HOINFO`).then(
    (d) => d.value ?? "",
  );

export const getAllPortfoliosEpl = () =>
  apiGet<{ data: unknown }>(`/tournaments/3/stats`).then((d) => d.data ?? []);

export const getScoreHomeEpl = (
  tournamentId: User["id"],
  portfolioId: string,
) =>
  apiGet<{ score: unknown }>(
    `/tournaments/${tournamentId}/score/home?portfolio_id=${portfolioId}&epl`,
  ).then((d) => d.score ?? []);

export const getScorePeerWeekHomeEpl = (week: string, portfolioId: string) =>
  apiGet<{ teams: unknown[] }>(
    `/portfolios/${portfolioId}/per-week?week=${week}`,
  ).then((d) => d.teams ?? []);
