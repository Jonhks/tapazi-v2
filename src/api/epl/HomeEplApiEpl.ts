import { newApi } from "@/lib/axios";
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
    const { data } = await newApi(url, {
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
    const { data } = await newApi(url, {
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
    const { data } = await newApi(url, {
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
    const { data } = await newApi(url, {
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
    const url = `/tournaments/1/stats`;
    const { data } = await newApi(url, {
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
