import { apiEnv } from "@/lib/axios";
import { isAxiosError } from "axios";
import {
  CreatePortfolio,
  PortfolioComplete,
  Portfolios,
  User,
} from "../../types";

export const getPortfolios = async (id: User["id"]) => {
  try {
    const url = `/participants/${id}/portfolios?tournament_id=3`;
    const { data } = await apiEnv(url, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });

    if (data.success === false) {
      return [];
    }
    if (data.success) {
      return data?.data?.portfolios;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const getTeams = async () => { 
  try {    
    // const url = `/sports/${sport}/teams`;
    const url = `/sports/2/teams/dynamics?tournament_id=3&portfolio_id=566`;
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
  tournamentId: User["id"]
) => {
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
  portId,
}: // portfolios,
// userId,
{
  port: CreatePortfolio;
  // portfolios: Portfolios;
  portId: User["id"];
}) => {
  // if (portfolios?.length > 8) return;
  // console.log(port, userId);

  const payload = { ...port };
  if (portId && Array.isArray(port.teamsId)) {
    payload.teamsId = port.teamsId.map((team) =>
      typeof team === "object" && "id" in team ? { id: team.id } : { id: team }
    );
  }

  const url = `/portfolios${portId ? `/${portId}` : ""}`;
  try {
    const { data } = portId
      ? await apiEnv.put(url, portId ? { teams: payload.teams } : payload, {
          headers: {
            "Content-Type": "application/json;charset=utf-8",
          },
        })
      : await apiEnv.post(url, portId ? { teams: payload.teams } : payload, {
          headers: {
            "Content-Type": "application/json;charset=utf-8",
          },
        });
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
    const { data } = await apiEnv.post(
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
    const url = `/tournaments/0/parameters?key=RECODE`;
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
    const url = `/tournaments/0/parameters?key=HOUTOU`;
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
