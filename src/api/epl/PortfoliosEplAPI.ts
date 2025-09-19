import { api, newApi } from "@/lib/axios";
import { isAxiosError } from "axios";
import {
  CreatePortfolio,
  PortfolioComplete,
  Portfolios,
  User,
} from "../../types";

export const getPortfoliosEpl = async (id: User["id"], portfolioId: string) => {
  try {
    const url =
      portfolioId !== "0"
        ? `/participants/${id}/portfolios?tournament_id=3&portfolio_id=${portfolioId}`
        : `/participants/${id}/portfolios?tournament_id=3`;
    // const url = `/participants/${id}/portfolios?tournament_id=3&portfolio_id=${portfolioId}`;
    const { data } = await newApi(url, {
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
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    console.log(error);
    return;
  }
};

export const getTeamsEpl = async (sport: User["id"]) => {
  try {
    const url = `/sports/${sport}/teams`;
    const { data } = await newApi.get(url, {
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

export const getNumberTEAMXP = async () => {
  try {
    const url = `tournaments/3/parameters?key=TEAMXP`;
    const { data } = await newApi.get(url, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });
    // console.log(data);

    if (!data.value) {
      return 0;
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

export const getTournamentsId = async () => {
  try {
    const url = `sports/2/tournaments`;
    const { data } = await newApi.get(url, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });
    // console.log(data);

    if (!data.tournaments) {
      return 0;
    }

    if (data.tournaments) {
      return data.tournaments;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const getTeamsDynamic = async (
  sport: User["id"],
  portfolioId: string
) => {
  portfolioId = portfolioId || "0";
  try {
    // const url = `/sports/${sport}/teams`;
    const url = `/sports/${sport}/teams/dynamics?tournament_id=3&portfolio_id=${portfolioId}`;
    const { data } = await newApi.get(url, {
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

export const getTeamsNotAvailable = async (
  sport: User["id"],
  tournamentId: User["id"]
) => {
  try {
    // const url = `/sports/${sport}/teams`;
    const url = `/sports/${sport}/teams/not-available?tournament_id=${tournamentId}`;
    const { data } = await newApi.get(url, {
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

export const postNewPortfolioEpl = async ({
  port,
}: {
  port: CreatePortfolio;
}) => {
  const urlLogin = `/portfolios`;
  try {
    const { data } = await newApi.post(urlLogin, port, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });
    console.log(data);
    if (
      !data.message &&
      data?.error?.description ===
        "Can't register portfolio, tournament already started."
    ) {
      return "Can't register portfolio, tournament already started.";
    }

    if (data.message === "success") {
      return "Successfully created portfolio";
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
    const { data } = await newApi.put(
      urlLogin,
      { teams: port },
      {
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
      }
    );
    console.log(data);
    if (
      !data.message &&
      data?.error?.description ===
        "Can't register portfolio, tournament already started."
    ) {
      return "Can't register portfolio, tournament already started.";
    }

    if (data.message === "success") {
      return "Successfully created portfolio";
    }
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
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
    const { data } = await api.post(
      urlRemovePortfolio,
      JSON.stringify(postPortfolio),
      {
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
      }
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
    const { data } = await api(url, {
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
    const { data } = await api(url, {
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
    const { data } = await api(url, {
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
    const { data } = await api(url, {
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

export const getTeamsDynamics = async (id: string, portfolioId: string) => {
  try {
    const url = `/sports/${id}/teams/dynamics?tournament_id=3&portfolio_id=${portfolioId}`;
    const { data } = await api(url, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });
    console.log(data);

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
