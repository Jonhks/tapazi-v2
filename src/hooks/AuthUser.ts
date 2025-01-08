import { User } from "../types";
import { useParams } from "react-router-dom";

export const useAuth = () => {
  const user: User = JSON.parse(localStorage.getItem("userTapaszi") || "");
  const params = useParams();
  const userId = params.userId;

  return user.email && user.id.toString() === userId;
};
