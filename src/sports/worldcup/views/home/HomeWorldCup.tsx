import { useState } from "react";
import Grid from "@mui/material/Grid2";
import { Zoom } from "@mui/material";
import classes from "./Home.module.css";
import TableParticipants from "../../components/Table/Table";
import BallLoader from "../../components/BallLoader/BallLoader";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import {
  gatPayout,
  getHOINFO,
  getParticipants,
  getPopona,
  getPortfoliosCount,
  getScores,
  getTournamentWorldCup,
} from "@/api/worldcup/HomeAPIWorldCup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { PayOut } from "@/types/index";

const HomeWorldCup = () => {
  const isMobile = useMediaQuery("(max-width:900px)");
  const params = useParams();
  const userId = params.userId!;
  const sportId = params.sportId!;

  const [selected, setSelected] = useState("first");

  const { data: tournament, isLoading: isLoadingTournament } = useQuery({
    queryKey: ["tournamentWorldCup", userId, sportId],
    queryFn: () => getTournamentWorldCup(sportId),
    enabled: !!sportId,
  });
  console.log(tournament);
  const tournamentId = tournament?.[0]?.id;
  // const tournamentId = "4";
  //
  const { data: dataScores, isLoading: isLoadingScores } = useQuery({
    queryKey: ["scoresWorldCup", userId, tournamentId],
    queryFn: () => getScores(tournamentId, userId),
    enabled: !!tournamentId,
    retry: 1,
  });

  const { data: DataPopona, isLoading: isLoadingPopona } = useQuery({
    queryKey: ["poponaWorldCup", userId, tournamentId],
    queryFn: () => getPopona(tournamentId),
    enabled: !!tournamentId,
  });

  const { data: dataHOINFO, isLoading: isLoadingHOINFO } = useQuery({
    queryKey: ["HOINFOWorldCup", userId, tournamentId],
    queryFn: () => getHOINFO(tournamentId),
    enabled: !!tournamentId,
  });

  const { data: participants, isLoading: isLoadingParticipants } = useQuery({
    queryKey: ["participantsWorldCup", userId, tournamentId],
    queryFn: () => getParticipants(tournamentId),
    enabled: !!tournamentId,
  });

  const { data: portfoliosHome, isLoading: isLoadingPortfoliosHome } = useQuery(
    {
      queryKey: ["portfoliosHomeWorldCup", userId, tournamentId],
      queryFn: () => getPortfoliosCount(tournamentId),
      enabled: !!tournamentId,
    },
  );

  const { data: payout, isLoading: isLoadingPayout } = useQuery({
    queryKey: ["payoutWorldCup", userId, tournamentId],
    queryFn: () => gatPayout(tournamentId),
    retry: true,
    enabled: !!tournamentId,
  });

  const renderDescription = (dataHOINFO: string) => {
    return dataHOINFO.split("\n").map((line, index) => (
      <p
        key={index}
        style={{ margin: 8, textTransform: "capitalize", fontSize: 12 }}
      >
        {line}
      </p>
    ));
  };

  const isLoading =
    isLoadingScores ||
    isLoadingTournament ||
    isLoadingPopona ||
    isLoadingHOINFO ||
    isLoadingParticipants ||
    isLoadingPortfoliosHome ||
    isLoadingPayout;

  return (
    <>
      {isLoading ? (
        <BallLoader />
      ) : (
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
            size={11}
            display={"flex"}
            flexWrap={isMobile ? "wrap" : "nowrap"}
            justifyContent={"space-around"}
            flexDirection={"row"}
            height={"auto"}
            mb={1}
            className="subboxes-wrapper"
          >
            <Grid
              size={{ xs: 12, md: 5 }}
              m={1}
              className={`${classes.boxHome} ${selected === "first" && classes.active}`}
              onClick={() => setSelected("first")}
            >
              <p className={classes.titleBox}>
                {DataPopona?.toUpperCase()} IS HERE!!!
              </p>
              <div
                className={`${classes.subBox}`}
                style={{
                  display: "flex",
                  alignItems: "center", // Centra verticalmente
                  justifyContent: "center", // Centra horizontalmente el contenedor
                  height: "100%", // Opcional, para ocupar todo el alto
                }}
              >
                <div
                  style={{
                    margin: 0,
                    whiteSpace: "pre-wrap", // Permite que el texto se ajuste al ancho
                    wordBreak: "break-word",
                    textAlign: "center",
                  }}
                >
                  {dataHOINFO && renderDescription(dataHOINFO)}
                </div>
              </div>
            </Grid>

            <Grid
              size={{ xs: 11.4, md: 3 }}
              m={1}
              className={`${classes.boxHome} ${selected === "second" && classes.active}`}
              onClick={() => setSelected("second")}
            >
              <p className={classes.titleBox}>Payouts</p>
              <div className={classes.subBoxTwo}>
                <p>Total Contestants: {participants?.participants}</p>
                <p>Total Entries: {portfoliosHome?.portfolios}</p>
                <br />
                {payout?.map((pay: PayOut, i: number) => (
                  <p key={i}>
                    Place {pay?.place}: <span>{pay?.percentage}%</span>
                  </p>
                ))}
              </div>
            </Grid>

            <Grid
              size={{ xs: 11.4, md: 3 }}
              m={1}
              className={`${classes.boxHome} ${selected === "third" && classes.active}`}
              onClick={() => setSelected("third")}
            >
              <p className={classes.titleBox}>Payment Methods</p>
              <div className={classes.subBoxTwo}>
                <p>Paypal</p>
                <p>adingo8yourbaby@gmail.com</p>
                <p>
                  <a
                    href="https://www.paypal.com/mx/home"
                    target="blank"
                    rel="noopener noreferrer"
                    style={{ color: "#00E2F6" }}
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
            container
            spacing={2}
            mb={3}
            justifyContent="center"
          >
            <Zoom in={true}>
              <Grid
                size={11}
                className="subboxes-wrapper"
              >
                {(dataScores?.score?.participant ||
                  dataScores?.score?.others) && (
                  <TableParticipants
                    participantScore={dataScores?.score?.participant}
                    othersParticipants={dataScores?.score?.others}
                  />
                )}
              </Grid>
            </Zoom>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default HomeWorldCup;
