import { apiGet } from "@/lib/apiClient";
import { PayOut } from "@/types/index";

export const getTournamentFemale = (id: string) =>
  apiGet<{ tournaments: { id: string; current_round: number }[] }>(
    `/sports/${id}/tournaments`,
  ).then((d) => d.tournaments ?? []);

export const getScoresFemale = (tournamentId: string, participantId: string) =>
  apiGet<{ score: unknown }>(
    `/tournaments/${tournamentId}/score/home?participant_id=${participantId}&sport=ncaa`,
  ).then((d) => d.score);

export const getPoponaFemale = (tournamentId: string) =>
  apiGet<{ value: string }>(
    `/tournaments/${tournamentId}/parameters?key=POPONA`,
  ).then((d) => d.value ?? "");

export const getHOINFOFemale = (tournamentId: string) =>
  apiGet<{ value: string }>(
    `/tournaments/${tournamentId}/parameters?key=HOINFO`,
  ).then((d) => d.value ?? "");

export const getParticipantsFemale = (tournamentId: string) =>
  apiGet<{ data: { participants: number; portfolios: number } }>(
    `/tournaments/${tournamentId}/stats`,
  ).then((d) => d.data);

export const gatPayoutFemale = (tournamentId: string) =>
  apiGet<{ payouts: PayOut[] }>(
    `/tournaments/${tournamentId}/payouts?portfolios=99`,
  ).then((d) => d.payouts ?? []);
