import { apiEnv } from "@/lib/axios";
import { isAxiosError } from "axios";
import { User, UserForgot, UserLogin } from "types";

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
    const url = "/participants/login";
    const { data } = await apiEnv.post(url, formData);

    if (!data.participant) {
      return "error";
    }
    if (data.participant) {
      // console.log(data.participant);
      return data.participant;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
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
