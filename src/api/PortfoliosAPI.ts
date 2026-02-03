import { apiEnv } from "@/lib/axios";
import { isAxiosError } from "axios";
import { CreatePortfolio, PortfolioComplete, Portfolios, User } from "../types";

export const getPortfolios = async (id: User["id"]) => {
  try {
    const url = `/participants/${id}/portfolios?tournament_id=2`;
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

export const postNewPortfolio = async ({
  port,
  userId,
  portId,
}: {
  port: CreatePortfolio;
  userId: string;
  portId?: string | number | null;
}) => {
  const url = portId
    ? `/portfolios/${portId}`
    : `/participants/${userId}/portfolios?tournament_id=3`;

  const teamsFormatted = (port.teams || port.teamsId || []).map((t) => {
    const id = typeof t === "object" ? t.id : t;
    return { id: Number(id) };
  });

  const payload = {
    championshipPoints: Number(port.championshipPoints || 0),
    teams: teamsFormatted,
    teamsId: teamsFormatted, // Include both just in case
  };

  try {
    const { data } = portId
      ? await apiEnv.put(url, payload, {
          headers: { "Content-Type": "application/json;charset=utf-8" },
        })
      : await apiEnv.post(url, payload, {
          headers: { "Content-Type": "application/json;charset=utf-8" },
        });

    if (
      data.id ||
      data.success ||
      data.message === "success" ||
      data.portfolios
    ) {
      return "Successfully saved portfolio";
    }

    if (data.error && typeof data.error === "object") {
      throw new Error(
        data.error.description || data.error.message || "Unknown API error",
      );
    }

    return "Successfully processed request";
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.error ||
          error.response.data.message ||
          "Request failed",
      );
    }
    throw error;
  }
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
  const urlRemovePortfolio = `/portfolios/remove?api-key=TESTAPIKEY&portfolio-id=${portId}&participant-id=${userId}`;
  const newData = [...portfolios];

  newData.filter((el) => el?.id !== portId);
  const postPortfolio = {
    championshipPoints: 123,
    teams: [
      {
        id: 1,
      },
      {
        id: 12,
      },
      {
        id: 13,
      },
      {
        id: 14,
      },
      {
        id: 15,
      },
      {
        id: 16,
      },
      {
        id: 17,
      },
      {
        id: 18,
      },
    ],
  };
  try {
    const { data } = await apiEnv.post(
      urlRemovePortfolio,
      JSON.stringify(postPortfolio),
      {
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
      },
    );
    console.log(data);
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const getDATTOU = async () => {
  try {
    const url = `/parameters?api-key=TESTAPIKEY&parameter-key=DATTOU`;
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
    const url = `/parameters?api-key=TESTAPIKEY&parameter-key=HOUTOU`;
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
