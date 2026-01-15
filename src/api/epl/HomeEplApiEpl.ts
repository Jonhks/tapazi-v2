import { apiEnv } from "@/lib/axios";
import { isAxiosError } from "axios";
import {
  // CreatePortfolio,
  // PortfolioComplete,
  // Portfolios,
  User,
} from "../../types";

export const getPayoutEpl = async (
  tournamentId: User["id"],
  portfolioCount: number
) => {
  try {
    const url = `/tournaments/${tournamentId}/payouts?portfolios=${portfolioCount}`;
    const { data } = await apiEnv(url, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });

    if (!data.payouts) {
      return "Error payouts";
    }
    if (data.payouts) {
      return data?.payouts;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const getParticipantsEpl = async (tournamentId: User["id"]) => {
  try {
    const url = `/tournaments/${tournamentId}/stats`;
    const { data } = await apiEnv(url, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });

    if (!data.data.participants) {
      return 0;
    }
    if (data.data.participants) {
      return data?.data.participants;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const getPoponaEpl = async () => {
  try {
    const url = `/tournaments/3/parameters?key=POPONA`;
    const { data } = await apiEnv(url, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });
    // console.log("getPoponaEpl", data);

    if (!data.value) {
      return "Error popona";
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

export const getHOINFOEpl = async () => {
  try {
    const url = `/tournaments/3/parameters?key=HOINFO`;
    const { data } = await apiEnv(url, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });
    // console.log("Hinfo", data);

    if (!data.value) {
      return "Error Hinfo";
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

export const getAllPortfoliosEpl = async () => {
  try {
    const url = `/tournaments/3/stats`;
    const { data } = await apiEnv(url, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });

    if (!data.data) {
      return [];
    }
    if (data.data) {
      return data?.data;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const getScoreHomeEpl = async (
  tournamentId: User["id"],
  portfolioId: string
) => {
  try {
    const url = `/tournaments/${tournamentId}/score/home?portfolio_id=${portfolioId}`;
    const { data } = await apiEnv(url, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });
    // console.log(data);

    if (!data.score) {
      return [];
    }
    if (data.score) {
      return data?.score;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const getScorePeerWeekHomeEpl = async (
  week: string,
  portfolioId: string
) => {
  try {
    const url = `/portfolios/${portfolioId}/per-week?week=${week}`;
    const { data } = await apiEnv(url, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });
    // console.log(data);

    if (!data.teams) {
      return "Error teams";
    }
    if (data.teams) {
      return data?.teams;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};
