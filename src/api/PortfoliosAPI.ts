import { apiEnv } from "@/lib/axios";
import { isAxiosError } from "axios";
import { CreatePortfolio, PortfolioComplete, User } from "../types";

export const getPortfolios = async (id: User["id"], tournamentId: User["id"]) => {
  try {
    const url = `/participants/${id}/portfolios?tournament_id=${tournamentId}&sport=ncaa`;
    const { data } = await apiEnv(url, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });

    if (data.portfolios === false) {
      return [];
    }
    if (data.portfolios) {
      return data?.portfolios;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const getTeamsMale = async () =>
  // sport: User["id"]

  {
    try {
      // const url = `/sports/${sport}/teams`;
      const url = `/sports/1/teams`;
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

export const getDATTOU = async () => {
  try {
    const url = `/tournaments/1/parameters?key=DATTOU`;
    const { data } = await apiEnv(url, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });

    if (!data.success) {
      return "Error";
    }

    if (data.success) {
      return data.data.value;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const getHOUTOU = async () => {
  try {
    const url = `/tournaments/1/parameters?key=HOUTOU`;
    const { data } = await apiEnv(url, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });

    if (!data.success) {
      return "Error";
    }

    if (data.success) {
      return data.data.value;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const getWinnerOfTeam = async () => {
  try {
    const url = `/winner-of-team?api-key=TESTAPIKEY&limit=99`;
    const { data } = await apiEnv(url, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });

    if (!data.success) {
      return "Error";
    }

    if (data.success) {
      return data.data.winnerOfTeam;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const getWinnerOfTeamHasTeam = async (id: string) => {
  try {
    const url = `/winner-of-team-has-team?api-key=TESTAPIKEY&id=${id}`;
    const { data } = await apiEnv(url, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });

    if (!data.success) {
      return "Error";
    }

    if (data.success) {
      return data.data.winnerOfTeamHasTeam;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};
