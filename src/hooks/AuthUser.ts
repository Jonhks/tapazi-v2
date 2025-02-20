import { User } from "../types";
import { useParams } from "react-router-dom";

export const useAuth = () => {
  const user: User = JSON.parse(localStorage.getItem("userTapaszi") || "");
  const params = useParams();
  const userId = params.userId;
  return user.email && user.id.toString() === userId;
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
