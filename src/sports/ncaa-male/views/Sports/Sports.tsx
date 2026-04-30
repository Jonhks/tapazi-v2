import { useState, useEffect } from "react";
import { Box, Tooltip } from "@mui/material";
import Grid from "@mui/material/Grid2";
import classes from "./Sports.module.css";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import BallLoaderNCAA from "../../components/BallLoader/BallLoader";
import BallLoaderFemale from "../../../female/components/BallLoader/BallLoader";
import EPLBallLoader from "../../../epl/components/EPLBallLoader/EPLBallLoader";
import BallLoaderWorldCup from "../../../worldcup/components/BallLoader/BallLoader";
import { getSports, getSportsDisponible } from "@/api/SportsAPI";
import { useQuery } from "@tanstack/react-query";
import { Sport } from "@/types/index";
import { toast } from "react-toastify";

const loaderMap: Record<string, JSX.Element> = {
  "ncaa-male": <BallLoaderNCAA />,
  female: <BallLoaderFemale />,
  epl: <EPLBallLoader />,
  worldcup: <BallLoaderWorldCup />,
};

export default function Sports() {
  const navigate = useNavigate();
  const params = useParams();
  const [searchParams] = useSearchParams();
  const [showContent, setShowContent] = useState(false);

  const from = searchParams.get("from") ?? "ncaa-male";
  const ActiveLoader = loaderMap[from] ?? loaderMap["ncaa-male"];

  const { data: dataSports, isLoading } = useQuery({
    queryKey: ["sports"],
    queryFn: () => getSports(),
  });

  const { data: dataSportsDisponible, isLoading: isLoadingDisponible } =
    useQuery({
      queryKey: ["sportsDisponible"],
      queryFn: () => getSportsDisponible(params.userId || ""),
    });

  useEffect(() => {
    const t = setTimeout(() => setShowContent(true), 1000);
    return () => clearTimeout(t);
  }, []);

  interface SportDisponible {
    id: number;
    enabled: boolean;
  }

  const unavailableIds: number[] | undefined = dataSportsDisponible
    ?.filter((sport: SportDisponible) => !sport.enabled)
    .map((sport: SportDisponible) => sport.id);

  return (
    <>
      {(!showContent || isLoading || isLoadingDisponible) && ActiveLoader}
      {showContent && !isLoading && !isLoadingDisponible && (
        <Grid
          container
          sx={{ minHeight: "100vh", height: "stretch" }}
        >
          <Grid
            size={{ xs: 12, md: 6 }}
            sx={{
              backgroundImage:
                "url('https://s3.mx-central-1.amazonaws.com/portfolio.pool/sport_selection/fondo_basket.png')",
              backgroundPosition: "right bottom",
              backgroundSize: "cover",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
              alignItems: "center",
              gap: 4,
              padding: 4,
            }}
          >
            {dataSports
              ?.filter((sport: Sport) => sport?.name?.includes("NCAA"))
              ?.map((sport: Sport, i: number) => {
                return (
                  <Tooltip
                    key={i}
                    title={sport?.description}
                  >
                    <Box
                      sx={{
                        backgroundImage: `url(${
                          !unavailableIds?.includes(sport.id)
                            ? sport?.url
                            : sport?.url_disabled
                        })`,
                        justifyContent: sport.id === 1 ? "right" : "left",
                        alignItems: "center",
                        textAlign: "center",
                      }}
                      className={classes.imgCard}
                      onClick={() => {
                        if (!unavailableIds?.includes(sport.id)) {
                          navigate(
                            sport.id === 1
                              ? `/home/${params.userId}`
                              : `/ncaa-female/home/${params.userId}/3`,
                          );
                        } else {
                          toast.info("This sport is currently unavailable.");
                        }
                      }}
                    >
                      <p>{sport?.name}</p>
                    </Box>
                  </Tooltip>
                );
              })}
          </Grid>

          <Grid
            size={{ xs: 12, md: 6 }}
            sx={{
              backgroundImage:
                "url('https://s3.mx-central-1.amazonaws.com/portfolio.pool/sport_selection/fondo_soccer.png')",
              backgroundPosition: "left top",
              backgroundSize: "cover",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
              alignItems: "center",
              gap: 4,
              padding: 4,
              cursor: "pointer",
            }}
          >
            {dataSports
              ?.filter(
                (sport: Sport) =>
                  sport?.name?.includes("EPL") ||
                  sport?.name?.includes("WORLDCUP"),
              )
              .map((sport: Sport, i: number) => {
                return (
                  <Tooltip
                    key={i}
                    title={sport?.description}
                  >
                    <Box
                      sx={{
                        backgroundImage: `url(${
                          !unavailableIds?.includes(sport.id)
                            ? sport?.url
                            : sport?.url_disabled
                        })`,
                        justifyContent: sport.id === 2 ? "left" : "right",
                        alignItems: "center",
                        textAlign: "center",
                        cursor: "pointer",
                      }}
                      className={classes.imgCard}
                      onClick={() => {
                        if (!unavailableIds?.includes(sport.id)) {
                          const userData = JSON.parse(
                            localStorage.getItem("userTapaszi") || "{}",
                          );
                          const encodedData = btoa(JSON.stringify(userData));
                          navigate(
                            sport.id === 2
                              ? `/epl/home/${params.userId}/${sport.id}?data=${encodedData}`
                              : `/worldcup/home/${params.userId}/${sport.id}`,
                          );
                        } else {
                          toast.info("This sport is currently unavailable.");
                        }
                      }}
                    >
                      <p>{sport?.name}</p>
                    </Box>
                  </Tooltip>
                );
              })}
          </Grid>
        </Grid>
      )}
    </>
  );
}
