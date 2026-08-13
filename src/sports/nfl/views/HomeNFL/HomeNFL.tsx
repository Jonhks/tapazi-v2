import { useState } from "react";
import Grid from "@mui/material/Grid2";
import classes from "./HomeNFL.module.css";
import BallLoader from "../../components/NFLBallLoader/NFLBallLoader";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  getPayoutNfl,
  getPoponaNfl,
  getHOINFONfl,
  getAllPortfoliosNfl,
  getScoreHomeNfl,
  getTournaments,
} from "@/api/nfl/HomeNflApiNfl";
import { PayOut } from "@/types/index";
import { getPortfoliosNfl } from "@/api/nfl/PortfoliosNflAPI";
import TableHomeNfl from "@/nfl/components/Table/TablesNfl/TableHomeNfl";
import EmptyState from "@/shared/components/EmptyState/EmptyState";

const HomeNFL = () => {
  const isMobile = useMediaQuery("(max-width:900px)");

  const params = useParams();
  const userId = params.userId!;
  const sportId = params.sportId!;

  const [selected, setSelected] = useState("first");

  const { data: tournamentIdNfl } = useQuery({
    queryKey: ["tournamentIdNfl", sportId],
    queryFn: () => getTournaments(sportId),
    enabled: Boolean(sportId),
    retry: 1,
  });

  const tournamentId = tournamentIdNfl?.[0]?.id;

  const { data: dataGetAllPortfoliosNfl } = useQuery({
    queryKey: ["AllportfoliosNfl", userId],
    queryFn: () => getAllPortfoliosNfl(tournamentId),
    enabled: Boolean(tournamentId),
    retry: 1,
  });

  const { data: DataPoponaNfl, isLoading: isLoadingPopons } = useQuery({
    queryKey: ["poponaNfl", userId],
    queryFn: () => getPoponaNfl(tournamentId),
    enabled: Boolean(tournamentId),
    retry: 1,
  });

  const { data: dataHOINFONfl, isLoading: isLoadingHOINFONfl } = useQuery({
    queryKey: ["HOINFONfl", userId],
    queryFn: () => getHOINFONfl(tournamentId),
    enabled: Boolean(tournamentId),
    retry: 1,
  });

  const activeTournamentId = String(tournamentIdNfl?.[0]?.id ?? "");

  const { data: portfoliosHome, isLoading: isLoadingPortfoliosHome } = useQuery(
    {
      queryKey: ["portfoliosHome", userId, activeTournamentId],
      queryFn: () => getPortfoliosNfl(userId, "0", activeTournamentId),
      enabled: Boolean(activeTournamentId),
    },
  );

  const { data: scoreHomeNfl, isLoading: isLoadingScoreHomeNfl } = useQuery({
    queryKey: ["scoreHomeNfl", userId, tournamentIdNfl, portfoliosHome],
    queryFn: () => getScoreHomeNfl(tournamentId, userId),
    enabled: Boolean(tournamentId && userId),
    retry: 1,
  });

  const { data: payout, isLoading: isLoadingPayout } = useQuery({
    queryKey: ["payoutNfl", userId, dataGetAllPortfoliosNfl],
    queryFn: () =>
      getPayoutNfl(tournamentId, dataGetAllPortfoliosNfl?.participants),
    enabled: Boolean(tournamentId && dataGetAllPortfoliosNfl?.participants),
    retry: false,
  });

  if (
    isLoadingPopons ||
    isLoadingHOINFONfl ||
    isLoadingPortfoliosHome ||
    isLoadingPayout ||
    isLoadingScoreHomeNfl
  )
    return <BallLoader />;

  return (
    <>
      <Grid
        container
        justifyContent={"center"}
        alignContent={"start"}
        size={12}
        style={{
          minHeight: "700px",
          height: "calc(100vh - 56px)",
          overflowY: "scroll",
          overflowX: "hidden",
        }}
        className={`${classes.gridInstructions}`}
      >
        <Grid
          size={12}
          display={"flex"}
          flexWrap={isMobile ? "wrap" : "nowrap"}
          justifyContent={"space-around"}
          flexDirection={"row"}
          height={"auto"}
          mb={2}
          className="subboxes-wrapper"
        >
          <Grid
            size={{ xs: 12, md: 5 }}
            m={1}
            className={`${classes.boxHome} ${
              selected === "first" && classes.active
            }`}
            id="first"
            onClick={() => setSelected("first")}
          >
            <p className={classes.titleBox}>
              {DataPoponaNfl?.toUpperCase()}
              IS HERE!!!
            </p>
            <div
              className={`${classes.subBox}`}
              style={{
                display: "flex",
                alignItems: "start",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <p
                style={{
                  margin: 0,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  textAlign: "center",
                }}
              >
                {dataHOINFONfl}
              </p>
            </div>
          </Grid>
          <Grid
            size={{ xs: 11.4, md: 3 }}
            m={1}
            className={`${classes.boxHome} ${
              selected === "second" && classes.active
            }`}
            id="second"
            onClick={() => setSelected("second")}
          >
            <p className={classes.titleBox}>Payouts</p>
            <div
              className={classes.subBoxTwo}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                flexDirection: "column",
              }}
            >
              <p>Total Contestants: {dataGetAllPortfoliosNfl?.participants}</p>
              <p>Total Entries: {dataGetAllPortfoliosNfl?.portfolios}</p>
              <br />
              {payout?.map((pay: PayOut, i: number) => (
                <p key={i}>
                  Place {pay?.place}: <span>{pay?.percentage || 0}%</span>
                </p>
              ))}
            </div>
          </Grid>
          <Grid
            size={{ xs: 11.4, md: 3 }}
            m={1}
            className={`${classes.boxHome} ${
              selected === "third" && classes.active
            }`}
            id="third"
            onClick={() => setSelected("third")}
          >
            <p className={classes.titleBox}>Payment Methods </p>
            <div
              className={classes.subBoxTwo}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                flexDirection: "column",
              }}
            >
              <p>Paypal</p>
              <p>adingo8yourbaby@gmail.com</p>
              <p>
                <a
                  href="https://www.paypal.com/mx/home"
                  target="blank"
                  rel="noopener noreferrer"
                  style={{ color: "white" }}
                >
                  www.paypal.com
                </a>
              </p>
              <p>Venmo name:</p>
              <p>Paul-Tapaszi</p>
            </div>
          </Grid>
        </Grid>
        <Grid
          size={11}
          display={"flex"}
          justifyContent={"space-around"}
          flexDirection={"row"}
          className="subboxes-wrapper"
        >
          <div
            style={{
              width: "100%",
              marginBottom: 30,
              overflow: "scroll",
              backgroundColor: "transparent",
            }}
          >
            {scoreHomeNfl?.length > 0 ? (
              <TableHomeNfl
                data={scoreHomeNfl}
                tournament={tournamentIdNfl?.[0]}
              />
            ) : (
              <EmptyState
                title="There are no scores yet"
                accentColor="#FFFFFF"
                subtitleColor="#FFFFFF"
              />
            )}
          </div>
        </Grid>
      </Grid>
    </>
  );
};

export default HomeNFL;
