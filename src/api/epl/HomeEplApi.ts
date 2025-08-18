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
      return "Error participants";
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
