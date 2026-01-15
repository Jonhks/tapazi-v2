import { apiEnv } from "@/lib/axios";
import { isAxiosError } from "axios";

export const getSports = async () => {
  try {
    const url = "/sports";
    // const url = "/participants/login";
    const { data } = await apiEnv(url, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });
    if (!data.sports) {
      return "Error en sports";
    }

    if (data.sports) {
      return data.sports;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const getSportsDisponible = async (participant_id: string) => {
  try {
    const url = `/participants/${participant_id}/sports`;
    const { data } = await apiEnv(url, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });
    if (!data.sports) {
      return "Error en sports";
    }

    if (data.sports) {
      return data.sports;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};
