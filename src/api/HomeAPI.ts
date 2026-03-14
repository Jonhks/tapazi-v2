import { apiGet } from "@/lib/apiClient";
import { PayOut } from "@/types/index";

export const getTournamentMale = (id: string) =>
  apiGet<{ tournaments: { id: string; current_round: number }[] }>(
    `/sports/${id}/tournaments`,
  ).then((d) => d.tournaments ?? []);

export const getScores = (tournamentId: string, participantId: string) =>
  apiGet(
    `/tournaments/${tournamentId}/score/home?participant_id=${participantId}&sport=ncaa`,
  );

export const getPopona = (tournamentId: string) =>
  apiGet<{ value: string }>(
    `/tournaments/${tournamentId}/parameters?key=POPONA`,
  ).then((d) => d.value ?? "");

export const getHOINFO = (tournamentId: string) =>
  apiGet<{ value: string }>(
    `/tournaments/${tournamentId}/parameters?key=HOINFO`,
  ).then((d) => d.value ?? "");

export const getParticipants = (tournamentId: string) =>
  apiGet<{ data: { participants: number; portfolios: number } }>(
    `/tournaments/${tournamentId}/stats`,
  ).then((d) => d.data);

export const getPortfoliosCount = (tournamentId: string) =>
  apiGet<{ data: { participants: number; portfolios: number } }>(
    `/tournaments/${tournamentId}/stats`,
  ).then((d) => d.data);

export const gatPayout = (tournamentId: string) =>
  apiGet<{ payouts: PayOut[] }>(
    `/tournaments/${tournamentId}/payouts?portfolios=99`,
  ).then((d) => d.payouts ?? []);

export const getInstructions = (tournamentId: string) =>
  apiGet<{ instructions: unknown[] }>(
    `tournaments/${tournamentId}/instructions`,
  ).then((d) => d.instructions ?? []);
