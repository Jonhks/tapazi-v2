import { BrowserRouter, Routes, Route } from "react-router-dom";
// import AuthLayout from "./layouts/AuthLayout";
// import Splash from "./components/Splash/Splash";
// import Login from "./views/login/Login";
// import Signup from "@/views/login/SignUp";
// import Forgot from "./views/login/Forgot";
// import AppLayout from "@/layouts/AppLayout";
// import Home from "./views/home/Home";
// import PrivateRoute from "@/components/PrivateRoute/PrivateRoute";
// import MyPortfolio from "./views/myPortfolio/MyPortfolio";
// import HistoryLayout from "./layouts/HistoryLayout";
// import StatsLayout from "./layouts/StatsLayout";
// import Stats from "./views/Stats/Stats";
// import Instructions from "@/views/Instructions/Instructions";
// import History from "@/views/History/History";
import { lazy } from "react";

const AuthLayout = lazy(() => import("./layouts/AuthLayout"));
const Splash = lazy(() => import("./components/Splash/Splash"));
const Login = lazy(() => import("./views/login/Login"));
const Signup = lazy(() => import("@/views/login/SignUp"));
const Forgot = lazy(() => import("./views/login/Forgot"));
const AppLayout = lazy(() => import("@/layouts/AppLayout"));
const Home = lazy(() => import("./views/home/Home"));
const PrivateRoute = lazy(
  () => import("@/components/PrivateRoute/PrivateRoute")
);
const MyPortfolio = lazy(() => import("./views/myPortfolio/MyPortfolio"));
const HistoryLayout = lazy(() => import("./layouts/HistoryLayout"));
const StatsLayout = lazy(() => import("./layouts/StatsLayout"));
const Stats = lazy(() => import("./views/Stats/Stats"));
const Instructions = lazy(() => import("@/views/Instructions/Instructions"));
const History = lazy(() => import("@/views/History/History"));

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
        </Route>
        <Route element={<HistoryLayout />}>
          <Route
            path="/history/:userId"
            element={
              <PrivateRoute>
                <History />
              </PrivateRoute>
            }
          />
        </Route>
        <Route element={<StatsLayout />}>
          <Route
            path="/stats/:userId"
            element={
              <PrivateRoute>
                <Stats />
              </PrivateRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
