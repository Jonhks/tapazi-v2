import { apiGet } from "@/lib/apiClient";
import { PayOut } from "@/types/index";

export type AllPortfoliosEplResponse = {
  participants: number;
  portfolios: number;
};

export const getPayoutEpl = (
  tournamentId: string,
  portfolioCount: number,
): Promise<PayOut[]> =>
  apiGet<{ payouts: PayOut[] }>(
    `/tournaments/${tournamentId}/payouts?portfolios=${portfolioCount}`,
  ).then((d) => d.payouts ?? []);

export const getParticipantsEpl = (tournamentId: string): Promise<number> =>
  apiGet<{ data: { participants: number } }>(
    `/tournaments/${tournamentId}/stats`,
  ).then((d) => d.data?.participants ?? 0);

export const getPoponaEpl = (): Promise<string> =>
  apiGet<{ value: string }>(`/tournaments/3/parameters?key=POPONA`).then(
    (d) => d.value ?? "",
  );

export const getHOINFOEpl = (): Promise<string> =>
  apiGet<{ value: string }>(`/tournaments/3/parameters?key=HOINFO`).then(
    (d) => d.value ?? "",
  );

export const getAllPortfoliosEpl = (): Promise<AllPortfoliosEplResponse> =>
  apiGet<{ data: AllPortfoliosEplResponse }>(`/tournaments/3/stats`).then((d) => d.data);

export const getScoreHomeEpl = (
  tournamentId: string,
  portfolioId: string,
): Promise<any> =>
  apiGet<{ score: any }>(
    `/tournaments/${tournamentId}/score/home?portfolio_id=${portfolioId}&epl`,
  ).then((d) => d.score ?? []);

export const getScorePeerWeekHomeEpl = (week: string, portfolioId: string): Promise<any[]> =>
  apiGet<{ teams: any[] }>(
    `/portfolios/${portfolioId}/per-week?week=${week}`,
  ).then((d) => d.teams ?? []);
