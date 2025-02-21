import { useEffect, useState } from "react";
import classes from "./Stats.module.css";
import {
  Zoom,
  // Button,
  useMediaQuery,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import HistoryIcon from "@mui/icons-material/History";
import { PodiumIcon } from "@/assets/icons/icons";
// import BallLoader from "../../UI/BallLoader/BallLoader";
import DropDownHistory from "@/components/Inputs/DropdDownHistory";
import { useParams } from "react-router-dom";
import {
  useQuery,
  //  useQueryClient
} from "@tanstack/react-query";
import { getTournaments } from "@/api/HistoryAPI";
import { Tournament } from "@/types/index";
import Loader from "@/components/BallLoader/BallLoader";
import TableHistory from "@/components/Table/TableHistory";
import DescriptionIcon from "@mui/icons-material/Description";
import { dataDropdowndata, subDataDropDown } from "@/utils/dataDropDown";
import RadioButtonHistory from "@/components/Inputs/RadioButtonHistory";
import {
  getLeastPickedTeams,
  getMostPickedTeams,
  getPortfolioSeedSelections,
  getSeedPickTotal,
  getTeamsNotPickedLog,
  getTeamsPicked,
  getTeamsPickedLog,
} from "@/api/StatsAPI";
import TableHistoryMostPickedTeams from "@/components/Table/TableHistoryMostPickedTeams";
import TableTeamsPickedLog from "@/components/Table/TableTeamsPickedLog";
import TableHistoryTeamsNotPicked from "@/components/Table/TableHistoryTeamsNotPicked";
import TableSeedPickTotal from "@/components/Table/TableSeedPickTotal";
import TablePortfolioSeedSelections from "@/components/Table/TablePortfolioSeedSelections";
import SortIcon from "@mui/icons-material/Sort";
import StatsGraphics from "@/components/Graphics/StatsGraphic";
import StatsPortfoliosSelectionsGraphic from "@/components/Graphics/StatsPortfoliosSelectionsGraphic";
import StatsPortfoliosSelectionsGraphicTeamsleastOnce from "@/components/Graphics/StatsPortfoliosSelectionsGraphicTeamsleastOnce";
import StatsPortfoliosSelectionsGraphicPercentLeast from "@/components/Graphics/StatsPortfoliosSelectionsGraphicPercentLeast";

const Stats = () => {
  const params = useParams();
  const userId = params.userId!;
  // const queryClient = useQueryClient();
  const isMobile = useMediaQuery("(max-width:900px)");

  const optionsOrder = [
    {
      id: "1",
      value: "Score (Desc)",
      name: "Score (Desc)",
    },
    {
      id: "2",
      value: "Portfolio (Asc)",
      name: "Portfolio (Asc)",
    },
    {
      id: "3",
      value: "Weight (Desc)",
      name: "Weight (Desc)",
    },
    {
      id: "4",
      value: "Weight (Asc)",
      name: "Weight (Asc)",
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
  const [score, setScore] = useState("Score");
  const [runMostTeamsPicked, setRunMostTeamsPicked] = useState(false);
  const [runSubDataPortfolios, setRunSubDataPortfolios] = useState(false);
  const [selectedScore, setSelectedScore] = useState({
    name: "Score",
    id: "1",
    option: "Score",
    placeholder: "Current Score",
  });

  const [subDataSelected, setSubDataSelected] = useState(subDataDropDown[0]);
  const [idSubDataSelected, setIdSubDataSelected] = useState(0);

  const [selectedTournament, setSelectedTournament] = useState({ id: 1 });
  // const [pointsPerRound, setPointsPerRound] = useState([]);
  const [selectedOrderBy, setSelectedOrderBy] = useState("1");
  const [orderOptionSelected, setOrderOptionSelected] = useState(
    optionsOrder[0]
  );

  useEffect(() => {
    if (tournaments) {
      const current = tournaments.filter((el: Tournament) => el?.current)[0];

      setTournament(current?.name);
      // setScore("Score");
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
      setIdSubDataSelected(0);
    } else if (e?.target?.name === "dataDropdowndata") {
      const optionSelect = dataDropdowndata.filter(
        (el: dataDropdowndataType) => el?.name === e?.target?.value
      )[0];
      setScore(e?.target?.value);
      setSelectedScore(optionSelect);
      setSubDataSelected(subDataDropDown[+optionSelect.id - 1]);
      setIdSubDataSelected(0);
      setRunMostTeamsPicked(true);
    }
    if (e.target.value === "Portfolios") {
      setRunSubDataPortfolios(true);
    }
  };
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const handleChangeOrder = (e) => {
    const selected = optionsOrder.filter(
      (opt) => opt.name === e.target.value
    )[0];
    setOrderOptionSelected(selected);
    setSelectedOrderBy(selected.id);
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const handleChangeSubData = (e) => {
    const selected = subDataSelected.filter(
      (data) => data.name === e.target.value
    );
    setIdSubDataSelected(+selected[0].id - 1);
  };

  const { data: teamsPicked, isLoading: isLoadingTeamsPicked } = useQuery({
    queryKey: [
      "teamsPicked",
      selectedOrderBy,
      idSubDataSelected,
      selectedTournament.id,
    ],
    queryFn: () =>
      getTeamsPicked(
        `${selectedTournament.id}`,
        `${idSubDataSelected}`,
        selectedOrderBy
      ),
  });

  const { data: mostPickedTeams, isLoading: isLoadingMostPickedTeams } =
    useQuery({
      queryKey: ["mostPickedTeams", userId],
      queryFn: () => getMostPickedTeams(selectedTournament.id),
      enabled: runMostTeamsPicked,
    });

  const { data: TeamsPickedLog, isLoading: isLoadinTeamsPickedLog } = useQuery({
    queryKey: ["TeamsPickedLog", userId],
    queryFn: () => getTeamsPickedLog(selectedTournament.id),
    enabled: runMostTeamsPicked,
  });

  const { data: leastPickedTeams, isLoading: isLoadinLeastPickedTeams } =
    useQuery({
      queryKey: ["leastPickedTeams", userId],
      queryFn: () => getLeastPickedTeams(selectedTournament.id),
      enabled: runMostTeamsPicked,
    });

  const { data: teamsNotPickedLog, isLoading: isLoadinTeamsNotPickedLog } =
    useQuery({
      queryKey: ["teamsNotPickedLog", userId],
      queryFn: () => getTeamsNotPickedLog(selectedTournament.id),
      enabled: runMostTeamsPicked,
    });

  const { data: seedPickTotal, isLoading: isLoadinSeedPickTotal } = useQuery({
    queryKey: ["seedPickTotal", userId],
    queryFn: () => getSeedPickTotal(selectedTournament.id),
    enabled: runSubDataPortfolios,
  });

  const {
    data: portfolioSeedSelections,
    isLoading: isLoadinPortfolioSeedSelections,
  } = useQuery({
    queryKey: ["portfolioSeedSelections", userId],
    queryFn: () => getPortfolioSeedSelections(selectedTournament.id),
    enabled: runSubDataPortfolios,
  });

  if (
    isLoading ||
    isLoadingTeamsPicked ||
    isLoadingMostPickedTeams ||
    isLoadinTeamsPickedLog ||
    isLoadinLeastPickedTeams ||
    isLoadinTeamsNotPickedLog ||
    isLoadinSeedPickTotal ||
    isLoadinPortfolioSeedSelections
  )
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
              {/* <Button
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
              </Button> */}
            </Grid>
          </Grid>
          <Grid
            container
            className={classes.subBoxHistory}
            size={{ xs: 12, md: 12 }}
            flexWrap={"wrap"}
          >
            <Grid
              container
              size={{ xs: 12, md: 6 }}
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
                    value={subDataSelected[idSubDataSelected].name}
                    handleChange={handleChangeSubData}
                    options={subDataDropDown[Number(selectedScore.id) - 1]}
                  />
                </div>
              </Grid>
            </Grid>
            <Grid
              container
              size={{ xs: 12, md: 6 }}
            >
              <Grid
                size={12}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                {selectedScore.id === "1" && !isMobile && (
                  <RadioButtonHistory
                    setSelectedOrderBy={setSelectedOrderBy}
                    selectedOrderBy={selectedOrderBy}
                  />
                )}
                {selectedScore.id === "1" && isMobile && (
                  <div style={{ width: "100%" }}>
                    <span>{"OrderBy"}</span>
                    <div className={classes.containerDrop}>
                      <SortIcon />
                      <DropDownHistory
                        name={"orderBy"}
                        label={"OrderBy"}
                        className={classes.DropDownHistory}
                        value={orderOptionSelected.value}
                        handleChange={handleChangeOrder}
                        options={optionsOrder}
                      />
                    </div>
                  </div>
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
        {teamsPicked &&
          typeof teamsPicked !== "string" &&
          score === "Score" && (
            <Zoom in={true}>
              <Grid size={11}>
                <TableHistory
                  arrHistory={teamsPicked}
                  score={score}
                />
              </Grid>
            </Zoom>
          )}

        {score === "Teams" && (
          <Zoom in={true}>
            <Grid
              container
              size={{ xs: 11, md: 10 }}
              spacing={1}
            >
              <Grid
                size={{ xs: 12, md: 6 }}
                container
                spacing={2}
                style={{ height: "fit-content" }}
                justifyContent={"center"}
              >
                <Grid>
                  {mostPickedTeams && typeof mostPickedTeams !== "string" && (
                    <TableHistoryMostPickedTeams
                      arrHistory={mostPickedTeams}
                      score={"Top 10 Most Frequently Picked Teams"}
                      least={false}
                    />
                  )}
                </Grid>
                <Grid>
                  {leastPickedTeams && typeof leastPickedTeams !== "string" && (
                    <TableHistoryMostPickedTeams
                      arrHistory={leastPickedTeams}
                      score={
                        "Least Frequently Picked Teams Among Teams Picked at Least Once"
                      }
                      least={true}
                    />
                  )}
                </Grid>

                {teamsNotPickedLog && typeof teamsNotPickedLog !== "string" && (
                  <Grid>
                    <TableHistoryTeamsNotPicked
                      arrHistory={teamsNotPickedLog}
                      score={"Teams Not Picked"}
                    />
                  </Grid>
                )}
              </Grid>
              <Grid
                container
                size={{ xs: 12, md: 6 }}
                spacing={1}
              >
                <Grid>
                  {TeamsPickedLog && typeof TeamsPickedLog !== "string" && (
                    <TableTeamsPickedLog
                      arrHistory={TeamsPickedLog}
                      score={"Frequency of Teams Picked"}
                    />
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Zoom>
        )}

        {score === "Portfolios" && (
          <Zoom in={true}>
            <Grid
              size={11}
              container
              spacing={2}
            >
              <Grid
                size={{ xs: 12, md: 6 }}
                flexWrap={"wrap"}
                display={"flex"}
                justifyContent={"space-around"}
              >
                <Grid
                  size={{ xs: 12, md: 6 }}
                  mb={1}
                >
                  {seedPickTotal && typeof seedPickTotal !== "string" && (
                    <TableSeedPickTotal
                      arrHistory={seedPickTotal}
                      score={"Picks By Seed"}
                    />
                  )}
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  {portfolioSeedSelections &&
                    typeof portfolioSeedSelections !== "string" && (
                      <TablePortfolioSeedSelections
                        arrHistory={portfolioSeedSelections}
                        score={"Seed Picked in Portfolio \n (at least once)"}
                      />
                    )}
                </Grid>
              </Grid>
              <Grid
                size={{ xs: 12, md: 6 }}
                flexWrap={"wrap"}
                display={"flex"}
                justifyContent={"space-around"}
              >
                <Grid size={12}>
                  {seedPickTotal && typeof seedPickTotal !== "string" && (
                    <StatsGraphics
                      graphType={"ColumnChart"}
                      data={seedPickTotal}
                      title={"Number of Picks by Seed"}
                    />
                  )}
                </Grid>
                <Grid
                  size={12}
                  mt={1}
                >
                  {seedPickTotal && typeof seedPickTotal !== "string" && (
                    <StatsPortfoliosSelectionsGraphic
                      graphType={"ColumnChart"}
                      data={seedPickTotal}
                      title={"Percentage of Picks by Seed"}
                    />
                  )}
                </Grid>
                <Grid
                  size={12}
                  mt={1}
                >
                  {portfolioSeedSelections &&
                    typeof portfolioSeedSelections !== "string" && (
                      <StatsPortfoliosSelectionsGraphicTeamsleastOnce
                        graphType={"ColumnChart"}
                        data={portfolioSeedSelections}
                        title={"Teams Seed Picked at Least Once"}
                      />
                    )}
                </Grid>
                <Grid
                  size={12}
                  mt={1}
                >
                  {portfolioSeedSelections &&
                    typeof portfolioSeedSelections !== "string" && (
                      <StatsPortfoliosSelectionsGraphicPercentLeast
                        graphType={"ColumnChart"}
                        data={portfolioSeedSelections}
                        title={"Percentage Seed Picked at Least Once)"}
                      />
                    )}
                </Grid>
              </Grid>
            </Grid>
          </Zoom>
        )}
      </Grid>
    </Grid>
  );
};

export default Stats;
