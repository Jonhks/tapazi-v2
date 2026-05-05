import { useState } from "react";
import Grid from "@mui/material/Grid2";
// import { Zoom } from "@mui/material";
import classes from "./HomeEPL.module.css";
// import Table from "../../components/Table/Table";
import BallLoader from "../../components/EPLBallLoader/EPLBallLoader";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  // getParticipantsEpl,
  getPayoutEpl,
  getPoponaEpl,
  getHOINFOEpl,
  getAllPortfoliosEpl,
  getScoreHomeEpl,
  getTournaments,
} from "@/api/epl/HomeEplApiEpl";
import { PayOut } from "@/types/index";
import { getPortfoliosEpl } from "@/api/epl/PortfoliosEplAPI";
import TableHomeEpl from "@/epl/components/Table/TablesEpl/TableHomeEpl";
import EmptyState from "@/shared/components/EmptyState/EmptyState";

const HomeEPL = () => {
  const isMobile = useMediaQuery("(max-width:900px)");

  const params = useParams();
  const userId = params.userId!;
  const sportId = params.sportId!;

  const [selected, setSelected] = useState("first");

  const { data: tournamentIdEpl } = useQuery({
    queryKey: ["tournamentIdEpl", sportId],
    queryFn: () => getTournaments(sportId),
    enabled: Boolean(sportId),
    retry: 1,
  });

  const tournamentId = tournamentIdEpl?.[0]?.id;

  const { data: dataGetAllPortfoliosEpl } = useQuery({
    queryKey: ["AllportfoliosEpl", userId],
    queryFn: () => getAllPortfoliosEpl(tournamentId),
    enabled: Boolean(tournamentId),
    retry: 1,
  });

  const { data: DataPoponaEpl, isLoading: isLoadingPopons } = useQuery({
    queryKey: ["poponaEpl", userId],
    queryFn: () => getPoponaEpl(tournamentId),
    enabled: Boolean(tournamentId),
    retry: 1,
  });

  const { data: dataHOINFOEpl, isLoading: isLoadingHOINFOEpl } = useQuery({
    queryKey: ["HOINFOEpl", userId],
    queryFn: () => getHOINFOEpl(tournamentId),
    enabled: Boolean(tournamentId),
    retry: 1,
  });

  // const { data: tournamentId, isLoading: isLoadingTournamentId } = useQuery({
  //   queryKey: ["tournamentId", userId],
  //   queryFn: () => getTournamentsId(sportId),
  //   enabled: Boolean(sportId),
  // });

  const activeTournamentId = String(tournamentIdEpl?.[0]?.id ?? "");

  const { data: portfoliosHome, isLoading: isLoadingPortfoliosHome } = useQuery(
    {
      queryKey: ["portfoliosHome", userId, activeTournamentId],
      queryFn: () => getPortfoliosEpl(userId, "0", activeTournamentId),
      enabled: Boolean(activeTournamentId),
    },
  );

  const { data: scoreHomeEpl, isLoading: isLoadingScoreHomeEpl } = useQuery({
    queryKey: ["scoreHomeEpl", userId, tournamentIdEpl, portfoliosHome],
    queryFn: () =>
      // getScoreHomeEpl("3", "566"),
      getScoreHomeEpl(tournamentId, userId),
    enabled: Boolean(tournamentId && userId),
    retry: 1,
  });

  const { data: payout, isLoading: isLoadingPayout } = useQuery({
    queryKey: ["payoutEpl", userId, dataGetAllPortfoliosEpl],
    queryFn: () =>
      getPayoutEpl(tournamentId, dataGetAllPortfoliosEpl?.participants),
    enabled: Boolean(tournamentId && dataGetAllPortfoliosEpl?.participants),
    retry: false,
  });

  console.log(scoreHomeEpl);

  if (
    isLoadingPopons ||
    isLoadingHOINFOEpl ||
    // isLoadingParticipantsEpl ||
    // isLoadingTournamentId ||
    isLoadingPortfoliosHome ||
    isLoadingPayout ||
    isLoadingScoreHomeEpl
    // isLoadingScorePeerWeekHomeEpl
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
              {DataPoponaEpl?.toUpperCase()}
              IS HERE!!!
            </p>
            <div
              className={`${classes.subBox}`}
              style={{
                display: "flex",
                alignItems: "start", // Centra verticalmente
                justifyContent: "center", // Centra horizontalmente el contenedor
                height: "100%", // Opcional, para ocupar todo el alto
              }}
            >
              <p
                style={{
                  margin: 0,
                  whiteSpace: "pre-wrap", // Permite que el texto se ajuste al ancho
                  wordBreak: "break-word",
                  textAlign: "center",
                }}
              >
                {dataHOINFOEpl}
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
                alignItems: "center", // Centra verticalmente
                justifyContent: "center", // Centra horizontalmente el contenedor
                height: "100%", // Opcional, para ocupar todo el alto
                flexDirection: "column",
              }}
            >
              <p>Total Contestants: {dataGetAllPortfoliosEpl?.participants}</p>
              <p>Total Entries: {dataGetAllPortfoliosEpl?.portfolios}</p>
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
                alignItems: "center", // Centra verticalmente
                justifyContent: "center", // Centra horizontalmente el contenedor
                height: "100%", // Opcional, para ocupar todo el alto
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
            {scoreHomeEpl?.length > 0 ? (
              <TableHomeEpl
                data={scoreHomeEpl}
                tournament={tournamentIdEpl?.[0]}
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

export default HomeEPL;
