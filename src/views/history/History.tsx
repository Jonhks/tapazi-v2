import { useEffect, useState } from "react";
import classes from "./History.module.css";
import { Zoom, Button } from "@mui/material";
import Grid from "@mui/material/Grid2";
import HistoryIcon from "@mui/icons-material/History";
import { PodiumIcon } from "@/assets/icons/icons";
import TimerIcon from "@mui/icons-material/Timer";
// import BallLoader from "../../UI/BallLoader/BallLoader";
import DropDownHistory from "@/components/Inputs/DropdDownHistory";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getScorePPR, getTournaments } from "@/api/HistoryAPI";
import { Tournament } from "@/types/index";
import Loader from "@/components/BallLoader/BallLoader";
import RadioButtonHistory from "@/components/Inputs/RadioButtonHistory";
// import HistoryContext from "../../../context/HistoryContext";
import TableHistory from "@/components/Table/TableHistory";

const History = () => {
  const params = useParams();
  const userId = params.userId!;

  const { data: tournaments, isLoading } = useQuery({
    queryKey: ["tournaments", userId],
    queryFn: () => getTournaments(),
  });

  // const {
  //   tournaments,
  //   isLoading,
  //   setSelectedTournament,
  //   pointsPerRound,
  //   selectedOrderBy,
  //   setSelectedScore,
  //   setSelectedOrderBy,
  //   arrHistory,
  //   getScoreHistory,
  //   getScorePPR,
  //   selectedTournament,
  // } = useContext(HistoryContext);

  const [tournament, setTournament] = useState("");
  const [score, setScore] = useState("");
  const [selectedTournament, setSelectedTournament] = useState({ id: 1 });
  const [pointsPerRound, setPointsPerRound] = useState([]);
  const [selectedOrderBy, setSelectedOrderBy] = useState(1);

  useEffect(() => {
    if (tournaments) {
      const current = tournaments.filter((el: Tournament) => el?.current)[0];

      setTournament(current?.name);
      console.log(current);
      setScore("CURRENT SCORE");
      setSelectedTournament(current);
      setTimeout(async () => {
        if (selectedTournament?.id) {
          const responsePointsPerRound = await getScorePPR(
            selectedTournament?.id
          );
          setPointsPerRound(responsePointsPerRound);
          // getScoreHistory();
        }
      }, 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tournaments]);

  console.log(pointsPerRound);
  console.log(score);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    console.log(e);

    // if (e?.target?.name === "tournament") {
    //   const optionSelect = tournaments.filter(
    //     (el) => el?.name === e?.target?.value
    //   )[0];
    //   setTournament(e?.target?.value);
    //   setSelectedTournament(optionSelect);
    // } else if (e?.target?.name === "score") {
    //   const optionSelect = pointsPerRound.filter(
    //     (el) => el?.name === e?.target?.value
    //   )[0];
    //   setScore(e?.target?.value);
    //   setSelectedScore(optionSelect);
    // }
  };

  if (isLoading) return <Loader />;

  return (
    <>
      <Grid size={12}>
        <Grid
          container
          spacing={1}
          display={"flex"}
          justifyContent={"center"}
          alignContent={"center"}
          flexWrap={"nowrap"}
          size={12}
        >
          <Grid
            size={10}
            m={1}
            className={`${classes.boxHistory} ${classes.active}`}
            id="first"
          >
            <div className={classes.containerHeadHistory}>
              <p className={classes.titleBox}>
                <HistoryIcon /> Stats & history
              </p>
              <Button
                variant="contained"
                // color="success"
                style={{
                  width: "35%",
                  textTransform: "capitalize",
                  backgroundColor: "#238b94",
                }}
                className={classes.btnSubmit}
                // onClick={() => getScoreHistory()}
              >
                Send
              </Button>
            </div>
            <Grid
              container
              className={classes.subBoxHistory}
              flexWrap={"nowrap"}
            >
              <Grid container>
                <Grid size={12}>
                  <span>Tournament:</span>
                  <div className={classes.containerDrop}>
                    <PodiumIcon />
                    <DropDownHistory
                      name={"tournament"}
                      label={"Tournament"}
                      className={classes.DropDownHistory}
                      value={tournament}
                      // handleChange={handleChange}
                      options={tournaments}
                    />
                  </div>
                </Grid>

                <Grid size={12}>
                  <span>Scrore:</span>
                  <div className={classes.containerDrop}>
                    <TimerIcon />
                    <DropDownHistory
                      name={"score"}
                      label={"Score"}
                      className={classes.DropDownHistory}
                      value={score}
                      handleChange={handleChange}
                      options={pointsPerRound}
                    />
                  </div>
                </Grid>
              </Grid>
              <Grid
                container
                size={12}
                display={"flex"}
                flexDirection={"column"}
                justifyContent={"center"}
                alignItems={"end"}
              >
                <Grid size={4}></Grid>
                <Grid size={8}>
                  <span>Order by:</span>
                  <div style={{ paddingLeft: "16px" }}>
                    <RadioButtonHistory
                      setSelectedOrderBy={setSelectedOrderBy}
                      selectedOrderBy={selectedOrderBy}
                    />
                  </div>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          container
          spacing={2}
          display={"flex"}
          justifyContent={"center"}
          alignContent={"center"}
        >
          <Grid
            size={12}
            className={classes.containerBtn}
          ></Grid>
          <Zoom in={true}>
            <Grid size={11}>
              <TableHistory
                arrHistory={[]}
                score={score}
              />
            </Grid>
          </Zoom>
        </Grid>
      </Grid>
    </>
  );
};

export default History;
