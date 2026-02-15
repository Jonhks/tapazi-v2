import { apiEnv } from "@/lib/axios";
import { isAxiosError } from "axios";
import {
  PortfolioComplete,
  Portfolios,
  User,
  PortfolioToSave,
} from "../../types";

export const getPortfoliosFemale = async (
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
    // console.log(data);

    if (!data.portfolios) {
      return [];
    }
    return data.portfolios;
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const getTeamsFemale = async (tournamentId: User["id"]) => {
  try {
    const url = `/tournaments/${tournamentId}/teams?sport=ncaa&show_all=false`;
    // const url = `/sports/3/teams?sport=ncaa&tournament_id=${tournamentId}`;
    const { data } = await apiEnv.get(url, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });
    // console.log(data);
    if (!data.teams) {
      return [];
    }

    return data.teams;
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

export const postNewPortfolio = async (data: PortfolioToSave) => {
  const url = "/portfolios";
  try {
    const { data: responseData } = await apiEnv.post(url, data, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });

    if (
      !responseData.message &&
      responseData?.error?.description ===
        "Can't register portfolio, tournament already started."
    ) {
      return "Can't register portfolio, tournament already started.";
    }

    if (responseData.message === "success") {
      return "Successfully created portfolio";
    }
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error || error.response.data.message);
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
      },
    );
    console.log(data);
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const getDATTOUFemale = async (tournamentId: User["id"]) => {
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

export const getHOUTOUFemale = async (tournamentId: User["id"]) => {
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
