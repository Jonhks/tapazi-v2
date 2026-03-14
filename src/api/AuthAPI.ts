import { apiGet, apiPost } from "@/lib/apiClient";
import { User, UserForgot, UserLogin } from "types";

export const getSignUp = async (user: User) => {
  user.name = user.name.toUpperCase();
  user.surname = user.surname.toUpperCase();
  const data = await apiPost<{ message: string; error?: { description: string } }, User>(
    "/participants/signup",
    user,
  );
  if (data.message !== "success") return data.error?.description;
  return "User Registered Successfully";
};

export const getLogin = async (user: UserLogin) => {
  const formData = { user: user.email, password: user.password };
  const data = await apiPost<{ participant: User | null }, typeof formData>(
    "/participants/login",
    formData,
  );
  if (!data.participant) throw new Error("Invalid credentials");
  return data.participant;
};

export const getCountries = () =>
  apiGet<{ countries: unknown[] }>("/countries").then((d) => d.countries);

export const getStates = (countryId: User["id"]) =>
  apiGet<{ states: unknown[] }>(`/countries/${countryId}/states`).then(
    (d) => d.states,
  );

export const postForgot = async (user: UserForgot) => {
  const formData = { user: user.email };
  const data = await apiPost<{ success: boolean; data?: { states: unknown } }, typeof formData>(
    "/participants/forgot",
    formData,
  );
  return data.data?.states;
};
