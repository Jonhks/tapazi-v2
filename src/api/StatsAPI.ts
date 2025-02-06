import api from "@/lib/axios";
import { isAxiosError } from "axios";
import { User } from "../types";

export const getTeamsPicked = async (order: User["id"]) => {
  try {
    const url = `/score/history?api-key=TESTAPIKEY&tournament-id=${1}&round=${1}&order=${order}`;
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
