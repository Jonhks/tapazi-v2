import { apiEnv } from "@/lib/axios";
import { isAxiosError } from "axios";
import { User } from "../../types";

export const getInstructionsEpl = async (id: User["id"]) => {
  try {
    const url = `/tournaments/${id}/instructions`;
    const { data } = await apiEnv(url);

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
