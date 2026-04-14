import { apiEnv } from "@/lib/axios";
import { isAxiosError } from "axios";
// import { User } from "../types";

export const getTeamsPicked = async (tournamentId: number, round: number) => {
  try {
    const url = `/tournaments/${tournamentId}/score/stats?sport=ncaa&round=${round}&order=1`;
    const { data } = await apiEnv(url, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });

    // console.log(data);

    return data.stats ?? [];
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return [];
  }
};

export const getScoreWeeksMale = async (tournamentId: number) => {
  try {
    const url = `/tournaments/${tournamentId}/score/weeks`;
    const { data } = await apiEnv(url, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });

    if (!data.weeks) {
      return [];
    }
    if (data.weeks) {
      return data.weeks;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const getMostPickedTeams = async (tournamentId: number) => {
  try {
    const url = `/reports/most-picked-teams?tournament_id=${tournamentId}`;
    const { data } = await apiEnv(url, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });

    if (!data.data) {
      return "Error";
    }
    if (data.data) {
      return data.data;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const getTeamsPickedLog = async (tournamentId: number) => {
  try {
    const url = `/reports/teams-picked-log?tournament_id=${tournamentId}`;
    const { data } = await apiEnv(url, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });

    if (!data.data) {
      return "Error";
    }
    if (data.data) {
      return data.data;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const getLeastPickedTeams = async (tournamentId: number) => {
  try {
    const url = `/reports/least-picked-teams?tournament_id=${tournamentId}`;
    const { data } = await apiEnv(url, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });

    if (!data.data) {
      return "Error";
    }
    if (data.data) {
      return data.data;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const getTeamsNotPickedLog = async (tournamentId: number) => {
  try {
    const url = `/reports/teams-not-picked-log?tournament_id=${tournamentId}`;
    const { data } = await apiEnv(url, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });

    if (!data.data) {
      return "Error";
    }
    if (data.data) {
      return data.data;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const getSeedPickTotal = async (tournamentId: number) => {
  try {
    const url = `/reports/seed-pick-totals?tournament_id=${tournamentId}`;
    const { data } = await apiEnv(url, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });

    if (!data.data) {
      return "Error";
    }
    if (data.data) {
      return data.data;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const getPortfolioStatsWeek = async (week: number) => {
  try {
    const url = `/tournaments/3/score/stats/portfolio?week=${week}`;
    const { data } = await apiEnv(url, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });
    return data.data ?? [];
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return [];
  }
};

export const getNcaaMaleTeams = async (tournamentId: number) => {
  try {
    const url = `/sports/2/teams?sport=ncaa&tournament_id=${tournamentId}`;
    const { data } = await apiEnv(url, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });
    return data.teams ?? [];
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return [];
  }
};

export const getPortfolioSeedSelections = async (tournamentId: number) => {
  try {
    const url = `/reports/portfolio-seed-selections?tournament_id=${tournamentId}`;
    const { data } = await apiEnv(url, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });

    if (!data.data) {
      return "Error";
    }
    if (data.data) {
      return data.data;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};
