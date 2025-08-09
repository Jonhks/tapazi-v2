import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy } from "react";
// ? --------------------------  Portfolio -------------------------- ? //
const AuthLayout = lazy(() => import("./layouts/AuthLayout"));
const SportsLayout = lazy(() => import("./layouts/SportsLayout"));
const Splash = lazy(() => import("./components/Splash/Splash"));
const Login = lazy(() => import("./views/login/Login"));
const Signup = lazy(() => import("./views/login/SignUp"));
const Forgot = lazy(() => import("./views/login/Forgot"));
const AppLayout = lazy(() => import("./layouts/AppLayout"));
const Home = lazy(() => import("./views/home/Home"));
const Sports = lazy(() => import("./views/Sports/Sports"));
const PrivateRoute = lazy(
  () => import("./components/PrivateRoute/PrivateRoute")
);
const MyPortfolio = lazy(() => import("./views/myPortfolio/MyPortfolio"));
const HistoryLayout = lazy(() => import("./layouts/HistoryLayout"));
const StatsLayout = lazy(() => import("./layouts/StatsLayout"));
const Stats = lazy(() => import("./views/Stats/Stats"));
const Instructions = lazy(
  () => import("./views/InstructionsPortfolios/InstructionsPortfolios")
);
const History = lazy(
  () => import("./views/HistoryPortfolios/HistoryPortfolios")
);
const Error404 = lazy(() => import("./views/Error404/Error404"));
// fondos
import ImgStats from "@/assets/img/doing-sport-concept.jpg";
import ImgHistory from "@/assets/img/details-ball-sport.jpg";
import WIP from "./views/WIP/WIP";
import MyPortfolioEPL from "./epl/views/myPortfolioEPL/MyPortfolioEPL";
const ImgSports =
  "https://s3.mx-central-1.amazonaws.com/portfolio.pool/login/log_in_girl_back.png?quality=40&format=webp";

// ? --------------------------  EPL Imagenes -------------------------- ? //
const NCAAFemaleImg =
  "https://s3.mx-central-1.amazonaws.com/portfolio.pool/resources/coming_soon_rose.png?quality=80&format=webp";
const NCAAMaleImg =
  "https://s3.mx-central-1.amazonaws.com/portfolio.pool/resources/coming_soon_orange.png?quality=80&format=webp";

// ? --------------------------  EPL Router -------------------------- ? //
const AppLayoutEPL = lazy(() => import("./epl/layouts/AppLayoutEPL"));

const HomeEPL = lazy(() => import("./epl/views/HomeEPL/HomeEPL"));

// ? --------------------------  URL Parameter Handler -------------------------- ? //

// function URLParameterHandler({ children }: { children: React.ReactNode }) {
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     // Detectar si viene de Portfolio Pool hacia EPL
//     const pathSegments = location.pathname.split("/").filter(Boolean);
//     const isEPLRoute = pathSegments[0] === "epl";

//     if (isEPLRoute) {
//       const userId = pathSegments[1]; // epl/123?data=...
// const urlParams = new URLSearchParams(location.search);
// const encodedData = urlParams.get("data");
// console.log({ encodedData });

//       if (userId && encodedData) {
//         try {
//           const userData = JSON.parse(atob(encodedData));
//           localStorage.setItem("userTapaszi", JSON.stringify(userData));
//           navigate(`/epl/home/${userId}`, { replace: true });
//         } catch (error) {
//           navigate("/epl/login", { replace: true });
//         }
//       }
//     }
//   }, [navigate, location]);

//   return <>{children}</>;
// }

const Router = () => {
  return (
    <BrowserRouter>
      {/* <URLParameterHandler> */}
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
        <Route
          path="/wip/:userId/:sport"
          element={
            <WIP
              NCAAFemaleImg={NCAAFemaleImg}
              NCAAMaleImg={NCAAMaleImg}
            />
          }
        />
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
        {/* EPL Routes */}
        <Route element={<AppLayoutEPL />}>
          <Route
            path="/epl/home/:userId"
            element={
              <PrivateRoute>
                <HomeEPL />
              </PrivateRoute>
            }
          />
        </Route>
        <Route element={<AppLayoutEPL />}>
          <Route
            path="/epl/myPortfolio/:userId"
            element={
              <PrivateRoute>
                <MyPortfolioEPL />
              </PrivateRoute>
            }
          />
        </Route>
      </Routes>
      {/* </URLParameterHandler> */}
    </BrowserRouter>
  );
};

export default Router;
