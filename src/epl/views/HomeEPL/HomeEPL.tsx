import { useState } from "react";
import Grid from "@mui/material/Grid2";
import { Zoom } from "@mui/material";
import classes from "./HomeEPL.module.css";
// import Table from "../../components/Table/Table";
import BallLoader from "../../components/EPLBallLoader/EPLBallLoader";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  getParticipantsEpl,
  getPayoutEpl,
  getPoponaEpl,
  getHOINFOEpl,
  getAllPortfoliosEpl,
} from "@/api/epl/HomeEplApiEpl";
import { PayOut } from "@/types/index";

const HomeEPL = () => {
  const isMobile = useMediaQuery("(max-width:900px)");

  const params = useParams();
  const userId = params.userId!;

  const [selected, setSelected] = useState("first");

  // const { data, isLoading } = useQuery({
  //   queryKey: ["scores", userId],
  //   queryFn: () => getScores(userId),
  // });

  const { data: dataGetAllPortfoliosEpl } = useQuery({
    queryKey: ["AllportfoliosEpl", userId],
    queryFn: () => getAllPortfoliosEpl(),
  });

  const { data: DataPoponaEpl, isLoading: isLoadingPopons } = useQuery({
    queryKey: ["poponaEpl", userId],
    queryFn: () => getPoponaEpl(),
  });

  const { data: dataHOINFOEpl, isLoading: isLoadingHOINFOEpl } = useQuery({
    queryKey: ["HOINFOEpl", userId],
    queryFn: () => getHOINFOEpl(),
  });

  const { data: participantsEpl, isLoading: isLoadingParticipantsEpl } =
    useQuery({
      queryKey: ["participantsEpl", userId],
      queryFn: () => getParticipantsEpl("3"),
    });

  console.log(participantsEpl);

  // const { data: portfoliosHome } = useQuery({
  //   queryKey: ["portfoliosHome", userId],
  //   queryFn: () => getPortfoliosCount(),
  // });

  const { data: payout, isLoading: isLoadingPayout } = useQuery({
    queryKey: ["payoutEpl", userId],
    queryFn: () => getPayoutEpl("3", 99),
    retry: true,
  });

  // console.log(participantsEpl);

  // const renderDescription = (dataHOINFO: string) => {
  //   return dataHOINFO.split("\n").map((line, index) => (
  //     <p
  //       key={index}
  //       style={{ margin: 8, textTransform: "capitalize", fontSize: 12 }}
  //     >
  //       {line}
  //     </p>
  //   ));
  // };

  if (
    isLoadingPopons ||
    isLoadingHOINFOEpl ||
    isLoadingParticipantsEpl ||
    isLoadingPayout
  )
    return <BallLoader />;

  return (
    <>
      {
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
                <div className={classes.subBox}>
                  {dataHOINFOEpl?.toUpperCase()}
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
                  <p>
                    Total Contestants: {dataGetAllPortfoliosEpl?.participants}
                  </p>
                  <p>Total Entries: {dataGetAllPortfoliosEpl?.portfolios}</p>
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
                  {/* <Table
                    participantScore={data?.data?.participant}
                    othersParticipants={data?.data?.others}
                  /> */}
                </Grid>
              </Zoom>
            </Grid>
          </Grid>
        </>
      }
    </>
  );
};

export default HomeEPL;
