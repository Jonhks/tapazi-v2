import { apiGet } from "@/lib/apiClient";

export interface WeekEpl {
  week: number;
  label: string;
}

export const getStatsEpl = ({ week }: { week: string }): Promise<any[]> =>
  apiGet<{ data: any[] }>(
    `tournaments/3/score/stats/portfolio?week=${week}`,
  ).then((d) => d.data ?? []);

export const getScoreWeeksEpl = ({ tournamentId }: { tournamentId: string }): Promise<WeekEpl[]> =>
  apiGet<{ weeks: WeekEpl[] }>(
    `tournaments/${tournamentId}/score/weeks`,
  ).then((d) => d.weeks ?? []);
