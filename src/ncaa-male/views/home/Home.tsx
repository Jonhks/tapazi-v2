import { useState } from "react";
import Grid from "@mui/material/Grid2";
import { Zoom } from "@mui/material";
import classes from "./Home.module.css";
// import Table from "../../components/Table/Table";
// import BallLoader from "../../components/BallLoader/BallLoader";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import {
  gatPayout,
  getHOINFO,
  getParticipants,
  getPopona,
  getPortfoliosCount,
  getScores,
} from "@/api/HomeAPI";
import useMediaQuery from "@mui/material/useMediaQuery";
import { PayOut } from "@/types/index";

const Home = () => {
  const isMobile = useMediaQuery("(max-width:900px)");

  const params = useParams();
  const userId = params.userId!;

  const [selected, setSelected] = useState("first");
  const { data: dataScores, isLoading: isLoadingScores } = useQuery({
    queryKey: ["scores", userId],
    queryFn: () => getScores(userId),
  });

  console.log(dataScores);
  console.log(isLoadingScores);

  const { data: DataPopona } = useQuery({
    queryKey: ["popona", userId],
    queryFn: () => getPopona(),
  });

  const { data: dataHOINFO } = useQuery({
    queryKey: ["HOINFO", userId],
    queryFn: () => getHOINFO(),
  });

  const { data: participants } = useQuery({
    queryKey: ["participants", userId],
    queryFn: () => getParticipants(),
  });

  const { data: portfoliosHome } = useQuery({
    queryKey: ["portfoliosHome", userId],
    queryFn: () => getPortfoliosCount(),
  });

  const { data: payout } = useQuery({
    queryKey: ["payout", userId],
    queryFn: () => gatPayout(portfoliosHome.count),
    retry: true,
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
  console.log(payout);

  return (
    <>
      {/* {isLoading ? (
        <BallLoader />
      ) : ( */}
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
                {DataPopona?.value?.toUpperCase()} IS HERE!!!
              </p>
              <div className={classes.subBox}>
                {dataHOINFO && renderDescription(dataHOINFO.value)}
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
                <p>Total Contestants: {participants?.count}</p>
                <p>Total Entries: {portfoliosHome?.count}</p>
                <br />
                {payout?.payout?.map((pay: PayOut, i: number) => (
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
                {/* <Table
                    participantScore={data?.data?.participant}
                    othersParticipants={data?.data?.others}
                  /> */}
              </Grid>
            </Zoom>
          </Grid>
        </Grid>
      </>
      {/* )} */}
    </>
  );
};

export default Home;


// https://portfolio-pool-test.damnserver.com/score/home?api-key=TESTAPIKEY&participant-id=2
// https://portfolio-pool-test.damnserver.com/parameters?api-key=TESTAPIKEY&parameter-key=POPONA
// https://portfolio-pool-test.damnserver.com/parameters?api-key=TESTAPIKEY&parameter-key=HOINFO
// https://portfolio-pool-test.damnserver.com/participants/count?api-key=TESTAPIKEY
// https://portfolio-pool-test.damnserver.com/portfolios/count?api-key=TESTAPIKEY
// https://portfolio-pool-test.damnserver.com/portfolios?api-key=TESTAPIKEY&participant-id=2
// https://portfolio-pool-test.damnserver.com/parameters?api-key=TESTAPIKEY&parameter-key=DATTOU
// https://portfolio-pool-test.damnserver.com/parameters?api-key=TESTAPIKEY&parameter-key=HOUTOU
// https://portfolio-pool-test.damnserver.com/winner-of-team?api-key=TESTAPIKEY&limit=99
// https://portfolio-pool-test.damnserver.com/sports/undefined/teams/dynamics?tournament_id=3&portfolio_id=566
// https://portfolio-pool-test.damnserver.com/tournaments/4/instructions
// https://portfolio-pool-test.damnserver.com/teams-picked-log-history?api-key=TESTAPIKEY&year=0
// https://portfolio-pool-test.damnserver.com/teams-per-year-log
// https://portfolio-pool-test.damnserver.com/historical-perfect-portfolios-header?api-key=TESTAPIKEY
// https://portfolio-pool-test.damnserver.com/historical-all-rounds?api-key=TESTAPIKEY&order-by=year
// https://portfolio-pool-test.damnserver.com/historical-perfect-portfolios-history?api-key=TESTAPIKEY&year=0
// https://portfolio-pool-test.damnserver.com/teams-picked-log-history?api-key=TESTAPIKEY&year=0