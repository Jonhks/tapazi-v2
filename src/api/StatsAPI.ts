import api from "@/lib/axios";
import { isAxiosError } from "axios";
import { User } from "../types";

export const getTeamsPicked = async (
  id: User["id"],
  round: User["id"],
  order: User["id"]
) => {
  if (round === "0") {
    round = "1";
  }

  try {
    const url = `/score/history?api-key=TESTAPIKEY&tournament-id=${id}&round=${round}&order=${order}`;
    const { data } = await api(url, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });

    if (!data.success) {
      return "Error";
    }
    if (data.success) {
      return data.data.history;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const getMostPickedTeams = async (id: number) => {
  try {
    const url = `/most-picked-teams?api-key=TESTAPIKEY&tournament-id=${id}`;
    const { data } = await api(url, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });

    if (!data.success) {
      return "Error";
    }
    if (data.success) {
      return data.data.mostPickedTeams;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const getTeamsPickedLog = async (id: number) => {
  try {
    const url = `/teams-picked-log?api-key=TESTAPIKEY&tournament-id=${id}`;
    const { data } = await api(url, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });

    if (!data.success) {
      return "Error";
    }
    if (data.success) {
      return data.data.teamsPickedLog;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const getLeastPickedTeams = async (id: number) => {
  try {
    const url = `/least-picked-teams?api-key=TESTAPIKEY&tournament-id=${id}`;
    const { data } = await api(url, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });

    if (!data.success) {
      return "Error";
    }
    if (data.success) {
      return data.data.leastPickedTeams;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const getTeamsNotPickedLog = async (id: number) => {
  try {
    const url = `/teams-not-picked-log?api-key=TESTAPIKEY&tournament-id=${id}`;
    const { data } = await api(url, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });

    if (!data.success) {
      return "Error";
    }
    if (data.success) {
      return data.data.teamsNotPickedLog;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const getSeedPickTotal = async (id: number) => {
  try {
    const url = `/seed-pick-totals?api-key=TESTAPIKEY&tournament-id=${id}`;
    const { data } = await api(url, {
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

export const getPortfolioSeedSelections = async (id: number) => {
  try {
    const url = `/portfolio-seed-selections?api-key=TESTAPIKEY&tournament-id=${id}`;
    const { data } = await api(url, {
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
