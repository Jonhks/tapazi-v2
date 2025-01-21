import api from "@/lib/axios";
import { isAxiosError } from "axios";
import { Tournament } from "../types";

export const getTournaments = async () => {
  const urlGetTournaments = `/tournaments?api-key=TESTAPIKEY`;
  try {
    const { data } = await api.get(urlGetTournaments, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });
    if (data.success) {
      return data.data.tournaments;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const getScorePPR = async (id: Tournament["id"]) => {
  if (id) {
    const urlGetScorePPR = `https://ercom-b.dev:8443/com.tapaszi.ws/rest/points-per-round?api-key=TESTAPIKEY&tournament-id=${id}`;
    console.log(id);

    try {
      const { data } = await api.get(urlGetScorePPR, {
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
      });
      if (data.success) {
        return data.data.pointsPerRound;
      }
    } catch (error) {
      if (isAxiosError(error) && error.response)
        throw new Error(error.response.data.error);
      return;
    }

    //   .then((response) => {
    //     if (response?.data) {
    //       setPointsPerRound(response?.data?.data?.pointsPerRound);
    //       // setTimeout(() => setIsLoading(false), 1000);
    //     }
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  }
};
