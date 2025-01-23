import { useEffect, useState } from "react";
import classes from "./History.module.css";
import { Zoom, Button } from "@mui/material";
import Grid from "@mui/material/Grid2";
import HistoryIcon from "@mui/icons-material/History";
import { PodiumIcon } from "@/assets/icons/icons";
// import BallLoader from "../../UI/BallLoader/BallLoader";
import DropDownHistory from "@/components/Inputs/DropdDownHistory";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getTournaments } from "@/api/HistoryAPI";
import { Tournament } from "@/types/index";
import Loader from "@/components/BallLoader/BallLoader";
import TableHistory from "@/components/Table/TableHistory";
import DescriptionIcon from "@mui/icons-material/Description";

const History = () => {
  const params = useParams();
  const userId = params.userId!;

  const dataDropdowndata = [
    {
      name: "Historical All Rounds",
      id: "1",
    },
    {
      name: "Historical Perfect Portfolios",
      id: "2",
    },
    {
      name: "Teams Picked",
      id: "3",
    },
    {
      name: "Teams Filtered by Portfolio Risk",
      id: "4",
    },
  ];

  type dataDropdowndataType = {
    name: string;
    id: string;
  };

  const { data: tournaments, isLoading } = useQuery({
    queryKey: ["tournaments", userId],
    queryFn: () => getTournaments(),
  });

  const [tournament, setTournament] = useState("");
  const [score, setScore] = useState("");
  const [selectedScore, setSelectedScore] = useState({
    name: "Historical All Rounds",
    id: "1",
  });
  const [selectedTournament, setSelectedTournament] = useState({ id: 1 });
  // const [pointsPerRound, setPointsPerRound] = useState([]);
  // const [selectedOrderBy, setSelectedOrderBy] = useState(1);

  useEffect(() => {
    if (tournaments) {
      const current = tournaments.filter((el: Tournament) => el?.current)[0];

      setTournament(current?.name);
      setScore("Teams Picked Tables");
      setSelectedTournament(current);
      setTimeout(async () => {
        if (selectedTournament?.id) {
          // const responsePointsPerRound = await getScorePPR(
          //   selectedTournament?.id
          // );
          // setPointsPerRound(responsePointsPerRound);
          // getScoreHistory();
        }
      }, 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tournaments]);

  // console.log(selectedScore);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const handleChange = (e) => {
    console.log(e.target.name);

    if (e?.target?.name === "tournament") {
      const optionSelect = tournaments.filter(
        (el: Tournament) => el?.name === e?.target?.value
      )[0];
      setTournament(e?.target?.value);
      setSelectedTournament(optionSelect);
    } else if (e?.target?.name === "dataDropdowndata") {
      const optionSelect = dataDropdowndata.filter(
        (el: dataDropdowndataType) => el?.name === e?.target?.value
      )[0];
      setScore(e?.target?.value);
      setSelectedScore(optionSelect);
    }
  };

  if (isLoading) return <Loader />;

  return (
    <>
      <Grid
        size={12}
        style={{
          minHeight: "700px",
          height: "calc(100vh - 54px)",
          overflow: "scroll",
        }}
      >
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
            size={{ xs: 11, md: 8 }}
            m={1}
            className={`${classes.boxHistory} ${classes.active}`}
            id="first"
          >
            <Grid
              size={12}
              className={classes.containerHeadHistory}
            >
              <Grid size={{ xs: 6, sm: 6, md: 6 }}>
                <p className={classes.titleBox}>
                  <HistoryIcon /> History
                </p>
              </Grid>
              <Grid size={{ xs: 6, sm: 4, md: 4 }}>
                <Button
                  variant="contained"
                  // color="success"
                  style={{
                    width: "100%",
                    textTransform: "capitalize",
                    backgroundColor: "#238b94",
                  }}
                  className={classes.btnSubmit}
                  // onClick={() => getScoreHistory()}
                >
                  Send
                </Button>
              </Grid>
            </Grid>
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
                      handleChange={handleChange}
                      options={tournaments}
                    />
                  </div>
                </Grid>

                <Grid size={12}>
                  <span>Data:</span>
                  <div className={classes.containerDrop}>
                    <DescriptionIcon />
                    <DropDownHistory
                      name={"dataDropdowndata"}
                      label={"Data"}
                      className={classes.DropDownHistory}
                      value={selectedScore?.name}
                      handleChange={handleChange}
                      options={dataDropdowndata}
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
