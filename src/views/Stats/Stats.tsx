import { useEffect, useState } from "react";
import classes from "./Stats.module.css";
import { Zoom, Button } from "@mui/material";
import Grid from "@mui/material/Grid2";
import HistoryIcon from "@mui/icons-material/History";
import { PodiumIcon } from "@/assets/icons/icons";
// import BallLoader from "../../UI/BallLoader/BallLoader";
import DropDownHistory from "@/components/Inputs/DropdDownHistory";
import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getTournaments } from "@/api/HistoryAPI";
import { Tournament } from "@/types/index";
import Loader from "@/components/BallLoader/BallLoader";
import TableHistory from "@/components/Table/TableHistory";
import DescriptionIcon from "@mui/icons-material/Description";
import { dataDropdowndata, subDataDropDown } from "@/utils/dataDropDown";
import RadioButtonHistory from "@/components/Inputs/RadioButtonHistory";
import { getMostPickedTeams, getTeamsPicked } from "@/api/StatsAPI";
import TableHistoryMostPickedTeams from "@/components/Table/TableHistoryMostPickedTeams";

const Stats = () => {
  const params = useParams();
  const userId = params.userId!;
  const queryClient = useQueryClient();

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
  const [runTeamsPicked, setRunTeamsPicked] = useState(false);
  const [selectedScore, setSelectedScore] = useState({
    name: "Score",
    id: "1",
    option: "Score",
    placeholder: "Current Score",
  });

  const [subDataSelected, setSubDataSelected] = useState(subDataDropDown[0]);

  const [selectedTournament, setSelectedTournament] = useState({ id: 1 });
  // const [pointsPerRound, setPointsPerRound] = useState([]);
  const [selectedOrderBy, setSelectedOrderBy] = useState("1");

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

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const handleChange = (e) => {
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
      setSubDataSelected(subDataDropDown[+optionSelect.id - 1]);
    }
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const handleChangeSubData = (e) => {
    console.log(selectedScore);
    console.log(e.target);
  };

  const { data: teamsPicked, isLoading: isLoadingTeamsPicked } = useQuery({
    queryKey: ["teamsPicked", userId],
    queryFn: () => getTeamsPicked(`${selectedTournament.id}`, selectedOrderBy),
    enabled: runTeamsPicked,
  });

  const { data: mostPickedTeams, isLoading: isLoadingMostPickedTeams } =
    useQuery({
      queryKey: ["mostPickedTeams", userId],
      queryFn: () => getMostPickedTeams(selectedTournament.id),
      // enabled: runTeamsPicked,
    });

  console.log(mostPickedTeams);

  const checkWhatDataToRequest = () => {
    if (
      selectedScore.name === "Teams" &&
      subDataSelected[0].name === "Teams Picked"
    ) {
      queryClient.invalidateQueries({
        queryKey: ["teamsPicked", userId],
      });
      setRunTeamsPicked(true);
    }
  };

  if (isLoading || isLoadingTeamsPicked || isLoadingMostPickedTeams)
    return <Loader />;

  return (
    <Grid
      style={{
        minHeight: "700px",
        height: "calc(100vh - 56px)",
        overflow: "scroll",
      }}
    >
      <Grid
        container
        size={2}
        spacing={1}
        display={"flex"}
        justifyContent={"center"}
        alignContent={"center"}
        flexWrap={"nowrap"}
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
                <HistoryIcon /> Stats
              </p>
            </Grid>
            <Grid size={{ xs: 6, sm: 4, md: 4 }}>
              <Button
                variant="contained"
                style={{
                  width: "100%",
                  textTransform: "capitalize",
                  backgroundColor: "#238b94",
                }}
                className={classes.btnSubmit}
                onClick={() => checkWhatDataToRequest()}
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
            <Grid
              container
              size={6}
            >
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
                <span>Data</span>
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
                <span>{selectedScore.option}</span>
                <div className={classes.containerDrop}>
                  <DescriptionIcon />
                  <DropDownHistory
                    name={"subData"}
                    label={selectedScore.placeholder}
                    className={classes.DropDownHistory}
                    value={subDataSelected[0].name}
                    handleChange={handleChangeSubData}
                    options={subDataDropDown[Number(selectedScore.id) - 1]}
                  />
                </div>
              </Grid>
            </Grid>
            <Grid
              container
              size={6}
            >
              <Grid
                size={12}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                {selectedScore.id === "2" && (
                  <RadioButtonHistory
                    setSelectedOrderBy={setSelectedOrderBy}
                    selectedOrderBy={selectedOrderBy}
                  />
                )}
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
        mb={3}
      >
        {teamsPicked && (
          <Zoom in={true}>
            <Grid size={11}>
              <TableHistory
                arrHistory={teamsPicked}
                score={score}
              />
            </Grid>
          </Zoom>
        )}
        <Zoom in={true}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TableHistoryMostPickedTeams
              arrHistory={mostPickedTeams}
              score={"Top most frequently Picked Teams"}
            />
          </Grid>
        </Zoom>
      </Grid>
    </Grid>
  );
};

export default Stats;
