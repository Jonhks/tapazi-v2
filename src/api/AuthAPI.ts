import api from "@/lib/axios";
import { isAxiosError } from "axios";
import { User, UserForgot, UserLogin } from "types";

export const getSignUp = async (user: User) => {
  user.name = user.name.toUpperCase();
  try {
    const url = "/participants/register?api-key=TESTAPIKEY";
    const { data } = await api.post(url, user, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });

    if (!data.success) {
      return data.error.description;
    }

    if (data.success) {
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
  try {
    const url = "/participants/login?api-key=TESTAPIKEY";
    const { data } = await api.post(url, formData, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });

    if (!data.success) {
      return data.error.description;
    }

    if (data.success) {
      return data;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};

export const getStates = async () => {
  try {
    const url = "/states?api-key=TESTAPIKEY";
    const { data } = await api(url);
    if (data.success) {
      return data.data.states;
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
    const url = "/participants/forgot?api-key=TESTAPIKEY";
    const { data } = await api.post(url, formData);
    if (data.success) {
      return data.data.states;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};
