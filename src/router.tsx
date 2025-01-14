import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout";
import Splash from "./components/Splash/Splash";
import Login from "./views/login/Login";
import Signup from "@/views/login/SignUp";
import Forgot from "./views/login/Forgot";
import AppLayout from "@/layouts/AppLayout";
import Home from "./views/home/Home";
import PrivateRoute from "@/components/PrivateRoute/PrivateRoute";
import MyPortfolio from "./views/myPortfolio/MyPortfolio";
import Instructions from "./views/instructions/Instructions";
import History from "./views/history/History";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Splash />}
        />
        <Route element={<AuthLayout />}>
          <Route
            path="/login"
            element={<Login />}
          />
          <Route
            path="/signup"
            element={<Signup />}
          />
          <Route
            path="/forgot"
            element={<Forgot />}
          />
        </Route>

        <Route element={<AppLayout />}>
          <Route
            path="/home/:userId"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/myPortfolio/:userId"
            element={
              <PrivateRoute>
                <MyPortfolio />
              </PrivateRoute>
            }
          />
          <Route
            path="/instructions/:userId"
            element={
              <PrivateRoute>
                <Instructions />
              </PrivateRoute>
            }
          />
          <Route
            path="/history/:userId"
            element={
              <PrivateRoute>
                <History />
              </PrivateRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
