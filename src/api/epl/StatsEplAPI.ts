import { apiEnv } from "@/lib/axios";
import { isAxiosError } from "axios";

export const getStatsEpl = async ({
  tournamentId,
  week,
}: {
  tournamentId: string;
  week: string;
}) => {
  try {
    const url = `tournaments/${tournamentId}/score/stats/portfolios?week=${week}`;
    const { data } = await apiEnv.get(url);
    return data.data ?? [];
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const getScoreWeeksEpl = async ({
  tournamentId,
}: {
  tournamentId: string;
}) => {
  try {
    const url = `tournaments/${tournamentId}/score/weeks`;
    const { data } = await apiEnv.get(url);
    return data.weeks ?? [];
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const getScoreSeedWeeksEpl = async ({
  tournamentId,
}: {
  tournamentId: string;
}) => {
  try {
    const url = `tournaments/${tournamentId}/score/seed/weeks?sport=epl`;
    const { data } = await apiEnv.get(url);
    return data.weeks ?? [];
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const getSchedulePerWeekEpl = async ({
  sportId,
  tournamentId,
  week,
}: {
  sportId: string;
  tournamentId: string;
  week: string;
}) => {
  try {
    const url = `sports/${sportId}/teams/schedule-per-week?sport=epl&tournament_id=${tournamentId}&week=${week}`;
    const { data } = await apiEnv.get(url);
    if (Array.isArray(data)) return data;
    return (
      data?.schedule ??
      data?.schedule_per_week ??
      data?.data ??
      data?.matches ??
      data?.games ??
      []
    );
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return [];
  }
};

export const getSeedPerWeekEpl = async ({
  sportId,
  tournamentId,
  week,
}: {
  sportId: string;
  tournamentId: string;
  week: string;
}) => {
  try {
    const url = `sports/${sportId}/teams/seed-per-week?sport=epl&tournament_id=${tournamentId}&week=${week}`;
    const { data } = await apiEnv.get(url);
    if (Array.isArray(data)) return data;
    return (
      data?.teams ??
      data?.seed_per_week ??
      data?.data ??
      data?.seeds ??
      []
    );
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return [];
  }
};
