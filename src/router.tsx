import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy } from "react";
// ? --------------------------  Portfolio -------------------------- ? //
const AuthLayout = lazy(() => import("./ncaa-male/layouts/AuthLayout"));
const SportsLayout = lazy(() => import("./ncaa-male/layouts/SportsLayout"));
const Splash = lazy(() => import("./ncaa-male/components/Splash/Splash"));
const Login = lazy(() => import("./ncaa-male/views/login/Login"));
const Signup = lazy(() => import("./ncaa-male/views/login/SignUp"));
const Forgot = lazy(() => import("./ncaa-male/views/login/Forgot"));
const AppLayout = lazy(() => import("./ncaa-male/layouts/AppLayout"));
const Home = lazy(() => import("./ncaa-male/views/home/Home"));
const Sports = lazy(() => import("./ncaa-male/views/Sports/Sports"));
const PrivateRoute = lazy(
  () => import("./ncaa-male/components/PrivateRoute/PrivateRoute"),
);
const MyPortfolio = lazy(
  () => import("./ncaa-male/views/myPortfolio/MyPortfolio"),
);
const HistoryLayout = lazy(() => import("./ncaa-male/layouts/HistoryLayout"));
const InstructionsLayout = lazy(
  () => import("./ncaa-male/layouts/InstructionsLayout"),
);
const StatsLayout = lazy(() => import("./ncaa-male/layouts/StatsLayout"));
const Stats = lazy(() => import("./ncaa-male/views/Stats/Stats"));
const Instructions = lazy(
  () =>
    import("./ncaa-male/views/InstructionsPortfolios/InstructionsPortfolios"),
);
const History = lazy(
  () => import("./ncaa-male/views/HistoryPortfolios/HistoryPortfolios"),
);
const Error404 = lazy(() => import("./ncaa-male/views/Error404/Error404"));
// fondos
import ImgStats from "@/assets/img/NCAA-STATS_Male_backup.png";
import ImgHistory from "@/assets/img/NCAA-HISTORY_Male_Back.png";
import ImgInstructions from "@/assets/img/NCAA-MALE-INSTRUCTIONS-BACK.png";
// import WIP from "./ncaa-male/views/WIP/WIP";
import MyPortfolioEPL from "./epl/views/myPortfolioEPL/MyPortfolioEPL";
const ImgSports =
  "https://s3.mx-central-1.amazonaws.com/portfolio.pool/sports/epl/stats/back_stats.png?quality=5&format=webp";

// ? --------------------------  EPL Imagenes -------------------------- ? //
// const NCAAFemaleImg =
//   "https://s3.mx-central-1.amazonaws.com/portfolio.pool/resources/coming_soon_rose.png?quality=80&format=webp";
// const NCAAMaleImg =
//   "https://s3.mx-central-1.amazonaws.com/portfolio.pool/resources/coming_soon_orange.png?quality=80&format=webp";

// ? --------------------------  EPL Router -------------------------- ? //
const AppLayoutEPL = lazy(() => import("./epl/layouts/AppLayoutEPL"));
const StatsLayoutEpl = lazy(() => import("./epl/layouts/StatsLayoutEpl"));
const HomeEPL = lazy(() => import("./epl/views/HomeEPL/HomeEPL"));
const InstructionsEPL = lazy(
  () => import("./epl/views/InstructionsEpl/InstructionsEpl"),
);
const StatsEpl = lazy(() => import("./epl/views/StatsEpl/StatsEpl"));

// ? --------------------------  Female Router -------------------------- ? //
const AppLayoutFemale = lazy(() => import("./female/layouts/AppLayoutFemale"));
const HomeFemale = lazy(() => import("./female/views/homeFemale/HomeFemale"));
const InstructionsFemale = lazy(
  () => import("./female/views/InstructionsFemale/InstructionsFemale"),
);
const StatsFemale = lazy(
  () => import("./female/views/StatsFemale/StatsFemale"),
);
const HistoryFemale = lazy(
  () => import("./female/views/HistoryFemale/HistoryFemale"),
);
const InstructionsFemaleLayout = lazy(
  () => import("./female/layouts/InstructionsFemaleLayout"),
);
const StatsFemaleLayout = lazy(
  () => import("./female/layouts/StatsFemaleLayout"),
);
const HistoryFemaleLayout = lazy(
  () => import("./female/layouts/HistoryFemaleLayout"),
);
const PortfolioFemale = lazy(
  () => import("./female/views/PortfolioFemale/PortfolioFemale"),
);

// ? --------------------------  URL Parameter Handler -------------------------- ? //

import { PortfolioProvider } from "./providers/PortfolioProvider";

const Router = () => {
  return (
    <BrowserRouter>
      {/* <URLParameterHandler> */}
      <PortfolioProvider>
        <Routes>
          {/* Portfolio Pool Routes */}
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
          <Route element={<SportsLayout ImgSports={ImgSports} />}>
            <Route
              path="/sports/:userId"
              element={<Sports />}
            />
          </Route>
          <Route element={<AppLayoutFemale />}>
            <Route
              path="/ncaa-female/home/:userId/:sportId"
              element={
                <PrivateRoute>
                  <HomeFemale />
                </PrivateRoute>
              }
            />
            <Route
              path="/ncaa-female/myPortfolio/:userId/:sportId"
              element={
                <PrivateRoute>
                  <PortfolioFemale />
                </PrivateRoute>
              }
            />
          </Route>
          <Route element={<InstructionsFemaleLayout />}>
            <Route
              path="/ncaa-female/instructions/:userId/:sportId"
              element={
                <PrivateRoute>
                  <InstructionsFemale />
                </PrivateRoute>
              }
            />
          </Route>
          <Route element={<StatsFemaleLayout />}>
            <Route
              path="/ncaa-female/stats/:userId/:sportId"
              element={
                <PrivateRoute>
                  <StatsFemale />
                </PrivateRoute>
              }
            />
          </Route>
          <Route element={<HistoryFemaleLayout />}>
            <Route
              path="/ncaa-female/history/:userId/:sportId"
              element={
                <PrivateRoute>
                  <HistoryFemale />
                </PrivateRoute>
              }
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
          </Route>
          <Route
            element={<InstructionsLayout ImgInstructions={ImgInstructions} />}
          >
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
          {/* EPL Routes */}
          <Route element={<AppLayoutEPL />}>
            <Route
              path="/epl/home/:userId/:sportId"
              element={
                <PrivateRoute>
                  <HomeEPL />
                </PrivateRoute>
              }
            />
          </Route>
          <Route element={<AppLayoutEPL />}>
            <Route
              path="/epl/myPortfolio/:userId/:sportId"
              element={
                <PrivateRoute>
                  <MyPortfolioEPL />
                </PrivateRoute>
              }
            />
            {/* </Route> */}
            {/* <Route element={<AppLayoutEPL />}> */}
            <Route
              path="/epl/instructions/:userId/:sportId"
              element={
                <PrivateRoute>
                  <InstructionsEPL />
                </PrivateRoute>
              }
            />
          </Route>
          <Route element={<StatsLayoutEpl />}>
            <Route
              path="/epl/stats/:userId/:sportId"
              element={
                <PrivateRoute>
                  <StatsEpl />
                </PrivateRoute>
              }
            />
          </Route>
          {/* mundial */}
          <Route element={<AuthLayout />}>
            <Route
              path="/worldcup/wip/:userId/:sportId"
              element={
                // <WIP
                //   NCAAFemaleImg={NCAAFemaleImg}
                //   NCAAMaleImg={NCAAMaleImg}
                // />
                <Error404 sports={"sports"} />
              }
            />
          </Route>
        </Routes>
      </PortfolioProvider>

      {/* </URLParameterHandler> */}
    </BrowserRouter>
  );
};

export default Router;
