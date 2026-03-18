import { User } from "../types";
import { useParams } from "react-router-dom";

export const useAuth = () => {
  const userData = localStorage.getItem("userTapaszi");
  const params = useParams();
  const userId = params.userId;

  if (!userData) return false;

  try {
    const user: User = JSON.parse(userData);
    return !!(user.email && user.id.toString() === userId);
  } catch (error) {
    console.error("Error parsing user data from localStorage", error);
    return false;
  }
};

// export const userExist = async () => {
//   let exist = { success: false, data: { id: "" } };
//   const datoProv = localStorage.getItem("datoProv")
//     ? JSON.parse(localStorage.getItem("datoProv") ?? "")
//     : {
//         email: undefined,
//         password: undefined,
//       };

//   if (typeof datoProv !== "string" && datoProv.email && datoProv.password) {
//     const formData = {
//       email: datoProv.email,
//       password: datoProv.password,
//     };
//     const result = await getLogin(formData);
//     exist = result;
//   }
//   return exist;
// };
