import { apiEnv } from "@/lib/axios";
import { isAxiosError } from "axios";
import { CreatePortfolio, PortfolioComplete, User } from "../types";

export const getPortfolios = async (
  id: User["id"],
  tournamentId: User["id"],
) => {
  try {
    const url = `/participants/${id}/portfolios?tournament_id=${tournamentId}&sport=ncaa`;
    const { data } = await apiEnv(url, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });

    if (!data.portfolios) {
      return [];
    }
    if (data.portfolios) {
      return data?.portfolios;
    }
  } catch (error) {
    console.error("Error fetching portfolios:", error);
    return [];
  }
};

export const getTeamsMale = async () =>
  // sport: User["id"]

  {
    try {
      // const url = `/sports/${sport}/teams`;
      // const url = `/sports/1/teams`;
      const url = `/tournaments/1/teams?sport=ncaa&show_all=false`;

      // const url = `/sports/${sport}/teams/dynamics?tournament_id=3&portfolio_id=566`;
      const { data } = await apiEnv.get(url, {
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
      });
      // console.log(data);

      if (data.teams) {
        return data.teams;
      }
    } catch (error) {
      if (isAxiosError(error) && error.response)
        throw new Error(error.response.data.error);
      return;
    }
  };

export const getTeamsAvailable = async (
  sport: User["id"],
  tournamentId: User["id"],
) => {
  // console.log(sport, tournamentId);
  try {
    const url = `/sports/${sport}/teams/not-available?tournament_id=${tournamentId}`;
    const { data } = await apiEnv.get(url, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });
    console.log(data);

    if (data.teams) {
      return data.teams;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const postNewPortfolio = async (data: CreatePortfolio) => {
  console.log("postNewPortfolio called with:", data);
  const url = "/portfolios";

  const response = await apiEnv.post(url, data, {
    headers: { "Content-Type": "application/json;charset=utf-8" },
  });

  return response.data?.message || "Successfully saved portfolio";
};

export const removeportfolio = async ({
  portId,
}: {
  portId: PortfolioComplete["id"];
}) => {
  const urlRemovePortfolio = `/portfolios/${portId}`;

  try {
    const { data } = await apiEnv.delete(urlRemovePortfolio, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });
    console.log(data);
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const getDATTOU = async (tournamentId: User["id"]) => {
  try {
    const url = `/tournaments/${tournamentId}/parameters?key=DATTOU`;
    const { data } = await apiEnv(url, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });

    if (!data.value) {
      return "Error";
    }

    if (data.value) {
      return data.value;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const getHOUTOU = async (tournamentId: User["id"]) => {
  try {
    const url = `/tournaments/${tournamentId}/parameters?key=HOUTOU`;
    const { data } = await apiEnv(url, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });
    if (!data.value) {
      return "Error";
    }

    if (data.value) {
      return data.value;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const getWinnerOfTeam = async (tournamentId: User["id"]) => {
  try {
    // const url = `/winner-of-team?api-key=TESTAPIKEY&limit=99`;
    const url = `/tournaments/${tournamentId}/winner-of-team?sport=ncaa&limit=99`;
    const { data } = await apiEnv(url, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });

    if (!data.teams) {
      return "Error";
    }

    if (data.teams) {
      return data.teams;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const getWinnerOfTeamHasTeam = async (
  tournamentId: User["id"],
  id: string,
) => {
  try {
    // const url = `/winner-of-team-has-team?api-key=TESTAPIKEY&id=${id}`;
    const url = `/tournaments/${tournamentId}/winner-of-team-has-team?sport=ncaa&winner_of_team_id=${id}`;
    const { data } = await apiEnv(url, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });
    // console.log(data);

    if (!data.teams) {
      return "Error";
    }

    if (data.teams) {
      return data.teams;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response)
      console.error("getWinnerOfTeamHasTeam error:", error.response.data.error);
    return [];
  }
};
