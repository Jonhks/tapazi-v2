import { apiEnv } from "@/lib/axios";
import { isAxiosError } from "axios";
// import { User } from "../types";

export const getInstructionsFemale = async () => {
  try {
    const url = `tournaments/5/instructions`;
    const { data } = await apiEnv(url);
    
    // console.log(data);
    if (!data.instructions) {
      return [];
    }
    if (data.instructions) {
      return data.instructions;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};