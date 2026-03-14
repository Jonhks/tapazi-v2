import { apiGet } from "@/lib/apiClient";
import { PayOut, Tournament, ParticipantsScores, OtherScores } from "@/types/index";

export type ScoresFemaleResponse = {
  participant: ParticipantsScores[];
  data: {
    others: OtherScores[];
  };
};

export const getTournamentFemale = (id: string): Promise<Tournament[]> =>
  apiGet<{ tournaments: Tournament[] }>(
    `/sports/${id}/tournaments`,
  ).then((d) => d.tournaments ?? []);

export const getScoresFemale = (tournamentId: string, participantId: string): Promise<ScoresFemaleResponse> =>
  apiGet<{ score: ScoresFemaleResponse }>(
    `/tournaments/${tournamentId}/score/home?participant_id=${participantId}&sport=ncaa`,
  ).then((d) => d.score);

export const getPoponaFemale = (tournamentId: string): Promise<string> =>
  apiGet<{ value: string }>(
    `/tournaments/${tournamentId}/parameters?key=POPONA`,
  ).then((d) => d.value ?? "");

export const getHOINFOFemale = (tournamentId: string): Promise<string> =>
  apiGet<{ value: string }>(
    `/tournaments/${tournamentId}/parameters?key=HOINFO`,
  ).then((d) => d.value ?? "");

export const getParticipantsFemale = (tournamentId: string): Promise<{ participants: number; portfolios: number }> =>
  apiGet<{ data: { participants: number; portfolios: number } }>(
    `/tournaments/${tournamentId}/stats`,
  ).then((d) => d.data);

export const gatPayoutFemale = (tournamentId: string): Promise<PayOut[]> =>
  apiGet<{ payouts: PayOut[] }>(
    `/tournaments/${tournamentId}/payouts?portfolios=99`,
  ).then((d) => d.payouts ?? []);
