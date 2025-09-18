import { newApi } from "@/lib/axios";
import { isAxiosError } from "axios";
import { User } from "../../types";

export const getInstructionsEpl = async (id: User["id"]) => {
  try {
    const url = `/tournaments/${id}/instructions`;
    const { data } = await newApi(url, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });

    if (!data.instructions) {
      return [];
    }
    if (data.instructions) {
      return data?.instructions;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};
