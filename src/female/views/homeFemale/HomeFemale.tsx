import { useState } from "react";
import Grid from "@mui/material/Grid2";
import { Zoom } from "@mui/material";
import classes from "./HomeFemale.module.css";
import Table from "../../components/Table/Table";
import BallLoader from "../../components/BallLoader/BallLoader";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import {
  gatPayoutFemale,
  getHOINFOFemale,
  getParticipantsFemale,
  getPoponaFemale,
  // getPortfoliosCountFemale,
  getScoresFemale,
  getTournamentFemale
} from "@/api/female/HomeAPIFemale";
import useMediaQuery from "@mui/material/useMediaQuery";
import { PayOut } from "@/types/index";

const Home = () => {
  const isMobile = useMediaQuery("(max-width:900px)");

  const params = useParams();
  const userId = params.userId!;

  const [selected, setSelected] = useState("first");

    const { data: tournamentFelame, isLoading: isLoadingTournamentFemale } = useQuery({
      queryKey: ["tournamentFemale", userId],
      queryFn: () => getTournamentFemale("3"),
    });

    // console.log(tournamentFelame);
    const tournament = tournamentFelame?.length > 0 ? tournamentFelame[0] : null;

  const { data: scoresFemale, isLoading: isloadingScoreFemale } = useQuery({
    queryKey: ["scoresFemale", userId],
    queryFn: () => getScoresFemale(tournament?.id, userId),
    enabled: !!tournament?.id,
  });
  // console.log(scoresFemale);

  const { data: DataPoponaFemale, isLoading: isLoadingPoponaFemale } = useQuery({
    queryKey: ["poponaFemale", userId],
    queryFn: () => getPoponaFemale(tournament?.id),
    enabled: !!tournament?.id,
  });

  const { data: dataHOINFOFemale, isLoading: isLoadingHOINFOFemale } = useQuery({
    queryKey: ["HOINFOFemale", userId],
    queryFn: () => getHOINFOFemale(tournament?.id),
    enabled: !!tournament?.id,
  });

  const { data: participantsFemale, isLoading: isLoadingParticipantsFemale } = useQuery({
    queryKey: ["participantsFemale", userId],
    queryFn: () => getParticipantsFemale(tournament?.id),
    enabled: !!tournament?.id,
  });

  // const { data: portfoliosFemale } = useQuery({
  //   queryKey: ["portfoliosFemale", userId],
  //   queryFn: () => getPortfoliosCountFemale(tournament?.id),
  //   enabled: !!tournament?.id,
  // });

  const { data: payoutFemale } = useQuery({
    queryKey: ["payoutFemale", userId],
    queryFn: () => gatPayoutFemale(tournament?.id),
    enabled: !!tournament?.id,
  });

  const renderDescription = (dataHOINFOFemale: string) => {
    return dataHOINFOFemale?.split("\n").map((line, index) => (
      <p
        key={index}
        style={{ margin: 8, textTransform: "capitalize", fontSize: 12 }}
      >
        {line}
      </p>
    ));
  };
  // console.log(dataHOINFOFemale);

  const isLoading = 
  isloadingScoreFemale || 
  isLoadingPoponaFemale ||
   isLoadingHOINFOFemale || 
   isLoadingTournamentFemale || 
   isLoadingParticipantsFemale;

  return (
    <>
      {/* <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          color: "white",
          fontSize: "2rem",
        }}
      >
        HomeFemale
      </div> */}
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
                maxHeight: isMobile ? "" : "50%",
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
                  {DataPoponaFemale?.toUpperCase()} IS HERE!!!
                </p>
                <div className={classes.subBox}>
                  {dataHOINFOFemale && renderDescription(dataHOINFOFemale)}
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
                  <p>Total Contestants: {participantsFemale?.participants}</p>
                  <p>Total Entries: {participantsFemale?.portfolios}</p>
                  <br />
                  {payoutFemale?.map((pay: PayOut, i: number) => (
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
                    participantScore={scoresFemale?.participant}
                    othersParticipants={scoresFemale?.data?.others}
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
