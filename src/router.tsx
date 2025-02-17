import { BrowserRouter, Routes, Route } from "react-router-dom";
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
const Instructions = lazy(
  () => import("@/views/InstructionsPortfolios/InstructionsPortfolios")
);
const History = lazy(
  () => import("@/views/HistoryPortfolios/HistoryPortfolios")
);

const Error404 = lazy(() => import("@/views/Error404/Error404"));

// fondos
import ImgStats from "@/assets/img/doing-sport-concept.jpg";
import ImgHistory from "@/assets/img/details-ball-sport.jpg";

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
        <Route element={<HistoryLayout ImgHistory={ImgHistory} />}>
          <Route
            path="/history/:userId"
            element={
              <PrivateRoute>
                <History />
              </PrivateRoute>
            }
          />
        </Route>
        <Route element={<StatsLayout ImgStats={ImgStats} />}>
          <Route
            path="/stats/:userId"
            element={
              <PrivateRoute>
                <Stats />
              </PrivateRoute>
            }
          />
        </Route>
        <Route element={<AuthLayout />}>
          <Route
            path="*"
            element={<Error404 />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
