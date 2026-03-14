import { useState } from "react";
import Grid from "@mui/material/Grid2";
import { Zoom } from "@mui/material";
import classes from "./HomeWorldCup.module.css";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  getTournamentWorldCup,
  getPoponaWorldCup,
  getHOINFOWorldCup,
  getParticipantsWorldCup,
  getPayoutWorldCup,
  getScoresWorldCup,
} from "@/api/worldcup/HomeAPIWorldCup";
import { PayOut } from "@/types/index";
import Table from "@/shared/components/Table/TableHome";

const HomeWorldCup = () => {
  const isMobile = useMediaQuery("(max-width:900px)");

  const params = useParams();
  const userId = params.userId!;
  const sportId = params.sportId!;

  const [selected, setSelected] = useState("first");

  const { data: tournaments, isLoading: isLoadingTournament } = useQuery({
    queryKey: ["tournamentWorldCup", sportId],
    queryFn: () => getTournamentWorldCup(sportId),
  });

  const tournament = tournaments && tournaments.length > 0 ? tournaments[0] : null;

  const { data: scores, isLoading: isLoadingScores } = useQuery({
    queryKey: ["scoresWorldCup", userId, tournament?.id],
    queryFn: () => getScoresWorldCup(tournament!.id, userId),
    enabled: !!tournament?.id,
  });

  const { data: popona, isLoading: isLoadingPopona } = useQuery({
    queryKey: ["poponaWorldCup", tournament?.id],
    queryFn: () => getPoponaWorldCup(tournament!.id),
    enabled: !!tournament?.id,
  });

  const { data: hoinfo, isLoading: isLoadingHOINFO } = useQuery({
    queryKey: ["HOINFOWorldCup", tournament?.id],
    queryFn: () => getHOINFOWorldCup(tournament!.id),
    enabled: !!tournament?.id,
  });

  const { data: participants, isLoading: isLoadingParticipants } = useQuery({
    queryKey: ["participantsWorldCup", tournament?.id],
    queryFn: () => getParticipantsWorldCup(tournament!.id),
    enabled: !!tournament?.id,
  });

  const { data: payouts } = useQuery({
    queryKey: ["payoutsWorldCup", tournament?.id],
    queryFn: () => getPayoutWorldCup(tournament!.id),
    enabled: !!tournament?.id,
  });

  const renderDescription = (text: string) =>
    text.split("\n").map((line, i) => (
      <p
        key={i}
        style={{ margin: 8, textTransform: "capitalize", fontSize: 12 }}
      >
        {line}
      </p>
    ));

  const isLoading =
    isLoadingTournament ||
    isLoadingScores ||
    isLoadingPopona ||
    isLoadingHOINFO ||
    isLoadingParticipants;

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
          color: "#ffd700",
          fontSize: "1.2rem",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <Grid
      container
      flexWrap="wrap"
      justifyContent="center"
      ml={!isMobile ? "25px" : 0}
      style={{
        minHeight: "700px",
        height: "calc(100vh - 56px)",
        overflow: "scroll",
      }}
    >
      <Grid
        size={11}
        display="flex"
        flexWrap={isMobile ? "wrap" : "nowrap"}
        justifyContent="space-around"
        flexDirection="row"
        style={{ maxHeight: isMobile ? "" : "50%" }}
      >
        <Grid
          size={{ xs: 12, md: 5 }}
          m={1}
          className={`${classes.boxHome} ${selected === "first" && classes.active}`}
          id="first"
          onClick={() => setSelected("first")}
        >
          <p className={classes.titleBox}>
            {popona?.toUpperCase()} IS HERE!!!
          </p>
          <div className={classes.subBox}>
            {hoinfo && renderDescription(hoinfo)}
          </div>
        </Grid>

        <Grid
          size={{ xs: 11.4, md: 3 }}
          m={1}
          className={`${classes.boxHome} ${selected === "second" && classes.active}`}
          id="second"
          onClick={() => setSelected("second")}
        >
          <p className={classes.titleBox}>Payouts</p>
          <div className={classes.subBoxTwo}>
            <p>Total Contestants: {participants?.participants}</p>
            <p>Total Entries: {participants?.portfolios}</p>
            <br />
            {payouts?.map((pay: PayOut, i: number) => (
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
          id="third"
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
        container
        spacing={2}
        mb={3}
      >
        <Grid
          size={12}
          className={classes.containerBtn}
        />
        <Zoom in={true}>
          <Grid
            size={11}
            offset={0.5}
          >
            {(scores?.participant || scores?.others) && (
              <Table
                participantScore={scores?.participant}
                othersParticipants={scores?.others}
                accentColor="#FFD700"
              />
            )}
          </Grid>
        </Zoom>
      </Grid>
    </Grid>
  );
};

export default HomeWorldCup;
