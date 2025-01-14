import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/AuthUser";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const auth = useAuth();

  if (!auth) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (auth) {
    return children ? children : <Navigate to="/login" />;
  }
};

export default PrivateRoute;
