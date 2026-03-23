import { apiEnv } from "@/lib/axios";
import { isAxiosError } from "axios";
import { Tournament } from "@/types/index";

export const getTournaments = async () => {
  const urlGetTournaments = `/sports/1/tournaments`;
  try {
    const { data } = await apiEnv.get(urlGetTournaments, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });

    if (!data.tournaments) {
      return data.error.description || "Error";
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

export const getScorePPR = async (id: Tournament["id"]) => {
  if (id) {
    // const urlGetScorePPR = `/rest/points-per-round?api-key=TESTAPIKEY&tournament-id=${id}`;
    const urlGetScorePPR = "";
    try {
      const { data } = await apiEnv.get(urlGetScorePPR, {
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
      });
      if (!data.success) {
        return data.error.description || "Error";
      }

      if (data.success) {
        return data.data.pointsPerRound;
      }
    } catch (error) {
      if (isAxiosError(error) && error.response)
        throw new Error(error.response.data.error);
      return;
    }
  }
};

export const getScoreHistory = () => {
  // const urlGetScoreHistory = `/rest/score/history?api-key=TESTAPIKEY&tournament-id=${
  //   selectedTournament?.id
  // }&round=${
  //   selectedScore?.consecutive ? selectedScore?.consecutive : 8
  // }&order=${selectedOrderBy}`;
  // axios
  //   .get(urlGetScoreHistory, {
  //     headers: {
  //       "Content-Type": "application/json;charset=utf-8",
  //     },
  //   })
  //   .then((response) => {
  //     if (response?.data) {
  //       setArrHistory(response?.data?.data?.history);
  //       setTimeout(() => setIsLoading(false), 1000);
  //     }
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   });
};

export const getTeamsPerYearLogFemale = async (tournamentId: number) => {
  try {
    const url = `/reports/teams-per-year-log?tournament_id=${tournamentId}`;
    const { data } = await apiEnv(url, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });

    if (!data.data) {
      return data.error;
    }

    if (data.data) {
      return data.data;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return error;
  }
};

export const getTeamsPerfectPortfoliosFemale = async () => {
  try {
    const url = `/reports/historical-perfect-portfolios-header`;
    const { data } = await apiEnv(url, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });

    if (!data.data) {
      return data.error.description || "Error";
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

export const getTeamsHistoricAllRoundsFemale = async (orderBy = "risk") => {
  try {
    const url = `/reports/historical-all-rounds?order-by=${orderBy}`;
    const { data } = await apiEnv(url, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });
    if (!data.data) {
      return data.error.description || "Error";
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

export const getHistoricalPerfectPortfoliosHistory = async (year: number) => {
  try {
    const url = `historical-perfect-portfolios-history?api-key=TESTAPIKEY&year=${year}`;
    const { data } = await apiEnv(url, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });

    if (!data.success) {
      return data.error.description || "Error";
    }

    if (data.success) {
      return data.data.historicalPerfectPortfoliosHistory;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const getTeamsPickedLogHistory = async (year: number) => {
  try {
    const url = `teams-picked-log-history?api-key=TESTAPIKEY&year=${year}`;
    const { data } = await apiEnv(url, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });

    if (!data.success) {
      return data.error.description || "Error";
    }

    if (data.success) {
      return data.data.teamsPickedLogHistory;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};
