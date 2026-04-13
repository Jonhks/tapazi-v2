import React, { useCallback, useEffect, useMemo, useState } from "react";
import classes from "./HistoryFemale.module.css";
import { Zoom } from "@mui/material";
import Grid from "@mui/material/Grid2";
import HistoryIcon from "@mui/icons-material/History";
import DropDownHistory from "../../components/Inputs/DropdDownHistory";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  getTeamsHistoricAllRoundsFemale,
  getTeamsPerfectPortfoliosFemale,
  getTeamsPerYearLogFemale,
  // getTeamsPickedLogHistoryFemale,
  getTournaments,
} from "@/api/female/HistoryFemaleAPI";
// import { Tournament } from "@/types/index";
import Loader from "../../components/BallLoader/BallLoader";
import TableHistoryTeamsPerYearLog from "@/shared/components/Table/TableHistoryTeamsPerYearLog";
// import TableHistoryTeamsPerYearLogSelected from "@/shared/components/Table/TableHistoryTeamsPerYearLogSelected";
import TableHistoryPerfectPortfolios from "@/shared/components/Table/TableHistoryPerfectPortfolios";
// import TableHistoryPerfectPortfoliosSelected from "@/shared/components/Table/TableHistoryPerfectPortfoliosSelected";
import TableHistoryAllRounds from "@/shared/components/Table/TableHistoryAllRounds";
import { sportThemes } from "@/shared/theme/colors";
// import DescriptionIcon from "@mui/icons-material/Description";
import TeamPerYearlogGraphic from "../../components/Graphics/TeamPerYearLogGraphic";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import { typeGraphs } from "@/utils/typeGraphs";
import TeamPerfectPortfoliosGraphic from "../../components/Graphics/TeamPerfectPortfoliosGraphic";
// import NotRecordFounds from "../../components/NotRecordsFound/NotRecordFounds";
import { Tournament } from "@/types/index";

type dataDropdowndataType = {
  name: string;
  id: string;
};

const HistoryFemale = () => {
  const params = useParams();
  const userId = params.userId!;

  const [graphType, setGraphType] = useState(typeGraphs[0]);
  const [selectedTournament, setSelectedTournament] =
    useState<Tournament | null>(null);
  const [TeamPerfectPortfoliosSelected, SeteamPerfectPortfoliosSelected] =
    useState<number>(0);
  const [teamsPerYearLogSelected, setTeamsPerYearLogSelected] =
    useState<number>(0);

  console.log(teamsPerYearLogSelected, TeamPerfectPortfoliosSelected);

  const [selectedScore, setSelectedScore] = useState<{
    name: string;
    id: string;
  }>({
    name: "Historical All Rounds",
    id: "1",
  });

  const [orderHistorySelected, setOrderHistorySelected] = useState({
    name: "Year (Desc), Score (Desc)",
    id: "1",
    value: "year",
  });

  const dataDropdowndata = useMemo(
    () => [
      {
        name: "Historical All Rounds",
        id: "1",
      },
      {
        name: "Historical Perfect Portfolios",
        id: "2",
      },
      {
        name: "Teams Picked at Least Once per Year ",
        id: "3",
      },
    ],
    [],
  );

  const orderHistoricalData = useMemo(
    () => [
      {
        name: "Year (Desc), Score (Desc)",
        id: "1",
        value: "year",
      },
      {
        name: "Risk (Desc)",
        id: "2",
        value: "risk",
      },
    ],
    [],
  );

  const handleChangeGraph = useCallback(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    (e) => {
      const optionSelect = typeGraphs.filter(
        (el: dataDropdowndataType) => el?.name === e.target.value,
      )[0];
      setGraphType(optionSelect);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [typeGraphs],
  );

  const { data: tournaments, isLoading: loadingTournaments } = useQuery({
    queryKey: ["tournamentsFemale", userId],
    queryFn: () => getTournaments(),
  });

  const { data: teamsPerYearLog, isLoading: loadingTeamsPerYearLog } = useQuery(
    {
      queryKey: ["teamsPerYearLogFemale", userId],
      queryFn: () => getTeamsPerYearLogFemale(selectedTournament!.id),
      enabled: !!selectedTournament?.id && selectedScore.id === "3",
    },
  );

  const { data: teamsPerfectPortfolios, isLoading: loadingPerfectPortfolios } =
    useQuery({
      queryKey: ["teamsPerfectPortfoliosFemale", userId],
      queryFn: () => getTeamsPerfectPortfoliosFemale(),
      enabled: selectedScore.id === "2",
    });

  console.log(teamsPerfectPortfolios);

  const {
    data: teamsHistoricAllRounds,
    isLoading: loadingHistoryAllRounds,
    isFetching: fetchingHistoryAllRounds,
  } = useQuery({
    queryKey: ["teamsHistoricAllRoundsFemale", orderHistorySelected.value],
    queryFn: () => getTeamsHistoricAllRoundsFemale(orderHistorySelected.value),
    enabled: selectedScore.id === "1",
    staleTime: Infinity,
  });

  // const {
  //   data: historicalPerfectPortfoliosHistory,
  //   isLoading: loadingHistoricalPerfectPortfoliosHistory,
  // } = useQuery({
  //   queryKey: [
  //     "historicalPerfectPortfoliosHistoryFemale",
  //     TeamPerfectPortfoliosSelected,
  //   ],
  //   queryFn: () =>
  //     getHistoricalPerfectPortfoliosHistory(TeamPerfectPortfoliosSelected),
  // });

  // const {
  //   data: teamsPickedLogHistory,
  //   isLoading: loadingTeamsPickedLogHistory,
  // } = useQuery({
  //   queryKey: ["TeamsPickedLogHistoryFemale", teamsPerYearLogSelected],
  //   queryFn: () => getTeamsPickedLogHistory(teamsPerYearLogSelected),
  // });

  useEffect(() => {
    if (tournaments) {
      // setTournament(tournaments[0]?.name);
      setSelectedTournament(tournaments[0]);
    }
  }, [tournaments]);

  const handleChange = useCallback(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    (e) => {
      if (e.target.name === "dataDropdowndata") {
        const optionSelect = dataDropdowndata.find(
          (el) => el.name === e.target.value,
        ) || { name: "", id: "" };
        setSelectedScore(optionSelect);
      }
    },
    [dataDropdowndata],
  );

  interface OrderHistoryData {
    name: string;
    id: string;
    value: string;
  }
  const handleChangeHistoryOrder = useCallback(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    (e) => {
      const select: OrderHistoryData | undefined = orderHistoricalData.find(
        (el) => el.name === e.target.value,
      );
      setOrderHistorySelected(select || { name: "", id: "", value: "" });
      console.log(select?.value);
    },
    [orderHistoricalData],
  );

  if (
    loadingHistoryAllRounds ||
    loadingPerfectPortfolios ||
    loadingTeamsPerYearLog ||
    // loadingTeamsPickedLogHistory ||
    loadingTournaments
  )
    return <Loader />;

  return (
    <>
      <Grid
        size={12}
        style={{
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
            size={{ xs: 12, md: 8 }}
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
                  <HistoryIcon /> History
                </p>
              </Grid>
              {/* <Grid size={{ xs: 6, sm: 4, md: 4 }}></Grid> */}
            </Grid>
            <Grid
              container
              className={classes.subBoxHistory}
              flexWrap={"nowrap"}
              justifyContent={"center"}
            >
              <Grid
                container
                size={{ xs: 12, md: 12 }}
              >
                <Grid size={12}>
                  <span>Data:</span>
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
                {selectedScore.id === "1" && (
                  <Grid size={12}>
                    <span>OrderBy:</span>
                    <div className={classes.containerDrop}>
                      {/* <DescriptionIcon /> */}
                      <DropDownHistory
                        name={"orderBy"}
                        label={""}
                        className={classes.DropDownHistory}
                        value={orderHistorySelected.name}
                        handleChange={handleChangeHistoryOrder}
                        options={orderHistoricalData}
                      />
                    </div>
                  </Grid>
                )}
                {selectedScore.id !== "1" && (
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
                )}
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

          {selectedScore.id === "1" && (
            <Zoom
              in={true}
              style={{ marginBottom: "20px" }}
            >
              <Grid size={{ xs: 10, lg: 10 }}>
                {typeof teamsHistoricAllRounds !== "string" && (
                  <TableHistoryAllRounds
                    arrHistory={teamsHistoricAllRounds}
                    score={selectedScore.name}
                    isFetching={fetchingHistoryAllRounds}
                    theme={sportThemes.ncaaFemale}
                  />
                )}
              </Grid>
            </Zoom>
          )}
          {selectedScore.id === "2" && graphType.name === "Table" && (
            <Zoom
              in={true}
              style={{ marginBottom: "20px" }}
            >
              <Grid size={{ xs: 10, lg: 6 }}>
                {
                  <TableHistoryPerfectPortfolios
                    arrHistory={teamsPerfectPortfolios}
                    score={selectedScore.name}
                    theme={sportThemes.ncaaFemale}
                  />
                }
              </Grid>
            </Zoom>
          )}
          {selectedScore.id === "2" && graphType.name !== "Table" && (
            <Zoom
              in={true}
              style={{ marginBottom: "20px" }}
            >
              <Grid size={10}>
                {typeof teamsPerfectPortfolios !== "string" && (
                  <TeamPerfectPortfoliosGraphic
                    teamsPerYearLog={teamsPerfectPortfolios}
                    graphType={graphType.name}
                    SeteamPerfectPortfoliosSelected={
                      SeteamPerfectPortfoliosSelected
                    }
                  />
                )}
              </Grid>
            </Zoom>
          )}
          {/* {TeamPerfectPortfoliosSelected > 0 &&
            selectedScore.id === "2" &&
            !loadingHistoricalPerfectPortfoliosHistory &&
            typeof historicalPerfectPortfoliosHistory !== "string" && (
              <Zoom
                in={true}
                style={{ marginBottom: "20px" }}
              >
                <Grid size={{ xs: 10, md: 6 }}>
                  <TableHistoryPerfectPortfoliosSelected
                    arrHistory={historicalPerfectPortfoliosHistory}
                    score={selectedScore.name}
                    TeamPerfectPortfoliosSelected={
                      TeamPerfectPortfoliosSelected
                    }
                  />
                </Grid>
              </Zoom>
            )} */}
          {/* 
          {selectedScore.id === "2" &&
            TeamPerfectPortfoliosSelected > 0 &&
            typeof historicalPerfectPortfoliosHistory === "string" &&
            !loadingHistoricalPerfectPortfoliosHistory && <NotRecordFounds />} */}

          {selectedScore.id === "3" && graphType.name === "Table" && (
            <Zoom
              in={true}
              style={{ marginBottom: "20px" }}
            >
              <Grid size={{ xs: 10, lg: 6 }}>
                {typeof teamsPerYearLog !== "string" && (
                  <TableHistoryTeamsPerYearLog
                    arrHistory={teamsPerYearLog}
                    score={selectedScore.name}
                    theme={sportThemes.ncaaFemale}
                  />
                )}
              </Grid>
            </Zoom>
          )}
          {selectedScore.id === "3" && graphType.name !== "Table" && (
            <Zoom
              in={true}
              style={{ marginBottom: "20px" }}
            >
              <Grid size={10}>
                {typeof teamsPerYearLog !== "string" && (
                  <TeamPerYearlogGraphic
                    teamsPerYearLog={teamsPerYearLog}
                    graphType={graphType.name}
                    setTeamsPerYearLogSelected={setTeamsPerYearLogSelected}
                  />
                )}
              </Grid>
            </Zoom>
          )}

          {/* {selectedScore.id === "3" &&
            teamsPerYearLogSelected > 0 &&
            typeof teamsPickedLogHistory !== "string" &&
            !loadingTeamsPickedLogHistory && (
              <Zoom
                in={true}
                style={{ marginBottom: "20px" }}
              >
                <Grid size={{ xs: 10, md: 6 }}>
                  {typeof teamsPerYearLog !== "string" && (
                    <TableHistoryTeamsPerYearLogSelected
                      arrHistory={teamsPickedLogHistory}
                      score={selectedScore.name}
                      teamsPerYearLogSelected={teamsPerYearLogSelected}
                    />
                  )}
                </Grid>
              </Zoom>
            )} */}
          {/* {selectedScore.id === "3" &&
            teamsPerYearLogSelected > 0 &&
            typeof teamsPickedLogHistory === "string" &&
            !loadingTeamsPickedLogHistory && <NotRecordFounds />} */}
        </Grid>
      </Grid>
    </>
  );
};

export default React.memo(HistoryFemale);
