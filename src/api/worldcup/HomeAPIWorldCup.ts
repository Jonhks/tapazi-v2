import { apiEnv } from "@/lib/axios";
import { isAxiosError } from "axios";

// TODO: Actualizar sportId cuando el back confirme el ID de Copa del Mundo
// Por ahora usa el mismo patrón de endpoints que ncaa-male

export const getTournamentWorldCup = async (sportId: string) => {
  try {
    const url = `/sports/${sportId}/tournaments`;
    const { data } = await apiEnv(url, {
      headers: { "Content-Type": "application/json;charset=utf-8" },
    });
    if (!data.tournaments) return [];
    if (data.tournaments) return data.tournaments;
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const getScores = async (
  tournamentId: string,
  participantId: string,
) => {
  try {
    // TODO: Verificar si el endpoint cambia para worldcup (sport param)
    const url = `/tournaments/${5}/score/home?participant_id=${participantId}&sport=ncaa`;
    const { data } = await apiEnv(url, {
      headers: { "Content-Type": "application/json;charset=utf-8" },
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
      headers: { "Content-Type": "application/json;charset=utf-8" },
    });
    if (data.value) return data.value;
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
      headers: { "Content-Type": "application/json;charset=utf-8" },
    });
    if (!data.value) return [{ value: 0 }];
    if (data.value) return data.value;
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
      headers: { "Content-Type": "application/json;charset=utf-8" },
    });
    if (!data.data) return "Error";
    if (data.data) return data.data;
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
      headers: { "Content-Type": "application/json;charset=utf-8" },
    });
    if (!data.data) return "Error";
    if (data.data) return data.data;
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const gatPayout = async (tournamentId: string) => {
  try {
    const url = `/tournaments/${tournamentId}/payouts?portfolios=223`;
    const { data } = await apiEnv(url, {
      headers: { "Content-Type": "application/json;charset=utf-8" },
    });
    if (!data.payouts) return [{ payouts: 0 }];
    if (data.payouts) return data.payouts;
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
      headers: { "Content-Type": "application/json;charset=utf-8" },
    });
    if (!data.instructions) return [];
    if (data.instructions) return data.instructions;
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};
