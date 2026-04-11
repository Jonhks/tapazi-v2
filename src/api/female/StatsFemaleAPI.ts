import { apiEnv } from "@/lib/axios";
import { isAxiosError } from "axios";

export const getTournaments = async () => {
  const urlGetTournaments = `/sports/3/tournaments`;
  try {
    const { data } = await apiEnv.get(urlGetTournaments);

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

export const getTeamsPickedFemale = async (
  tournamentId: number,
  round: number,
) => {
  try {
    const url = `/tournaments/${tournamentId}/score/stats?sport=ncaa&round=${round}&order=1`;
    const { data } = await apiEnv(url);

    return data.stats ?? [];
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return [];
  }
};

export const getMostPickedTeamsFemale = async (tournamentId: number) => {
  try {
    const url = `/reports/most-picked-teams?tournament_id=${tournamentId}`;
    const { data } = await apiEnv(url);

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

export const getLeastPickedTeamsFemale = async (tournamentId: number) => {
  try {
    const url = `/reports/least-picked-teams?tournament_id=${tournamentId}`;
    const { data } = await apiEnv(url);

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

export const getTeamsNotPickedLogFemale = async (tournamentId: number) => {
  try {
    const url = `/reports/teams-not-picked-log?tournament_id=${tournamentId}`;
    const { data } = await apiEnv(url);

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

export const getTeamsPickedLogFemale = async (tournamentId: number) => {
  try {
    const url = `/reports/teams-picked-log?tournament_id=${tournamentId}`;
    const { data } = await apiEnv(url);

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

export const getSeedPickTotalFemale = async (tournamentId: number) => {
  try {
    const url = `/reports/seed-pick-totals?tournament_id=${tournamentId}`;
    const { data } = await apiEnv(url);

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

export const getPortfolioSeedSelectionsFemale = async (
  tournamentId: number,
) => {
  try {
    const url = `/reports/portfolio-seed-selections?tournament_id=${tournamentId}`;
    const { data } = await apiEnv(url);

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
