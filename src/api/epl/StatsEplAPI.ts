import { apiEnv } from "@/lib/axios";
import { isAxiosError } from "axios";

export const getStatsEpl = async () => {
  try {
    const url = `tournaments/3/score/stats/portfolio?week=6`;
    const { data } = await apiEnv.get(url, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });
    // console.log(data);

    if (data.data) {
      return data.data;
    } else {
      return [];
    }


  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};