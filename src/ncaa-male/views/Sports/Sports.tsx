import { Box, Tooltip } from "@mui/material";
import Grid from "@mui/material/Grid2";
import classes from "./Sports.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import BallLoader from "../../components/BallLoader/BallLoader";
import EPLBallLoader from "../../../epl/components/EPLBallLoader/EPLBallLoader";
import { getSports, getSportsDisponible } from "@/api/SportsAPI";
import { useQuery } from "@tanstack/react-query";
import { Sport } from "@/types/index";
import { toast } from "react-toastify";

export default function Sports() {
  const navigate = useNavigate();
  const params = useParams();
  const [showLoader, setShowLoader] = useState(false);
  const [changeLoader, setChangeLoader] = useState(false);

  const { data: dataSports, isLoading } = useQuery({
    queryKey: ["sports"],
    queryFn: () => getSports(),
  });

  const { data: dataSportsDisponible, isLoading: isLoadingDisponible } =
    useQuery({
      queryKey: ["sportsDisponible"],
      queryFn: () => getSportsDisponible(params.userId || ""),
    });

  setTimeout(() => setShowLoader(true), 1000);
  setTimeout(() => setChangeLoader(true), 500);

  console.log(dataSports);
  console.log(dataSportsDisponible);

  interface SportDisponible {
    id: number;
    enabled: boolean;
  }

  const unavailableIds: number[] | undefined = dataSportsDisponible
    ?.filter((sport: SportDisponible) => !sport.enabled)
    .map((sport: SportDisponible) => sport.id);

  return (
    <>
      {!showLoader && !isLoading && !isLoadingDisponible && changeLoader && (
        <BallLoader />
      )}
      {!showLoader && !isLoading && !isLoadingDisponible && changeLoader && (
        <EPLBallLoader />
      )}
      {showLoader && (
        <Grid
          container
          sx={{ height: "100vh" }}
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
              justifyContent: "center",
              alignItems: "center",
              gap: 4,
              padding: 4,
            }}
          >
            {dataSports
              .filter((sport: Sport) => sport?.name?.includes("NCAA"))
              .map((sport: Sport, i: number) => {
                return (
                  <Tooltip
                    key={i}
                    title={sport?.description}
                  >
                    <Box
                      sx={{
                        // backgroundImage: `url(${sport?.url})`,
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
                              : `/wip/${params.userId}/${sport.id}`
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
            // item
            size={{ xs: 12, md: 6 }}
            sx={{
              backgroundImage:
                "url('https://s3.mx-central-1.amazonaws.com/portfolio.pool/sport_selection/fondo_soccer.png')",
              backgroundPosition: "left top",
              backgroundSize: "cover",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 4,
              padding: 4,
            }}
          >
            {dataSports
              .filter(
                (sport: Sport) =>
                  sport?.name?.includes("EPL") ||
                  sport?.name?.includes("WORLDCUP")
              )
              .map((sport: Sport, i: number) => {
                return (
                  <Tooltip
                    key={i}
                    title={sport?.description}
                  >
                    <Box
                      sx={{
                        // backgroundImage: `url(${sport?.url})`,
                        backgroundImage: `url(${
                          !unavailableIds?.includes(sport.id)
                            ? sport?.url
                            : sport?.url_disabled
                        })`,
                        justifyContent: sport.id === 2 ? "left" : "right",
                        alignItems: "center",
                        textAlign: "center",
                      }}
                      className={classes.imgCard}
                      onClick={() => {
                        if (!unavailableIds?.includes(sport.id)) {
                          const userData = JSON.parse(
                            localStorage.getItem("userTapaszi") || "{}"
                          );
                          const encodedData = btoa(JSON.stringify(userData));
                          navigate(
                            sport.id === 2
                              ? `/epl/home/${params.userId}/${sport.id}?data=${encodedData}`
                              : `/wip/${params.userId}/${sport.id}`
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
