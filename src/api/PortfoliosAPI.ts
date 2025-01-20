import api from "@/lib/axios";
import { isAxiosError } from "axios";
import { CreatePortfolio, PortfolioComplete, Portfolios, User } from "../types";

export const getPortfolios = async (id: User["id"]) => {
  try {
    const url = `/portfolios?api-key=TESTAPIKEY&participant-id=${id}`;
    const { data } = await api(url, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });

    if (data.success === false) {
      return [];
    }
    if (data.success) {
      return data?.data?.portfolios;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const getTeams = async () => {
  try {
    const url = `/teams?api-key=TESTAPIKEY&show-all=false`;
    const { data } = await api(url, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });

    if (data.success) {
      return data.data.teams;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const postNewPortfolio = async ({
  port,
  portfolios,
  userId,
}: {
  port: CreatePortfolio;
  portfolios: Portfolios;
  userId: User["id"];
}) => {
  if (portfolios?.length >= 8) return;
  const urlLogin = `/portfolios/register?api-key=TESTAPIKEY&participant-id=${userId}`;
  const postPortfolio = {
    championshipPoints: Number(port?.championshipPoints),
    teams: port?.teamsId,
  };
  try {
    const { data } = await api.post(urlLogin, postPortfolio, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });
    console.log(data);

    if (
      !data.success &&
      data?.error?.description ===
        "Can't register portfolio, tournament already started."
    ) {
      return "Can't register portfolio, tournament already started.";
    }

    if (data.success) {
      return "Successfully created portfolio";
    }
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const removeportfolio = async ({
  portId,
  portfolios,
  userId,
}: {
  portId: PortfolioComplete["id"];
  portfolios: Portfolios;
  userId: User["id"];
}) => {
  const urlRemovePortfolio = `/portfolios/remove?api-key=TESTAPIKEY&portfolio-id=${portId}&participant-id=${userId}`;
  const newData = [...portfolios];

  newData.filter((el) => el?.id !== portId);
  const postPortfolio = {
    championshipPoints: 123,
    teams: [
      {
        id: 1,
      },
      {
        id: 12,
      },
      {
        id: 13,
      },
      {
        id: 14,
      },
      {
        id: 15,
      },
      {
        id: 16,
      },
      {
        id: 17,
      },
      {
        id: 18,
      },
    ],
  };
  try {
    const { data } = await api.post(
      urlRemovePortfolio,
      JSON.stringify(postPortfolio),
      {
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
      }
    );
    console.log(data);
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};
