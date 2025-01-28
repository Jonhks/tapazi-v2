import { useState } from "react";
import Grid from "@mui/material/Grid2";
import { Zoom } from "@mui/material";
import classes from "./Home.module.css";
import Table from "@/components/Table/Table";
import BallLoader from "@/components/BallLoader/BallLoader";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import {
  gatPayout,
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
  const { data, isLoading } = useQuery({
    queryKey: ["scores", userId],
    queryFn: () => getScores(userId),
  });

  const { data: DataPopona } = useQuery({
    queryKey: ["popona", userId],
    queryFn: () => getPopona(),
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
  });

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
                <p>
                  This is limited to 150 e-mail addresses. There are about 30
                  open spots, so please take time to sign up early. I ask that
                  you limit sending this to 1 additional person if you know of
                  someone who would like to join, as I don’t want to shut prior
                  participants out.
                </p>

                <p>Please use the menu to the left and select:</p>
                <p>My Portfolios to make your portfolio entries.</p>
                <p>Rules are in the Instructions window.</p>

                <p>
                  Stats and History will update for the current year once the
                  deadline for entries has passed.
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
                    participantScore={data?.data?.participant}
                    othersParticipants={data?.data?.others}
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
