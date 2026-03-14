import { apiGet } from "@/lib/apiClient";

export const getTournaments = (id: string) =>
  apiGet<{ tournaments: { id: string; current_round: number }[] }>(
    `/sports/${id}/tournaments`,
  ).then((d) => d.tournaments ?? []);
