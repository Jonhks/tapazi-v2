import { apiEnv } from "@/lib/axios";
import { isAxiosError } from "axios";
import { User, UserForgot, UserLogin } from "@/types";

export interface ShowTermsOfUseResponse {
  enable_terms_of_use: boolean;
  accepted_terms_of_use: boolean;
  tournament_id?: number;
}

export interface TermsEntry {
  description: string;
  highlighted?: boolean;
}

export const getSignUp = async (user: User) => {
  user.name = user.name.toUpperCase();
  user.surname = user.surname.toUpperCase();
  user.email = user.email.toLowerCase();
  user.username = user.username.toLowerCase();
  console.log(user);
  try {
    const url = "/participants/signup";
    // const url = "/participants/login";
    const { data } = await apiEnv.post(url, user);

    if (data.error) {
      throw new Error(data.error);
    }

    if (data.message === "success") {
      return "User Registered Successfully";
    }
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const getLogin = async (user: UserLogin) => {
  const formData = {
    user: user.email.toLowerCase(),
    password: user.password,
  };

  try {
    const { data } = await apiEnv.post("/participants/login", formData);
    if (!data.participant) throw new Error("Invalid credentials");
    return data.participant;
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    throw error;
  }
};

export const getCountries = async () => {
  try {
    const url = "/countries";
    const { data } = await apiEnv(url);
    if (data.countries) {
      return data.countries;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const getStates = async (countryId: User["id"]) => {
  try {
    const url = `/countries/${countryId}/states`;
    const { data } = await apiEnv(url);
    if (data.states) {
      return data.states;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

/** GET /participants/:id/show-terms-of-use?sport=wc */
export const getShowTermsOfUseWC = async (
  participantId: string,
): Promise<ShowTermsOfUseResponse> => {
  try {
    const { data } = await apiEnv(
      `/participants/${participantId}/show-terms-of-use?sport=wc`,
    );
    const payload = data.data ?? data;
    return {
      enable_terms_of_use: payload.enable_terms_of_use ?? false,
      accepted_terms_of_use: payload.accepted_terms_of_use ?? false,
      tournament_id: payload.tournament_id,
    };
  } catch {
    return { enable_terms_of_use: false, accepted_terms_of_use: false };
  }
};

/** GET /sports/4/tournaments — obtiene el torneo activo de WC cuando show-terms no devuelve tournament_id */
export const getActiveWCTournamentId = async (): Promise<
  number | undefined
> => {
  try {
    const { data } = await apiEnv(`/sports/4/tournaments`);
    return data.tournaments?.[0]?.id;
  } catch {
    return undefined;
  }
};

/** GET /tournaments/:id/terms-of-use?sport=wc */
export const getTermsOfUseWC = async (
  tournamentId: string,
): Promise<TermsEntry[]> => {
  try {
    const { data } = await apiEnv(
      `/tournaments/${tournamentId}/terms-of-use?sport=wc`,
    );
    if (Array.isArray(data.data)) return data.data;
    if (Array.isArray(data.terms)) return data.terms;
    if (Array.isArray(data)) return data;
    return [];
  } catch {
    return [];
  }
};

/** POST /participants/:id/accept-terms-of-use?sport=wc */
export const postAcceptTermsOfUseWC = async (
  participantId: string,
): Promise<void> => {
  try {
    await apiEnv.post(
      `/participants/${participantId}/accept-terms-of-use?sport=wc`,
    );
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error ?? error.response.data.message);
    throw error;
  }
};

export const postForgot = async (user: UserForgot) => {
  const formData = {
    user: user.email,
  };
  try {
    const url = "/participants/forgot";
    const { data } = await apiEnv.post(url, formData);
    if (data.success) {
      return data.data.states;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};
