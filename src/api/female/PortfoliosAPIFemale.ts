import { apiGet, apiPost, apiDelete } from "@/lib/apiClient";
import { PortfolioComplete, User, PortfolioToSave } from "../../types";

export const getPortfoliosFemale = (
  id: User["id"],
  tournamentId: User["id"],
) =>
  apiGet<{ portfolios: unknown[] }>(
    `/participants/${id}/portfolios?tournament_id=${tournamentId}&sport=ncaa`,
  )
    .then((d) => d.portfolios ?? [])
    .catch(() => []);

export const getTeamsFemale = (tournamentId: User["id"]) =>
  apiGet<{ teams: unknown[] }>(
    `/tournaments/${tournamentId}/teams?sport=ncaa&show_all=false`,
  ).then((d) => d.teams ?? []);

export const getTeamsAvailable = (
  sport: User["id"],
  tournamentId: User["id"],
) =>
  apiGet<{ teams: unknown[] }>(
    `/sports/${sport}/teams/not-available?tournament_id=${tournamentId}`,
  ).then((d) => d.teams ?? []);

export const postNewPortfolio = async (data: PortfolioToSave) => {
  const result = await apiPost<
    { message?: string; error?: { description: string } },
    PortfolioToSave
  >("/portfolios", data);

  if (
    !result.message &&
    result.error?.description ===
      "Can't register portfolio, tournament already started."
  ) {
    return "Can't register portfolio, tournament already started.";
  }
  if (result.message === "success") return "Successfully created portfolio";
};

export const removeportfolioFemale = ({
  portId,
}: {
  portId: PortfolioComplete["id"];
}) => apiDelete(`/portfolios/${portId}`);

export const getDATTOUFemale = (tournamentId: User["id"]) =>
  apiGet<{ value: string }>(
    `/tournaments/${tournamentId}/parameters?key=DATTOU`,
  ).then((d) => d.value);

export const getHOUTOUFemale = (tournamentId: User["id"]) =>
  apiGet<{ value: string }>(
    `/tournaments/${tournamentId}/parameters?key=HOUTOU`,
  ).then((d) => d.value);

export const getWinnerOfTeam = (tournamentId: User["id"]) =>
  apiGet<{ teams: unknown[] }>(
    `/tournaments/${tournamentId}/winner-of-team?sport=ncaa&limit=99`,
  ).then((d) => d.teams ?? []);

export const getWinnerOfTeamHasTeam = (id: string) =>
  apiGet<{ data: { winnerOfTeamHasTeam: unknown[] } }>(
    `/winner-of-team-has-team?api-key=TESTAPIKEY&id=${id}`,
  ).then((d) => d.data?.winnerOfTeamHasTeam ?? []);
