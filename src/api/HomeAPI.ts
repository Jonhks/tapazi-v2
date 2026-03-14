import { apiGet } from "@/lib/apiClient";
import { PayOut, OtherScores, ParticipantsScores, Tournament } from "@/types/index";

export type ScoresResponse = {
  score: {
    participant: ParticipantsScores[];
    others: OtherScores[];
  };
};

export const getTournamentMale = (id: string): Promise<Tournament[]> =>
  apiGet<{ tournaments: Tournament[] }>(
    `/sports/${id}/tournaments`,
  ).then((d) => d.tournaments ?? []);

export const getScores = (tournamentId: string, participantId: string): Promise<ScoresResponse> =>
  apiGet<ScoresResponse>(
    `/tournaments/${tournamentId}/score/home?participant_id=${participantId}&sport=ncaa`,
  );

export const getPopona = (tournamentId: string): Promise<string> =>
  apiGet<{ value: string }>(
    `/tournaments/${tournamentId}/parameters?key=POPONA`,
  ).then((d) => d.value ?? "");

export const getHOINFO = (tournamentId: string): Promise<string> =>
  apiGet<{ value: string }>(
    `/tournaments/${tournamentId}/parameters?key=HOINFO`,
  ).then((d) => d.value ?? "");

export const getParticipants = (tournamentId: string): Promise<{ participants: number; portfolios: number }> =>
  apiGet<{ data: { participants: number; portfolios: number } }>(
    `/tournaments/${tournamentId}/stats`,
  ).then((d) => d.data);

export const getPortfoliosCount = (tournamentId: string): Promise<{ participants: number; portfolios: number }> =>
  apiGet<{ data: { participants: number; portfolios: number } }>(
    `/tournaments/${tournamentId}/stats`,
  ).then((d) => d.data);

export const gatPayout = (tournamentId: string): Promise<PayOut[]> =>
  apiGet<{ payouts: PayOut[] }>(
    `/tournaments/${tournamentId}/payouts?portfolios=99`,
  ).then((d) => d.payouts ?? []);

export const getInstructions = (tournamentId: string): Promise<unknown[]> =>
  apiGet<{ instructions: unknown[] }>(
    `tournaments/${tournamentId}/instructions`,
  ).then((d) => d.instructions ?? []);
