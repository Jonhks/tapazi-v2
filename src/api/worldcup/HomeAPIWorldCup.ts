import { apiGet } from "@/lib/apiClient";
import { OtherScores, ParticipantsScores, PayOut } from "@/types/index";

type ScoreHome = {
  participant: ParticipantsScores[];
  others: OtherScores[];
};

export const getTournamentWorldCup = (sportId: string) =>
  apiGet<{ tournaments: { id: string; current_round: number }[] }>(
    `/sports/${sportId}/tournaments`,
  ).then((d) => d.tournaments ?? []);

export const getPoponaWorldCup = (tournamentId: string) =>
  apiGet<{ value: string }>(`/tournaments/${tournamentId}/parameters?key=POPONA`)
    .then((d) => d.value ?? "");

export const getHOINFOWorldCup = (tournamentId: string) =>
  apiGet<{ value: string }>(`/tournaments/${tournamentId}/parameters?key=HOINFO`)
    .then((d) => d.value ?? "");

export const getParticipantsWorldCup = (tournamentId: string) =>
  apiGet<{ data: { participants: number; portfolios: number } }>(
    `/tournaments/${tournamentId}/stats`,
  ).then((d) => d.data);

export const getPayoutWorldCup = (tournamentId: string) =>
  apiGet<{ payouts: PayOut[] }>(
    `/tournaments/${tournamentId}/payouts?portfolios=99`,
  ).then((d) => d.payouts ?? []);

export const getScoresWorldCup = (tournamentId: string, participantId: string) =>
  apiGet<{ score: ScoreHome }>(
    `/tournaments/${tournamentId}/score/home?participant_id=${participantId}&sport=worldcup`,
  ).then((d) => d.score);
