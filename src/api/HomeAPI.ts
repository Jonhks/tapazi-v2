import { apiEnv } from "@/lib/axios";
import { isAxiosError } from "axios";
// import { User } from "../types";


export const getTournamentMale = async (id: string) => {
  try {
    const url = `/sports/${id}/tournaments`;
    const { data } = await apiEnv(url, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });
    if(!data.tournaments) {
      return [];
    }
    if(data.tournaments) {
      return data.tournaments;
    }
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }  
}

export const getScores = async (
  tournamentId: string,
  participantId: string,
) => {
  try {
    // const url = `/score/home?api-key=TESTAPIKEY&participant-id=${id}`;
    const url = `/tournaments/${tournamentId}/score/home?participant_id=${participantId}&sport=ncaa`;
    const { data } = await apiEnv(url, {
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

export const getPopona = async (tournamentId: string) => {
  try {
    const url = `/tournaments/${tournamentId}/parameters?key=POPONA`;
    const { data } = await apiEnv(url, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });
    if (data.value) {
      return data.value;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const getHOINFO = async (tournamentId: string) => {
  try {
    const url = `/tournaments/${tournamentId}/parameters?key=HOINFO`;
    const { data } = await apiEnv(url, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });

    if (!data.value) {
      return [{ value: 0 }];
    }

    if (data.value) {
      return data.value;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const getParticipants = async (tournamentId: string) => {
  try {
    const url = `/tournaments/${tournamentId}/stats`;
    const { data } = await apiEnv(url, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });

    if (!data.data) {
      return "Error";
    }

    if (data.data) {
      return data.data;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const getPortfoliosCount = async (tournamentId: string) => {
  try {
    const url = `/tournaments/${tournamentId}/stats`;
    const { data } = await apiEnv(url, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });

    if (!data.data) {
      return "Error";
    }

    if (data.data) {
      return data.data;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const gatPayout = async (tournamentId: string) => {
  try {
    const url = `/tournaments/${tournamentId}/payouts?portfolios=99`;
    const { data } = await apiEnv(url, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });
    // console.log(data, "payouyt data");
    if (!data.payouts) {
      return [{ payouts: 0 }];
    }

    if (data.payouts) {
      return data.payouts;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const getInstructions = async (tournamentId: string) => {

  try {
    const url = `tournaments/${tournamentId}/instructions`;
    const { data } = await apiEnv(url, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });

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
