import api from "@/lib/axios";
import { isAxiosError } from "axios";
import { User } from "../types";

export const getScores = async (id: User["id"]) => {
  try {
    const url = `/score/home?api-key=TESTAPIKEY&participant-id=${id}`;
    const { data } = await api(url, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};
