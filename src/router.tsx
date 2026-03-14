import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { lazy, Suspense } from "react";
import { PortfolioProvider } from "./providers/PortfolioProvider";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const RouteLoader = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    height="100vh"
    sx={{ backgroundColor: "#000" }}
  >
    <CircularProgress sx={{ color: "#05fa87" }} />
  </Box>
);

// ─── Imágenes NCAA Male ───────────────────────────────────────────────────────
import ImgStats from "@/assets/img/NCAA-STATS_Male_backup.png";
import ImgHistory from "@/assets/img/NCAA-HISTORY_Male_Back.png";
import ImgInstructions from "@/assets/img/NCAA-MALE-INSTRUCTIONS-BACK.png";
const ImgSports =
  "https://s3.mx-central-1.amazonaws.com/portfolio.pool/sports/epl/stats/back_stats.png?quality=5&format=webp";

// ─── Shared ──────────────────────────────────────────────────────────────────
const PrivateRoute = lazy(
  () => import("@/shared/components/PrivateRoute/PrivateRoute"),
);

// ─── Auth / Global ───────────────────────────────────────────────────────────
const AuthLayout = lazy(() => import("./ncaa-male/layouts/AuthLayout"));
const SportsLayout = lazy(() => import("./ncaa-male/layouts/SportsLayout"));
const Splash = lazy(() => import("./ncaa-male/components/Splash/Splash"));
const Login = lazy(() => import("./ncaa-male/views/login/Login"));
const Signup = lazy(() => import("./ncaa-male/views/login/SignUp"));
const Forgot = lazy(() => import("./ncaa-male/views/login/Forgot"));
const Error404 = lazy(() => import("./ncaa-male/views/Error404/Error404"));
const Sports = lazy(() => import("./ncaa-male/views/Sports/Sports"));

// ─── NCAA Male ───────────────────────────────────────────────────────────────
const AppLayout = lazy(() => import("./ncaa-male/layouts/AppLayout"));
const HistoryLayout = lazy(() => import("./ncaa-male/layouts/HistoryLayout"));
const InstructionsLayout = lazy(
  () => import("./ncaa-male/layouts/InstructionsLayout"),
);
const StatsLayout = lazy(() => import("./ncaa-male/layouts/StatsLayout"));
const Home = lazy(() => import("./ncaa-male/views/home/Home"));
const MyPortfolio = lazy(
  () => import("./ncaa-male/views/myPortfolio/MyPortfolio"),
);
const Instructions = lazy(
  () =>
    import("./ncaa-male/views/InstructionsPortfolios/InstructionsPortfolios"),
);
const Stats = lazy(() => import("./ncaa-male/views/Stats/Stats"));
const History = lazy(
  () => import("./ncaa-male/views/HistoryPortfolios/HistoryPortfolios"),
);

// ─── NCAA Female ─────────────────────────────────────────────────────────────
const AppLayoutFemale = lazy(() => import("./female/layouts/AppLayoutFemale"));
const InstructionsFemaleLayout = lazy(
  () => import("./female/layouts/InstructionsFemaleLayout"),
);
const StatsFemaleLayout = lazy(
  () => import("./female/layouts/StatsFemaleLayout"),
);
const HistoryFemaleLayout = lazy(
  () => import("./female/layouts/HistoryFemaleLayout"),
);
const HomeFemale = lazy(() => import("./female/views/homeFemale/HomeFemale"));
const PortfolioFemale = lazy(
  () => import("./female/views/PortfolioFemale/PortfolioFemale"),
);
const InstructionsFemale = lazy(
  () => import("./female/views/InstructionsFemale/InstructionsFemale"),
);
const StatsFemale = lazy(() => import("./female/views/StatsFemale/StatsFemale"));
const HistoryFemale = lazy(
  () => import("./female/views/HistoryFemale/HistoryFemale"),
);

// ─── EPL ─────────────────────────────────────────────────────────────────────
const AppLayoutEPL = lazy(() => import("./epl/layouts/AppLayoutEPL"));
const StatsLayoutEpl = lazy(() => import("./epl/layouts/StatsLayoutEpl"));
const HomeEPL = lazy(() => import("./epl/views/HomeEPL/HomeEPL"));
const MyPortfolioEPL = lazy(
  () => import("./epl/views/myPortfolioEPL/MyPortfolioEPL"),
);
const InstructionsEPL = lazy(
  () => import("./epl/views/InstructionsEpl/InstructionsEpl"),
);
const StatsEpl = lazy(() => import("./epl/views/StatsEpl/StatsEpl"));

// ─── World Cup ───────────────────────────────────────────────────────────────
const AppLayoutWorldCup = lazy(
  () => import("./worldcup/layouts/AppLayoutWorldCup"),
);
const InstructionsWorldCupLayout = lazy(
  () => import("./worldcup/layouts/InstructionsWorldCupLayout"),
);
const StatsWorldCupLayout = lazy(
  () => import("./worldcup/layouts/StatsWorldCupLayout"),
);
const HistoryWorldCupLayout = lazy(
  () => import("./worldcup/layouts/HistoryWorldCupLayout"),
);
const HomeWorldCup = lazy(
  () => import("./worldcup/views/HomeWorldCup/HomeWorldCup"),
);
const PortfolioWorldCup = lazy(
  () => import("./worldcup/views/PortfolioWorldCup/PortfolioWorldCup"),
);
const InstructionsWorldCup = lazy(
  () => import("./worldcup/views/InstructionsWorldCup/InstructionsWorldCup"),
);
const StatsWorldCup = lazy(
  () => import("./worldcup/views/StatsWorldCup/StatsWorldCup"),
);
const HistoryWorldCup = lazy(
  () => import("./worldcup/views/HistoryWorldCup/HistoryWorldCup"),
);

/** Envuelve las rutas EPL con el PortfolioProvider sin interferir con las demás ligas */
const EPLProviderWrapper = () => (
  <PortfolioProvider>
    <Outlet />
  </PortfolioProvider>
);

const Router = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteLoader />}>
      <Routes>
        {/* ── Splash ────────────────────────────────────────────────────── */}
        <Route
          path="/"
          element={<Splash />}
        />

        {/* ── Auth ──────────────────────────────────────────────────────── */}
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
          <Route
            path="*"
            element={<Error404 />}
          />
        </Route>

        {/* ── Selección de deporte ──────────────────────────────────────── */}
        <Route element={<SportsLayout ImgSports={ImgSports} />}>
          <Route
            path="/sports/:userId"
            element={<Sports />}
          />
        </Route>

        {/* ── NCAA Male ─────────────────────────────────────────────────── */}
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

        <Route element={<InstructionsLayout ImgInstructions={ImgInstructions} />}>
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

        {/* ── NCAA Female ───────────────────────────────────────────────── */}
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

        {/* ── EPL (con PortfolioProvider) ───────────────────────────────── */}
        <Route element={<EPLProviderWrapper />}>
          <Route element={<AppLayoutEPL />}>
            <Route
              path="/epl/home/:userId/:sportId"
              element={
                <PrivateRoute>
                  <HomeEPL />
                </PrivateRoute>
              }
            />
            <Route
              path="/epl/myPortfolio/:userId/:sportId"
              element={
                <PrivateRoute>
                  <MyPortfolioEPL />
                </PrivateRoute>
              }
            />
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
        </Route>

        {/* ── World Cup ─────────────────────────────────────────────────── */}
        <Route element={<AppLayoutWorldCup />}>
          <Route
            path="/worldcup/home/:userId/:sportId"
            element={
              <PrivateRoute>
                <HomeWorldCup />
              </PrivateRoute>
            }
          />
          <Route
            path="/worldcup/myPortfolio/:userId/:sportId"
            element={
              <PrivateRoute>
                <PortfolioWorldCup />
              </PrivateRoute>
            }
          />
        </Route>

        <Route element={<InstructionsWorldCupLayout />}>
          <Route
            path="/worldcup/instructions/:userId/:sportId"
            element={
              <PrivateRoute>
                <InstructionsWorldCup />
              </PrivateRoute>
            }
          />
        </Route>

        <Route element={<StatsWorldCupLayout />}>
          <Route
            path="/worldcup/stats/:userId/:sportId"
            element={
              <PrivateRoute>
                <StatsWorldCup />
              </PrivateRoute>
            }
          />
        </Route>

        <Route element={<HistoryWorldCupLayout />}>
          <Route
            path="/worldcup/history/:userId/:sportId"
            element={
              <PrivateRoute>
                <HistoryWorldCup />
              </PrivateRoute>
            }
          />
        </Route>
      </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default Router;
