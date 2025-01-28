import { useEffect, useState } from "react";
import classes from "./HistoryPortfolios.module.css";
import { Zoom, Button } from "@mui/material";
import Grid from "@mui/material/Grid2";
import HistoryIcon from "@mui/icons-material/History";
// import { PodiumIcon } from "@/assets/icons/icons";
// import BallLoader from "../../UI/BallLoader/BallLoader";
import DropDownHistory from "@/components/Inputs/DropdDownHistory";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getTeamsPerYearLog, getTournaments } from "@/api/HistoryAPI";
import { Tournament } from "@/types/index";
import Loader from "@/components/BallLoader/BallLoader";
import TableHistoryTeamsPerYearLog from "@/components/Table/TableHistoryTeamsPerYearLog";
import DescriptionIcon from "@mui/icons-material/Description";
import TeamPerYearlogGraphic from "@/components/Graphics/TeamPerYearLogGraphic";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import { typeGraphs } from "@/utils/typeGraphs";

// const fakeData = [
//   {
//     name: "Uno",
//     id: "1",
//     team: "Uno",
//     timesPicked: 10,
//     percent: 36,
//     roundEliminated: 1,
//   },
//   {
//     name: "Dos",
//     id: "2",
//     team: "Dos",
//     timesPicked: 35,
//     percent: 21,
//     roundEliminated: 0,
//   },
//   {
//     name: "Tres",
//     id: "3",
//     team: "Tres",
//     timesPicked: 56,
//     percent: 5,
//     roundEliminated: 5,
//   },
//   {
//     name: "Cuatro",
//     id: "4",
//     team: "Cuatro",
//     timesPicked: 100,
//     percent: 46,
//     roundEliminated: 13,
//   },
//   {
//     name: "Cinco",
//     id: "5",
//     team: "Cinco",
//     timesPicked: 13,
//     percent: 13,
//     roundEliminated: 13,
//   },
//   {
//     name: "Seis",
//     id: "6",
//     team: "Seis",
//     timesPicked: 6,
//     percent: 12,
//     roundEliminated: 1,
//   },
//   {
//     name: "Siete",
//     id: "7",
//     team: "Siete",
//     timesPicked: 17,
//     percent: 76,
//     roundEliminated: 1,
//   },
// ];

const History = () => {
  const params = useParams();
  const userId = params.userId!;

  const [graphType, setGraphType] = useState(typeGraphs[0]);

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

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const handleChangeGraph = (e) => {
    const optionSelect = typeGraphs.filter(
      (el: dataDropdowndataType) => el?.name === e.target.value
    )[0];
    setGraphType(optionSelect);
  };

  // console.log(fakeData);

  type dataDropdowndataType = {
    name: string;
    id: string;
  };

  const { data: tournaments, isLoading } = useQuery({
    queryKey: ["tournaments", userId],
    queryFn: () => getTournaments(),
  });

  const { data: teamsPerYearLog } = useQuery({
    queryKey: ["mostPickedTeams", userId],
    queryFn: () => getTeamsPerYearLog(),
  });

  // console.log(teamsPerYearLog);

  // const [tournament, setTournament] = useState("");
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

      // setTournament(current?.name);
      setScore("Teams Per Year Log");
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
    // console.log(e.target.name);
    if (e?.target?.name === "tournament") {
      const optionSelect = tournaments.filter(
        (el: Tournament) => el?.name === e?.target?.value
      )[0];
      // setTournament(e?.target?.value);
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
          // minHeight: "700px",
          height: "calc(100vh - 56px)",
          overflow: "scroll",
        }}
      >
        <Grid
          container
          spacing={1}
          display={"flex"}
          justifyContent={"center"}
          alignContent={"center"}
          flexWrap={"wrap"}
          size={12}
        >
          <Grid
            size={{ xs: 11, md: 10 }}
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
                {/* <Grid size={12}>
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
                </Grid> */}
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
                <Grid size={12}>
                  <span>Chart:</span>
                  <div className={classes.containerDrop}>
                    <AutoGraphIcon />
                    <DropDownHistory
                      name={"Graph"}
                      label={"Chart"}
                      className={classes.DropDownHistory}
                      value={graphType?.name}
                      handleChange={handleChangeGraph}
                      options={typeGraphs}
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
              <TableHistoryTeamsPerYearLog
                arrHistory={[]}
                score={score}
              />
            </Grid>
          </Zoom>
          <Zoom in={true}>
            <Grid size={10}>
              <TeamPerYearlogGraphic
                teamsPerYearLog={teamsPerYearLog}
                graphType={graphType.name}
              />
            </Grid>
          </Zoom>
        </Grid>
      </Grid>
    </>
  );
};

export default History;
