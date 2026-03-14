import { apiGet, apiPost, apiPut } from "@/lib/apiClient";
import { CreatePortfolio, PortfolioComplete, Portfolios, User } from "../../types";

export const getPortfoliosEpl = (id: User["id"], portfolioId: string): Promise<{ id: number; [key: string]: any }[]> => {
  const url =
    portfolioId !== "0"
      ? `/participants/${id}/portfolios?tournament_id=3&portfolio_id=${portfolioId}&epl`
      : `/participants/${id}/portfolios?tournament_id=3&epl`;
  return apiGet<{ portfolios: { id: number; [key: string]: any }[] }>(url).then((d) => d.portfolios ?? []);
};

export const getTeamsEpl = (sport: User["id"]) =>
  apiGet<{ teams: unknown[] }>(`/sports/${sport}/teams`).then(
    (d) => d.teams ?? [],
  );

export const getNumberTEAMXP = () =>
  apiGet<{ value: unknown }>(`tournaments/3/parameters?key=TEAMXP`).then(
    (d) => d.value ?? 0,
  );

export const getTournamentsId = () =>
  apiGet<{ tournaments: { id: string; current_round: number }[] }>(
    `sports/2/tournaments`,
  ).then((d) => d.tournaments ?? []);

export const getTeamsDynamic = (sport: User["id"], portfolioId: string) => {
  portfolioId = portfolioId || "0";
  return apiGet<{ teams: unknown[] }>(
    `/sports/${sport}/teams/dynamics?tournament_id=3&portfolio_id=${portfolioId}`,
  ).then((d) => d.teams ?? []);
};

export const getTeamsNotAvailable = (
  sport: User["id"],
  tournamentId: User["id"],
) =>
  apiGet<{ teams: unknown[] }>(
    `/sports/${sport}/teams/not-available?tournament_id=${tournamentId}`,
  ).then((d) => d.teams ?? []);

export const postNewPortfolioEpl = async ({ port }: { port: CreatePortfolio }) => {
  const result = await apiPost<
    { message?: string; error?: { description: string } },
    CreatePortfolio
  >(`/portfolios`, port);

  if (
    !result.message &&
    result.error?.description ===
      "Can't register portfolio, tournament already started."
  ) {
    return "Can't register portfolio, tournament already started.";
  }
  if (result.message === "success") return true;
};

export const postEditPortfolio = async ({
  port,
  portId,
}: {
  port: CreatePortfolio;
  portId: string;
}) => {
  const result = await apiPut<
    { message?: string; error?: { description: string } },
    { teams: CreatePortfolio }
  >(`/portfolios/${portId}`, { teams: port });

  if (
    !result.message &&
    result.error?.description ===
      "Can't register portfolio, tournament already started."
  ) {
    return "Can't register portfolio, tournament already started.";
  }
  if (result.message === "success") return "Successfully edited portfolio";
};

export const removeportfolio = async ({
  portId,
  portfolios,
  userId,
}: {
  portId: PortfolioComplete["id"];
  portfolios: Portfolios;
  userId: User["id"];
}) => {
  const url = `/portfolios/remove?api-key=TESTAPIKEY&portfolio-id=${portId}&participant-id=${userId}`;
  const newData = [...portfolios].filter((el) => el?.id !== portId);
  const postPortfolio = {
    championshipPoints: 123,
    teams: [
      { id: 1 }, { id: 12 }, { id: 13 }, { id: 14 },
      { id: 15 }, { id: 16 }, { id: 17 }, { id: 18 },
    ],
  };
  void newData;
  await apiPost(url, JSON.stringify(postPortfolio));
};

export const getDATTOU = () =>
  apiGet<{ data: { value: unknown } }>(
    `/parameters?api-key=TESTAPIKEY&parameter-key=DATTOU`,
  ).then((d) => d.data?.value);

export const getHOUTOU = () =>
  apiGet<{ data: { value: unknown } }>(
    `/parameters?api-key=TESTAPIKEY&parameter-key=HOUTOU`,
  ).then((d) => d.data?.value);

export const getWinnerOfTeam = () =>
  apiGet<{ data: { winnerOfTeam: unknown[] } }>(
    `/winner-of-team?api-key=TESTAPIKEY&limit=99`,
  ).then((d) => d.data?.winnerOfTeam ?? []);

export const getWinnerOfTeamHasTeam = (id: string) =>
  apiGet<{ data: { winnerOfTeamHasTeam: unknown[] } }>(
    `/winner-of-team-has-team?api-key=TESTAPIKEY&id=${id}`,
  ).then((d) => d.data?.winnerOfTeamHasTeam ?? []);

export const getTeamsDynamics = (id: string, portfolioId: string) =>
  apiGet<{ teams: unknown[] }>(
    `/sports/${id}/teams/dynamics?tournament_id=3&portfolio_id=${portfolioId}`,
  ).then((d) => d.teams ?? []);

export const getParameterWeek = (id: string, parameter: string) =>
  apiGet<{ value: string }>(
    `/tournaments/${id}/parameters?key=${parameter}`,
  ).then((d) => d.value);
