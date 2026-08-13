import { useState, useEffect } from "react";
import { Box, Tooltip } from "@mui/material";
import classes from "./Sports.module.css";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import BallLoaderNCAA from "../../components/BallLoader/BallLoader";
import BallLoaderFemale from "../../../female/components/BallLoader/BallLoader";
import EPLBallLoader from "../../../epl/components/EPLBallLoader/EPLBallLoader";
import BallLoaderWorldCup from "../../../worldcup/components/BallLoader/BallLoader";
import NFLBallLoader from "../../../nfl/components/NFLBallLoader/NFLBallLoader";
import { getSports, getSportsDisponible } from "@/api/SportsAPI";
import { useQuery } from "@tanstack/react-query";
import { Sport } from "@/types/index";
import { toast } from "react-toastify";

const loaderMap: Record<string, JSX.Element> = {
  "ncaa-male": <BallLoaderNCAA />,
  female: <BallLoaderFemale />,
  epl: <EPLBallLoader />,
  worldcup: <BallLoaderWorldCup />,
  nfl: <NFLBallLoader />,
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

  const ncaaSports = dataSports?.filter((sport: Sport) =>
    sport?.name?.includes("NCAA"),
  );
  const ncaaMale = ncaaSports?.filter((sport: Sport) => sport.id === 1);
  const ncaaFemale = ncaaSports?.filter((sport: Sport) => sport.id !== 1);
  const eplSports = dataSports?.filter((sport: Sport) =>
    sport?.name?.includes("EPL"),
  );
  const worldcupSports = dataSports?.filter((sport: Sport) =>
    sport?.name?.includes("WORLDCUP"),
  );
  const nflSports = dataSports?.filter((sport: Sport) =>
    sport?.name?.includes("NFL"),
  );

  const renderSportCard = (
    sports: Sport[] | undefined,
    onSelect: (sport: Sport) => void,
  ) =>
    sports?.map((sport: Sport) => {
      const isUnavailable = unavailableIds?.includes(sport.id);
      return (
        <Tooltip
          key={sport.id}
          title={sport?.description}
        >
          <Box
            className={classes.sportCard}
            sx={{
              backgroundImage: `url(${
                isUnavailable ? sport?.url_disabled : sport?.url
              })`,
            }}
            onClick={() => {
              if (!isUnavailable) {
                onSelect(sport);
              } else {
                toast.info("This sport is currently unavailable.");
              }
            }}
          >
            <p>{sport?.name}</p>
          </Box>
        </Tooltip>
      );
    });

  return (
    <>
      {(!showContent || isLoading || isLoadingDisponible) && ActiveLoader}
      {showContent && !isLoading && !isLoadingDisponible && (
        <Box className={classes.sportsRow}>
          {renderSportCard(ncaaMale, () =>
            navigate(`/home/${params.userId}`),
          )}
          {renderSportCard(ncaaFemale, () =>
            navigate(`/ncaa-female/home/${params.userId}/3`),
          )}
          {renderSportCard(eplSports, (sport) => {
            const userData = JSON.parse(
              localStorage.getItem("userTapaszi") || "{}",
            );
            const encodedData = btoa(JSON.stringify(userData));
            navigate(
              `/epl/home/${params.userId}/${sport.id}?data=${encodedData}`,
            );
          })}
          {renderSportCard(worldcupSports, (sport) =>
            navigate(`/worldcup/home/${params.userId}/${sport.id}`),
          )}
          {renderSportCard(nflSports, (sport) =>
            navigate(`/nfl/home/${params.userId}/${sport.id}`),
          )}
        </Box>
      )}
    </>
  );
}
