import { newApi } from "@/lib/axios";
import { isAxiosError } from "axios";
import { User, UserForgot, UserLogin } from "types";

export const getSignUp = async (user: User) => {
  user.name = user.name.toUpperCase();
  user.surname = user.surname.toUpperCase();
  try {
    const url = "/participants/signup";
    // const url = "/participants/login";
    const { data } = await newApi.post(url, user, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });

    if (data.message !== "success") {
      return data.error.description;
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
    user: user.email,
    password: user.password,
  };
  // console.log(formData);

  try {
    const url = "/participants/login";
    const { data } = await newApi.post(url, formData, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });

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
    const { data } = await newApi(url);
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
    const { data } = await newApi(url);
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
    const { data } = await newApi.post(url, formData);
    if (data.success) {
      return data.data.states;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};
