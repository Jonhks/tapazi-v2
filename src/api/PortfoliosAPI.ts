import { apiEnv } from "@/lib/axios";
import { isAxiosError } from "axios";
import { CreatePortfolio, PortfolioComplete, User } from "../types";

export const getPortfolios = async (id: User["id"]) => {
  try {
    const url = `/participants/${id}/portfolios?tournament_id=1&sport=ncaa`;
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

// {
//     "tournament_id": 1,
//     "participant_id": "2",
//     "championship_points": 2,
//     "teams": [
//         {
//             "id": 7,
//             "seed": 1,
//             "streak_multiplier": 1
//         },
//         {
//             "id": 9,
//             "seed": 1,
//             "streak_multiplier": 1
//         },
//         {
//             "id": 11,
//             "seed": 1,
//             "streak_multiplier": 1
//         },
//         {
//             "id": 13,
//             "seed": 1,
//             "streak_multiplier": 1
//         },
//         {
//             "id": 14,
//             "seed": 1,
//             "streak_multiplier": 1
//         },
//         {
//             "id": 16,
//             "seed": 1,
//             "streak_multiplier": 1
//         },
//         {
//             "id": 18,
//             "seed": 1,
//             "streak_multiplier": 1
//         },
//         {
//             "id": 20,
//             "seed": 1,
//             "streak_multiplier": 1
//         }
//     ]
// }
