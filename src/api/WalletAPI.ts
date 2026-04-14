import { apiEnv } from "@/lib/axios";
import { isAxiosError } from "axios";

export const getWallet = async (participantId: string) => {
  try {
    const url = `/participants/${participantId}/wallet`;
    const { data } = await apiEnv(url, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });
    if (!data.wallet) return [];
    return data.wallet;
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return [];
  }
};
