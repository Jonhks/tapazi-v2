import { useEffect, useState } from "react";
import classes from "./StatsFemale.module.css";
import {
  Zoom,
  // Button,
  // useMediaQuery,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
// import HistoryIcon from "@mui/icons-material/History";
import DropDownHistory from "../../components/Inputs/DropdDownHistory";
import { useParams } from "react-router-dom";
import {
  useQuery,
  //  useQueryClient
} from "@tanstack/react-query";
// import { getTournaments } from "@/api/HistoryAPI";
import { Tournament } from "@/types/index";
import Loader from "../../components/BallLoader/BallLoader";
// import TableHistory from "../../components/Table/TableHistory";
// import DescriptionIcon from "@mui/icons-material/Description";
import { dataDropdowndata, subDataDropDown } from "@/utils/dataDropDown";
// import {
// getMostPickedTeams,
// getTeamsPicked,
// } from "@/api/StatsAPI";
import {
  getTournaments,
  getTeamsPickedFemale,
  getMostPickedTeamsFemale,
  getLeastPickedTeamsFemale,
  getTeamsNotPickedLogFemale,
  getTeamsPickedLogFemale,
  getSeedPickTotalFemale,
  getPortfolioSeedSelectionsFemale,
} from "@/api/female/StatsFemaleAPI";
import TableTeamsPicked from "../../components/Table/TableTeamsPicked";
import TableHistoryMostPickedTeams from "../../components/Table/TableHistoryMostPickedTeams";
import TableTeamsPickedLog from "../../components/Table/TableTeamsPickedLog";
import TableHistoryTeamsNotPicked from "../../components/Table/TableHistoryTeamsNotPicked";
import TableSeedPickTotal from "../../components/Table/TableSeedPickTotal";
import TablePortfolioSeedSelections from "../../components/Table/TablePortfolioSeedSelections";
// import SortIcon from "@mui/icons-material/Sort";
import NoData from "@/components/NoData/NoData";
import StatsGraphics from "../../components/Graphics/StatsGraphic";
import StatsPortfoliosSelectionsGraphic from "../../components/Graphics/StatsPortfoliosSelectionsGraphic";
import StatsPortfoliosSelectionsGraphicTeamsleastOnce from "../../components/Graphics/StatsPortfoliosSelectionsGraphicTeamsleastOnce";
import StatsPortfoliosSelectionsGraphicPercentLeast from "../../components/Graphics/StatsPortfoliosSelectionsGraphicPercentLeast";

const Stats = () => {
  const params = useParams();
  const userId = params.userId!;
  // const queryClient = useQueryClient();
  // const isMobile = useMediaQuery("(max-width:900px)");

  // const optionsOrder = [
  //   {
  //     id: "1",
  //     value: "Score (Desc)",
  //     name: "Score (Desc)",
  //   },
  //   {
  //     id: "2",
  //     value: "Portfolio (Asc)",
  //     name: "Portfolio (Asc)",
  //   },
  //   {
  //     id: "3",
  //     value: "Weight (Desc)",
  //     name: "Weight (Desc)",
  //   },
  //   {
  //     id: "4",
  //     value: "Weight (Asc)",
  //     name: "Weight (Asc)",
  //   },
  // ];

  type dataDropdowndataType = {
    name: string;
    id: string;
  };

  const { data: tournaments, isLoading } = useQuery({
    queryKey: ["tournaments", userId],
    queryFn: () => getTournaments(),
  });

  // console.log(tournaments);
  // const [selectedWeekLabel, setSelectedWeekLabel] = useState("");

  const [tournament, setTournament] = useState("");
  const [score, setScore] = useState("Score");
  // const [runMostTeamsPicked, setRunMostTeamsPicked] = useState(false);
  // const [runSubDataPortfolios, setRunSubDataPortfolios] = useState(false);
  const [selectedScore, setSelectedScore] = useState({
    name: "Score",
    id: "1",
    option: "Data",
    placeholder: "Data",
  });

  const [subDataSelected, setSubDataSelected] = useState(subDataDropDown[0]);
  const [idSubDataSelected, setIdSubDataSelected] = useState(0);
  const [round, setRound] = useState(8);

  const [selectedTournament, setSelectedTournament] = useState({ id: 1 });
  // const [pointsPerRound, setPointsPerRound] = useState([]);
  // const [selectedOrderBy, setSelectedOrderBy] = useState("1");
  // const [orderOptionSelected, setOrderOptionSelected] = useState(
  //   optionsOrder[0],
  // );

  useEffect(() => {
    if (tournaments) {
      setTournament(tournaments[0]?.name);
      setSelectedTournament(tournaments[0]);
    }
  }, [tournaments]);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const handleChange = (e) => {
    if (e?.target?.name === "tournament") {
      const optionSelect = tournaments.filter(
        (el: Tournament) => el?.name === e?.target?.value,
      )[0];
      setTournament(e?.target?.value);
      setSelectedTournament(optionSelect);
      setIdSubDataSelected(0);
    } else if (e?.target?.name === "dataDropdowndata") {
      const optionSelect = dataDropdowndata.filter(
        (el: dataDropdowndataType) => el?.name === e?.target?.value,
      )[0];
      setScore(e?.target?.value);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      setSelectedScore(optionSelect);
      setSubDataSelected(subDataDropDown[+optionSelect.id - 1]);
      setIdSubDataSelected(0);
      // setRunMostTeamsPicked(true);
    }
    if (e.target.value === "Portfolios") {
      // setRunSubDataPortfolios(true);
    }
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const handleChangeSubData = (e) => {
    const selected = subDataSelected.filter(
      (data) => data.name === e.target.value,
    );
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setRound(+selected[0].round);
    setIdSubDataSelected(+selected[0].id - 1);
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const mapTeamsPickedRow = (row) => ({
    portfolioName: row.portfolio_name,
    portfolioWeight: row.portfolio_weight,
    team1Name: row.team1_name,
    team2Name: row.team2_name,
    team3Name: row.team3_name,
    team4Name: row.team4_name,
    team5Name: row.team5_name,
    team6Name: row.team6_name,
    team7Name: row.team7_name,
    team8Name: row.team8_name,
    wins: row.wins,
    score: row.score,
    eliminatedTeams: row.eliminated_teams,
  });

  const { data: teamsPickedRaw, isLoading: isLoadingTeamsPicked } = useQuery({
    queryKey: ["teamsPicked", round, selectedTournament?.id],
    queryFn: () => getTeamsPickedFemale(selectedTournament!.id, round),
    enabled: !!selectedTournament?.id && score === "Score",
    retry: false,
  });

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const teamsPicked = teamsPickedRaw?.map(mapTeamsPickedRow);

  const { data: mostPickedTeams, isLoading: isLoadingMostPickedTeams } =
    useQuery({
      queryKey: ["mostPickedTeamsFemale", userId],
      queryFn: () => getMostPickedTeamsFemale(selectedTournament!.id),
      enabled: !!selectedTournament?.id && score === "Teams",
      retry: false,
    });

  // console.log(mostPickedTeams);

  const { data: TeamsPickedLog, isLoading: isLoadinTeamsPickedLog } = useQuery({
    queryKey: ["TeamsPickedLogFemale", userId],
    queryFn: () => getTeamsPickedLogFemale(selectedTournament.id),
    enabled: !!selectedTournament?.id && score === "Teams",
    retry: false,
  });

  const { data: leastPickedTeams, isLoading: isLoadinLeastPickedTeams } =
    useQuery({
      queryKey: ["leastPickedTeamsFemale", userId],
      queryFn: () => getLeastPickedTeamsFemale(selectedTournament.id),
      enabled: !!selectedTournament?.id && score === "Teams",
      retry: false,
    });

  const { data: teamsNotPickedLog, isLoading: isLoadinTeamsNotPickedLog } =
    useQuery({
      queryKey: ["teamsNotPickedLogFemale", userId],
      queryFn: () => getTeamsNotPickedLogFemale(selectedTournament.id),
      enabled: !!selectedTournament?.id && score === "Teams",
      retry: false,
    });

  const { data: seedPickTotal, isLoading: isLoadinSeedPickTotal } = useQuery({
    queryKey: ["seedPickTotalFemale", userId],
    queryFn: () => getSeedPickTotalFemale(selectedTournament.id),
    enabled: !!selectedTournament?.id && score === "Portfolios",
    retry: false,
  });

  const {
    data: portfolioSeedSelections,
    isLoading: isLoadinPortfolioSeedSelections,
  } = useQuery({
    queryKey: ["portfolioSeedSelectionsFemale", userId],
    queryFn: () => getPortfolioSeedSelectionsFemale(selectedTournament.id),
    enabled: !!selectedTournament?.id && score === "Portfolios",
    retry: false,
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
  ) {
    // console.log("loading");
    return <Loader />;
  }

  return (
    <Grid
      style={{
        minHeight: "700px",
        height: "calc(100vh - 56px)",
        overflowY: "auto",
      }}
      className={`${classes.gridInstructions} enable-vertical-scroll`}
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
          size={{ xs: 10, md: 8 }}
          m={1}
          className={`${classes.boxHistory} ${classes.active}`}
          id="first"
        >
          <Grid
            size={12}
            className={classes.containerHeadHistory}
          >
            <Grid size={{ xs: 12 }}>
              <p className={classes.titleBox}>
                <TextSnippetIcon /> STATS
              </p>
            </Grid>
          </Grid>
          <Grid
            container
            className={classes.subBoxHistory}
            size={{ xs: 12, md: 12 }}
            justifyContent={"center"}
            flexWrap={"wrap"}
          >
            <Grid
              container
              size={{ xs: 12, md: 10 }}
              // style={{ border: "1px solid #05fa05", padding: 16 }}
            >
              <Grid size={12}>
                <span>Tournament:</span>
                <div className={classes.containerDrop}>
                  {/* <TextSnippetIcon /> */}
                  <DropDownHistory
                    name={"tournament"}
                    label={""}
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
                  {/* <DescriptionIcon /> */}
                  <DropDownHistory
                    name={"dataDropdowndata"}
                    label={""}
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
                  {/* <DescriptionIcon /> */}
                  <DropDownHistory
                    name={"subData"}
                    label={""}
                    className={classes.DropDownHistory}
                    value={subDataSelected[idSubDataSelected].name}
                    handleChange={handleChangeSubData}
                    options={subDataDropDown[Number(selectedScore.id) - 1]}
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
        mb={3}
      >
        {score === "Score" && (
          <Zoom in={true}>
            <Grid size={11}>
              {isLoadingTeamsPicked ? (
                <p style={{ color: "white", textAlign: "center" }}>
                  Loading...
                </p>
              ) : teamsPicked && teamsPicked.length > 0 ? (
                <TableTeamsPicked
                  title={subDataSelected[idSubDataSelected].name || ""}
                  arrHistory={teamsPicked}
                />
              ) : (
                <NoData message="No score data available" />
              )}
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
                  {isLoadingMostPickedTeams ? (
                    <p style={{ color: "white", textAlign: "center" }}>
                      Loading...
                    </p>
                  ) : (
                    mostPickedTeams && (
                      <TableHistoryMostPickedTeams
                        arrHistory={mostPickedTeams}
                        score={"Top 10 Most Frequently Picked Teams"}
                        least={false}
                      />
                    )
                  )}
                </Grid>
                <Grid>
                  {isLoadinLeastPickedTeams ? (
                    <p style={{ color: "white", textAlign: "center" }}>
                      Loading...
                    </p>
                  ) : (
                    leastPickedTeams && (
                      <TableHistoryMostPickedTeams
                        arrHistory={leastPickedTeams}
                        score={
                          "Least Frequently Picked Teams Among Teams Picked at Least Once"
                        }
                        least={true}
                      />
                    )
                  )}
                </Grid>

                {isLoadinTeamsNotPickedLog ? (
                  <p style={{ color: "white", textAlign: "center" }}>
                    Loading...
                  </p>
                ) : (
                  teamsNotPickedLog && (
                    <Grid>
                      <TableHistoryTeamsNotPicked
                        arrHistory={teamsNotPickedLog}
                        score={"Teams Not Picked"}
                      />
                    </Grid>
                  )
                )}
              </Grid>
              <Grid
                container
                size={{ xs: 12, md: 6 }}
                spacing={1}
              >
                <Grid>
                  {isLoadinTeamsPickedLog ? (
                    <p style={{ color: "white", textAlign: "center" }}>
                      Loading...
                    </p>
                  ) : (
                    TeamsPickedLog && (
                      <TableTeamsPickedLog
                        arrHistory={TeamsPickedLog}
                        score={"Frequency of Teams Picked"}
                      />
                    )
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
                  {isLoadinSeedPickTotal ? (
                    <p style={{ color: "white", textAlign: "center" }}>
                      Loading...
                    </p>
                  ) : (
                    seedPickTotal && (
                      <TableSeedPickTotal
                        arrHistory={seedPickTotal}
                        score={"Picks By Seed"}
                      />
                    )
                  )}
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  {isLoadinPortfolioSeedSelections ? (
                    <p style={{ color: "white", textAlign: "center" }}>
                      Loading...
                    </p>
                  ) : (
                    portfolioSeedSelections && (
                      <TablePortfolioSeedSelections
                        arrHistory={portfolioSeedSelections}
                        score={"Seed Picked in Portfolio \n (at least once)"}
                      />
                    )
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
                  {isLoadinSeedPickTotal ? (
                    <p style={{ color: "white", textAlign: "center" }}>
                      Loading...
                    </p>
                  ) : (
                    seedPickTotal && (
                      <StatsGraphics
                        graphType={"ColumnChart"}
                        data={seedPickTotal}
                        title={"Number of Picks by Seed"}
                      />
                    )
                  )}
                </Grid>
                <Grid
                  size={12}
                  mt={1}
                >
                  {isLoadinSeedPickTotal ? (
                    <p style={{ color: "white", textAlign: "center" }}>
                      Loading...
                    </p>
                  ) : (
                    seedPickTotal && (
                      <StatsPortfoliosSelectionsGraphic
                        graphType={"ColumnChart"}
                        data={seedPickTotal}
                        title={"Percentage of Picks by Seed"}
                      />
                    )
                  )}
                </Grid>
                <Grid
                  size={12}
                  mt={1}
                >
                  {isLoadinPortfolioSeedSelections ? (
                    <p style={{ color: "white", textAlign: "center" }}>
                      Loading...
                    </p>
                  ) : (
                    portfolioSeedSelections && (
                      <StatsPortfoliosSelectionsGraphicTeamsleastOnce
                        graphType={"ColumnChart"}
                        data={portfolioSeedSelections}
                        title={"Teams Seed Picked at Least Once"}
                      />
                    )
                  )}
                </Grid>
                <Grid
                  size={12}
                  mt={1}
                >
                  {isLoadinPortfolioSeedSelections ? (
                    <p style={{ color: "white", textAlign: "center" }}>
                      Loading...
                    </p>
                  ) : (
                    portfolioSeedSelections && (
                      <StatsPortfoliosSelectionsGraphicPercentLeast
                        graphType={"ColumnChart"}
                        data={portfolioSeedSelections}
                        title={"Percentage Seed Picked at Least Once)"}
                      />
                    )
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
