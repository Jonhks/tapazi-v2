import { api } from "@/lib/axios";
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

export const getPopona = async () => {
  try {
    const url = `/parameters?api-key=TESTAPIKEY&parameter-key=POPONA`;
    const { data } = await api(url, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });
    if (data.success) {
      return data.data;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const getHOINFO = async () => {
  try {
    const url = `/parameters?api-key=TESTAPIKEY&parameter-key=HOINFO`;
    const { data } = await api(url, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });

    if (!data.success) {
      return [{ value: 0 }];
    }

    if (data.success) {
      return data.data;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const getParticipants = async () => {
  try {
    const url = `/participants/count?api-key=TESTAPIKEY`;
    const { data } = await api(url, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });

    if (!data.success) {
      return "Error";
    }

    if (data.success) {
      return data.data;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const getPortfoliosCount = async () => {
  try {
    const url = `/portfolios/count?api-key=TESTAPIKEY`;
    const { data } = await api(url, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });

    if (!data.success) {
      return "Error";
    }

    if (data.success) {
      return data.data;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const gatPayout = async (portfFoliosCount: number) => {
  try {
    const url = `/payout?api-key=TESTAPIKEY&portfolios=${portfFoliosCount}`;
    const { data } = await api(url, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });

    if (!data.success) {
      return [{ payout: 0 }];
    }

    if (data.success) {
      return data.data;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const getInstructions = async () => {
  try {
    const url = `/instructions?api-key=TESTAPIKEY&id=0`;
    const { data } = await api(url, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });

    if (!data.success) {
      return [{ payout: 0 }];
    }

    if (data.success) {
      return data.data.instructions;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};
