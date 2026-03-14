import { apiGet } from "@/lib/apiClient";

export const getStatsEpl = ({ week }: { week: string }) =>
  apiGet<{ data: unknown[] }>(
    `tournaments/3/score/stats/portfolio?week=${week}`,
  ).then((d) => d.data ?? []);

export const getScoreWeeksEpl = ({ tournamentId }: { tournamentId: string }) =>
  apiGet<{ weeks: unknown[] }>(
    `tournaments/${tournamentId}/score/weeks`,
  ).then((d) => d.weeks ?? []);
