import { useEffect, useState } from "react";
import classes from "./Stats.module.css";
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
  // useQueryClient,
} from "@tanstack/react-query";
import { getTournaments } from "@/api/HistoryAPI";
import { Tournament } from "@/types/index";
// import Loader from "../../components/BallLoader/BallLoader";
// import TableHistory from "../../components/Table/TableHistory";
// import DescriptionIcon from "@mui/icons-material/Description";
// import RadioButtonHistory from "../../components/Inputs/RadioButtonHistory";
// import {
//   getLeastPickedTeams,
//   getMostPickedTeams,
//   getPortfolioSeedSelections,
//   getSeedPickTotal,
//   getTeamsPickedLog,
// } from "@/api/StatsAPI";
import TableHistoryMostPickedTeams from "../../components/Table/TableHistoryMostPickedTeams";
import TableTeamsPickedLog from "../../components/Table/TableTeamsPickedLog";
import TableHistoryTeamsNotPicked from "../../components/Table/TableHistoryTeamsNotPicked";
// import TableSeedPickTotal from "../../components/Table/TableSeedPickTotal";
// import TablePortfolioSeedSelections from "../../components/Table/TablePortfolioSeedSelections";
// import SortIcon from "@mui/icons-material/Sort";
// import StatsGraphics from "../../components/Graphics/StatsGraphic";
// import StatsPortfoliosSelectionsGraphic from "../../components/Graphics/StatsPortfoliosSelectionsGraphic";
// import StatsPortfoliosSelectionsGraphicTeamsleastOnce from "../../components/Graphics/StatsPortfoliosSelectionsGraphicTeamsleastOnce";
// import StatsPortfoliosSelectionsGraphicPercentLeast from "../../components/Graphics/StatsPortfoliosSelectionsGraphicPercentLeast";
import { dataDropdowndata, subDataDropDown } from "@/utils/dataDropDown";
import {
  getScoreWeeksMale,
  getTeamsPicked,
  getPortfolioStatsWeek,
  getNcaaMaleTeams,
  getMostPickedTeams,
  getLeastPickedTeams,
  getTeamsNotPickedLog,
  getTeamsPickedLog,
} from "@/api/StatsAPI";
import TablePortfolioWeekStats from "../../components/Table/TablePortfolioWeekStats";
import TableTeamsPicked from "../../components/Table/TableTeamsPicked";
import NoData from "@/components/NoData/NoData";

type Week = { week: number; label: string };

const Stats = () => {
  const params = useParams();
  const userId = params.userId!;
  // const queryClient = useQueryClient();
  // const isMobile = useMediaQuery("(max-width:900px)");

  // const optionsOrder = [
  //   { id: "1", value: "Score (Desc)", name: "Score (Desc)" },
  //   { id: "2", value: "Portfolio (Asc)", name: "Portfolio (Asc)" },
  //   { id: "3", value: "Weight (Desc)", name: "Weight (Desc)" },
  //   { id: "4", value: "Weight (Asc)", name: "Weight (Asc)" },
  // ];

  // type dataDropdowndataType = {
  //   name: string;
  //   id: string;
  // };

  const { data: tournaments } = useQuery({
    queryKey: ["tournaments", userId],
    queryFn: () => getTournaments(),
  });

  const [tournament, setTournament] = useState("");
  const [score, setScore] = useState("Portfolios");
  const [selectedScore, setSelectedScore] = useState({
    name: "Portfolios",
    id: "3",
    option: "Weeks",
    placeholder: "Weeks",
  });
  const [subDataSelected, setSubDataSelected] = useState(subDataDropDown[2]);
  const [idSubDataSelected, setIdSubDataSelected] = useState(0);
  const [round, setRound] = useState(1);
  const [selectedTournament, setSelectedTournament] =
    useState<Tournament | null>(null);
  const [selectedWeekLabel, setSelectedWeekLabel] = useState("");

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
      setSelectedWeekLabel("");
    } else if (e?.target?.name === "dataDropdowndata") {
      const optionSelect = dataDropdowndata.filter(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        (el) => el?.name === e?.target?.value,
      )[0];
      setScore(e?.target?.value);
      setSelectedScore(optionSelect);
      setSubDataSelected(subDataDropDown[+optionSelect.id - 1]);
      setIdSubDataSelected(0);
      setSelectedWeekLabel("");
      setRound(1);
    }
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // const handleChangeOrder = (e) => {
  //   // const selected = optionsOrder.filter(
  //   //   (opt) => opt.name === e.target.value,
  //   // )[0];
  //   // setOrderOptionSelected(selected);
  //   // setSelectedOrderBy(e.target.value);
  // };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const handleChangeSubData = (e) => {
    const selected = subDataSelected.filter(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      (data) => data.name === e.target.value,
    );
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setRound(+selected[0].current_round);
    setIdSubDataSelected(+selected[0].id - 1);
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const handleChangeWeek = (e) => {
    const selected = scoreWeeksMaleData?.find(
      (w: Week) => w.label === e.target.value,
    );
    if (selected) {
      setRound(selected.week);
      setSelectedWeekLabel(selected.label);
    }
  };

  const { data: scoreWeeksMaleData } = useQuery({
    queryKey: ["scoreWeeksMale", selectedTournament?.id],
    queryFn: () => getScoreWeeksMale(selectedTournament!.id),
    enabled: !!selectedTournament?.id,
    retry: false,
  });

  useEffect(() => {
    if (
      scoreWeeksMaleData?.length &&
      selectedScore.id === "3" &&
      selectedWeekLabel === ""
    ) {
      const first = scoreWeeksMaleData[0] as Week;
      setRound(first.week);
      setSelectedWeekLabel(first.label);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scoreWeeksMaleData, selectedScore.id]);

  const weeksOptions =
    scoreWeeksMaleData?.map((w: Week) => ({
      id: String(w.week),
      name: w.label,
    })) ?? [];

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
    queryFn: () => getTeamsPicked(selectedTournament!.id, round),
    enabled: !!selectedTournament?.id && score === "Score",
    retry: false,
  });

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const teamsPicked = teamsPickedRaw?.map(mapTeamsPickedRow);

  const { data: portfolioStatsData, isLoading: isLoadingPortfolioStats } =
    useQuery({
      queryKey: ["portfolioStatsWeek", round],
      queryFn: () => getPortfolioStatsWeek(round),
      enabled:
        score === "Portfolios" &&
        selectedScore.id === "3" &&
        selectedWeekLabel !== "",
      retry: false,
    });

  const { data: ncaaMaleTeams } = useQuery({
    queryKey: ["ncaaMaleTeams", selectedTournament?.id],
    queryFn: () => getNcaaMaleTeams(selectedTournament!.id),
    enabled: !!selectedTournament?.id && score === "Portfolios",
    retry: false,
  });

  const { data: mostPickedTeamsRaw, isLoading: isLoadingMostPickedTeams } =
    useQuery({
      queryKey: ["mostPickedTeams", selectedTournament?.id],
      queryFn: () => getMostPickedTeams(selectedTournament!.id),
      enabled: !!selectedTournament?.id && score === "Teams",
      retry: false,
    });

  const { data: TeamsPickedLog, isLoading: isLoadinTeamsPickedLog } = useQuery({
    queryKey: ["TeamsPickedLog", userId, selectedTournament?.id],
    queryFn: () => getTeamsPickedLog(selectedTournament!.id),
    enabled: !!selectedTournament?.id && score === "Teams",
    retry: false,
  });

  console.log(TeamsPickedLog);

  const { data: leastPickedTeams, isLoading: isLoadinLeastPickedTeams } =
    useQuery({
      queryKey: ["leastPickedTeams", selectedTournament?.id],
      queryFn: () => getLeastPickedTeams(selectedTournament!.id),
      enabled: !!selectedTournament?.id && score === "Teams",
      retry: false,
    });

  const { data: teamsNotPickedLog, isLoading: isLoadinTeamsNotPickedLog } =
    useQuery({
      queryKey: ["teamsNotPickedLog", selectedTournament?.id],
      queryFn: () => getTeamsNotPickedLog(selectedTournament!.id),
      enabled: !!selectedTournament?.id && score === "Teams",
      retry: false,
    });

  console.log(teamsNotPickedLog);

  // const { data: seedPickTotal, isLoading: isLoadinSeedPickTotal } = useQuery({
  //   queryKey: ["seedPickTotal", userId],
  //   queryFn: () => getSeedPickTotal(selectedTournament.id),
  //   enabled: runSubDataPortfolios,
  //   retry: false,
  // });

  // const {
  //   data: portfolioSeedSelections,
  //   isLoading: isLoadinPortfolioSeedSelections,
  // } = useQuery({
  //   queryKey: ["portfolioSeedSelections", userId],
  //   queryFn: () => getPortfolioSeedSelections(selectedTournament.id),
  //   enabled: runSubDataPortfolios,
  //   retry: false,
  // });

  // console.log(mostPickedTeamsRaw);

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
            flexWrap={"wrap"}
            justifyContent={"center"}
          >
            <Grid
              container
              size={{ xs: 12, md: 10 }}
            >
              <Grid size={12}>
                <span>Tournament:</span>
                <div className={classes.containerDrop}>
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
                  {selectedScore.id === "3" && weeksOptions.length > 0 ? (
                    <DropDownHistory
                      name={"weeks"}
                      label={""}
                      className={classes.DropDownHistory}
                      value={selectedWeekLabel}
                      handleChange={handleChangeWeek}
                      options={weeksOptions}
                    />
                  ) : (
                    <DropDownHistory
                      name={"subData"}
                      label={""}
                      className={classes.DropDownHistory}
                      value={subDataSelected[idSubDataSelected].name}
                      handleChange={handleChangeSubData}
                      options={subDataDropDown[Number(selectedScore.id) - 1]}
                    />
                  )}
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
                  arrHistory={teamsPicked}
                  weekLabel={selectedWeekLabel}
                />
              ) : (
                <NoData message="No score data available" />
              )}
            </Grid>
          </Zoom>
        )}

        {score === "Portfolios" && selectedWeekLabel !== "" && (
          <Zoom in={true}>
            <Grid size={11}>
              {isLoadingPortfolioStats ? (
                <p style={{ color: "white", textAlign: "center" }}>
                  Loading...
                </p>
              ) : portfolioStatsData && portfolioStatsData.length > 0 ? (
                <TablePortfolioWeekStats
                  statsData={portfolioStatsData}
                  teamsData={ncaaMaleTeams ?? []}
                  weekLabel={selectedWeekLabel}
                />
              ) : (
                <NoData message="No portfolio data available" />
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
                  ) : mostPickedTeamsRaw && mostPickedTeamsRaw.length > 0 ? (
                    <TableHistoryMostPickedTeams
                      arrHistory={mostPickedTeamsRaw}
                      score={"Top 10 Most Frequently Picked Teams"}
                      least={false}
                    />
                  ) : (
                    <NoData message="No teams data available" />
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
                  {TeamsPickedLog && (
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

        {/* {score === "Portfolios" && (
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
        )} */}
      </Grid>
    </Grid>
  );
};

export default Stats;
