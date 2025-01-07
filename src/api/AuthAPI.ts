import api from "@/lib/axios";
import { isAxiosError } from "axios";
import { User } from "types";

export const getSignUp = async (user: User) => {
  // const data =

  console.log(api);
  console.log(user);

  try {
    // const url = "/auth/create-account";
    // const { data } = await api.post<string>(url, formData);
    // return data;
  } catch (error) {
    if (isAxiosError(error) && error.response)
      throw new Error(error.response.data.error);
    return;
  }
};
