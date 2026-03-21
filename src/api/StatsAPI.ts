import { apiEnv } from "@/lib/axios";
import { isAxiosError } from "axios";
// import { User } from "../types";

export const getTeamsPicked = async (tournamentId: number, round: number) => {
  console.log(tournamentId, round);
  try {
    const url = `/tournaments/${2}/score/stats?sport=ncaa&round=${round}&order=1`; // TODO: remove this
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
  console.log(tournamentId);

  try {
    const url = `/tournaments/${3}/score/weeks`; // TODO: remove this
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
  console.log(tournamentId);

  try {
    const url = `/reports/most-picked-teams?tournament_id=${2}`; // TODO: remove this
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
  console.log(tournamentId);
  try {
    const url = `/reports/teams-picked-log?tournament_id=${2}`; // TODO: remove this
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
  console.log(tournamentId);
  try {
    const url = `/reports/least-picked-teams?tournament_id=${2}`; // TODO: remove this
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
  console.log(tournamentId);
  try {
    const url = `/reports/teams-not-picked-log?tournament_id=${2}`; // TODO: remove this
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
    const url = `/seed-pick-totals?api-key=TESTAPIKEY&tournament-id=${tournamentId}`;
    const { data } = await apiEnv(url, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });

    if (!data.success) {
      return "Error";
    }
    if (data.success) {
      return data.data.seedPickTotals;
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
  console.log(tournamentId);

  try {
    const url = `/sports/2/teams?sport=ncaa&tournament_id=${3}`; // TODO: remove this el sport es 1
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
    const url = `/portfolio-seed-selections?api-key=TESTAPIKEY&tournament-id=${tournamentId}`;
    const { data } = await apiEnv(url, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });

    if (!data.success) {
      return "Error";
    }
    if (data.success) {
      return data.data.portfolioSeedSelections;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};
