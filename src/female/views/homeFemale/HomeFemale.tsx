import { useState } from "react";
import Grid from "@mui/material/Grid2";
import { Zoom } from "@mui/material";
import classes from "./HomeFemale.module.css";
import Table from "@/shared/components/Table/TableHome";
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
  getTournamentFemale,
} from "@/api/female/HomeAPIFemale";
import useMediaQuery from "@mui/material/useMediaQuery";
import { PayOut } from "@/types/index";

const Home = () => {
  const isMobile = useMediaQuery("(max-width:900px)");

  const params = useParams();
  const userId = params.userId!;

  const [selected, setSelected] = useState("first");

  const { data: tournamentFelame, isLoading: isLoadingTournamentFemale } =
    useQuery({
      queryKey: ["tournamentFemale", userId],
      queryFn: () => getTournamentFemale("3"),
    });

  // console.log(tournamentFelame);
  const tournamentId = tournamentFelame?.[0]?.id.toString() ?? "";

  const { data: scoresFemale } = useQuery({
    queryKey: ["scoresFemale", userId],
    queryFn: () => getScoresFemale(tournamentId, userId),
    enabled: !!tournamentId,
  });
  // console.log(scoresFemale);

  const { data: DataPoponaFemale, isLoading: isLoadingPoponaFemale } = useQuery(
    {
      queryKey: ["poponaFemale", userId, tournamentId],
      queryFn: () => getPoponaFemale(tournamentId),
      enabled: !!tournamentId,
    },
  );

  const { data: dataHOINFOFemale, isLoading: isLoadingHOINFOFemale } = useQuery(
    {
      queryKey: ["HOINFOFemale", userId, tournamentId],
      queryFn: () => getHOINFOFemale(tournamentId),
      enabled: !!tournamentId,
    },
  );

  const { data: participantsFemale, isLoading: isLoadingParticipantsFemale } =
    useQuery({
      queryKey: ["participantsFemale", userId, tournamentId],
      queryFn: () => getParticipantsFemale(tournamentId),
      enabled: !!tournamentId,
    });

  const { data: payoutFemale, isLoading: isLoadingPayoutFemale } = useQuery({
    queryKey: ["payoutFemale", userId, tournamentId],
    queryFn: () => gatPayoutFemale(tournamentId),
    enabled: !!tournamentId,
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
    isLoadingPoponaFemale ||
    isLoadingHOINFOFemale ||
    isLoadingTournamentFemale ||
    isLoadingParticipantsFemale ||
    isLoadingPayoutFemale;

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
                  {(scoresFemale?.participant?.length ||
                    scoresFemale?.data?.others?.length) && (
                    <Table
                      participantScore={scoresFemale.participant}
                      othersParticipants={scoresFemale.data.others}
                    />
                  )}
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
