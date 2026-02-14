import { useState } from "react";
import Grid from "@mui/material/Grid2";
import { Zoom } from "@mui/material";
import classes from "./Home.module.css";
import Table from "../../components/Table/Table";
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
  getTournamentMale
} from "@/api/HomeAPI";
import useMediaQuery from "@mui/material/useMediaQuery";
import { PayOut } from "@/types/index";

const Home = () => {
  const isMobile = useMediaQuery("(max-width:900px)");

  const params = useParams();
  const userId = params.userId!;

  const [selected, setSelected] = useState("first");

  const { data: tournamentMale, isLoading: isLoadingTournamentMale } = useQuery({
    queryKey: ["tournamentMale", userId],
    queryFn: () => getTournamentMale("1"),
  });

  const tournamentId = tournamentMale?.[0]?.id;

  const { data: dataScores, isLoading: isLoadingScores } = useQuery({
    queryKey: ["scores", userId, tournamentMale],
    queryFn: () => getScores(tournamentId, userId),
    enabled: !!tournamentId,
  });

  // console.log(dataScores);

  const { data: DataPopona , isLoading: isLoadingPopona} = useQuery({
    queryKey: ["popona", userId],
    queryFn: () => getPopona(tournamentId),
    enabled: !!tournamentId,
  });

  const { data: dataHOINFO , isLoading: isLoadingHOINFO} = useQuery({
    queryKey: ["HOINFO", userId],
    queryFn: () => getHOINFO(tournamentId),
    enabled: !!tournamentId,
  });

  const { data: participants , isLoading: isLoadingParticipants} = useQuery({
    queryKey: ["participants", userId],
    queryFn: () => getParticipants(tournamentId),
    enabled: !!tournamentId,
  });

  const { data: portfoliosHome , isLoading: isLoadingPortfoliosHome} = useQuery({
    queryKey: ["portfoliosHome", userId],
    queryFn: () => getPortfoliosCount(tournamentId),
    enabled: !!tournamentId,
  });

  const { data: payout , isLoading: isLoadingPayout} = useQuery({
    queryKey: ["payout", userId],
    queryFn: () => gatPayout(tournamentId),
    retry: true,
    enabled: !!tournamentId,
  });

  console.log(payout);

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
  // console.log(participants);

  const isLoading = isLoadingScores || isLoadingTournamentMale || isLoadingPopona || isLoadingHOINFO || isLoadingParticipants || isLoadingPortfoliosHome || isLoadingPayout;

  return (
    <>
      {isLoading ? (
        <BallLoader />
      ) : (
        <>
          <Grid
            container
            flexWrap={"wrap"}
            justifyContent={"center"}
            ml={!isMobile ? "25px" : 0}
            style={{
              minHeight: "700px",
              height: "calc(100vh - 56px)",
              overflow: "scroll",
            }}
          >
            <Grid
              size={11}
              display={"flex"}
              flexWrap={isMobile ? "wrap" : "nowrap"}
              justifyContent={"space-around"}
              flexDirection={"row"}
              style={{
                maxHeight: "50%",
              }}
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
                  {DataPopona?.toUpperCase()} IS HERE!!!
                </p>
                <div className={classes.subBox}>
                  {dataHOINFO && renderDescription(dataHOINFO)}
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
                className={`${classes.boxHome} ${
                  selected === "third" && classes.active
                }`}
                id="third"
                onClick={() => setSelected("third")}
              >
                <p className={classes.titleBox}>Payment Methods </p>
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
              ></Grid>
              <Zoom in={true}>
                <Grid
                  size={11}
                  offset={0.5}
                >
                  <Table
                    participantScore={dataScores?.score?.participant}
                    othersParticipants={dataScores?.score?.others}
                  />
                </Grid>
              </Zoom>
            </Grid>
          </Grid>
        </>
      )}
    </>
  );
};

export default Home;
