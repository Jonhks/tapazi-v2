import { apiEnv } from "@/lib/axios";
import { isAxiosError } from "axios";
import { CreatePortfolio, User } from "../../types";

export const getPortfoliosNfl = async (
  id: User["id"],
  portfolioId: string,
  tournamentId: string,
) => {
  try {
    const url =
      portfolioId !== "0"
        ? `/participants/${id}/portfolios?tournament_id=${tournamentId}&portfolio_id=${portfolioId}&sport=nfl`
        : `/participants/${id}/portfolios?tournament_id=${tournamentId}&sport=nfl`;
    const { data } = await apiEnv(url);
    return data.portfolios ?? [];
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const getTeamsNfl = async (sport: User["id"], tournamentId: string) => {
  try {
    const url = `/sports/${sport}/teams?sport=nfl&tournament_id=${tournamentId}`;
    const { data } = await apiEnv.get(url);

    if (data.teams) {
      return data.teams;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const getNumberTEAMXP = async (tournamentId: string) => {
  try {
    const url = `tournaments/${tournamentId}/parameters?key=TEAMXP`;
    const { data } = await apiEnv.get(url);
    return data.value ?? 0;
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const getTournamentsId = async (sportId: string) => {
  try {
    const url = `sports/${sportId}/tournaments`;
    const { data } = await apiEnv.get(url);
    return data.tournaments ?? [];
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const getTeamsNotAvailable = async (
  sport: User["id"],
  tournamentId: User["id"],
) => {
  try {
    const url = `/sports/${sport}/teams/not-available?tournament_id=${tournamentId}`;
    const { data } = await apiEnv.get(url);

    if (data.teams) {
      return data.teams;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const postNewPortfolioNfl = async ({
  port,
}: {
  port: CreatePortfolio;
}) => {
  const urlLogin = `/portfolios`;

  try {
    const { data } = await apiEnv.post(urlLogin, port);
    if (
      !data.message &&
      data?.error?.description ===
        "Can't register portfolio, tournament already started."
    ) {
      return "Can't register portfolio, tournament already started.";
    }

    if (data.message === "success") {
      return true;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const postEditPortfolio = async ({
  port,
  portId,
}: {
  port: CreatePortfolio;
  portId: string;
}) => {
  const urlLogin = `/portfolios/${portId}`;
  try {
    const { data } = await apiEnv.put(urlLogin, { teams: port });
    if (
      !data.message &&
      data?.error?.description ===
        "Can't register portfolio, tournament already started."
    ) {
      return "Can't register portfolio, tournament already started.";
    }

    if (data.message === "success") {
      return "Successfully edited portfolio";
    }
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const getTeamsDynamics = async (
  sportId: string,
  portfolioId: string,
  tournamentId: string,
) => {
  try {
    const url = `/sports/${sportId}/teams/dynamics?tournament_id=${tournamentId}&portfolio_id=${portfolioId}`;
    const { data } = await apiEnv(url);
    return data.teams ?? "Error";
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const getParameterWeek = async (id: string, parameter: string) => {
  try {
    const url = `/tournaments/${id}/parameters?key=${parameter}`;
    const { data } = await apiEnv(url);
    return data.value ?? "Error";
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};
