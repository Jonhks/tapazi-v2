import { apiGet } from "@/lib/apiClient";
import { Sport } from "@/types/index";

export const getSports = () =>
  apiGet<{ sports: Sport[] }>("/sports").then((d) => d.sports ?? []);

export const getSportsDisponible = (participant_id: string) =>
  apiGet<{ sports: { id: number; enabled: boolean }[] }>(
    `/participants/${participant_id}/sports`,
  ).then((d) => d.sports ?? []);
