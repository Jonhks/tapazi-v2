import React, { useCallback, useMemo, useState } from "react";
import classes from "./HistoryPortfolios.module.css";
import { Zoom } from "@mui/material";
import Grid from "@mui/material/Grid2";
import HistoryIcon from "@mui/icons-material/History";
import DropDownHistory from "@/components/Inputs/DropdDownHistory";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  getTeamsHistoricAllRounds,
  getTeamsPerfectPortfolios,
  getTeamsPerYearLog,
  // getTournaments,
} from "@/api/HistoryAPI";
// import { Tournament } from "@/types/index";
import Loader from "@/components/BallLoader/BallLoader";
import TableHistoryTeamsPerYearLog from "@/components/Table/TableHistoryTeamsPerYearLog";
import TableHistoryPerfectPortfolios from "@/components/Table/TableHistoryPerfectPortfolios";
import TableHistoryAllRounds from "@/components/Table/TableHistoryAllRounds";
import DescriptionIcon from "@mui/icons-material/Description";
import TeamPerYearlogGraphic from "@/components/Graphics/TeamPerYearLogGraphic";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import { typeGraphs } from "@/utils/typeGraphs";
import TeamPerfectPortfoliosGraphic from "@/components/Graphics/TeamPerfectPortfoliosGraphic";

type dataDropdowndataType = {
  name: string;
  id: string;
};

const History = () => {
  const params = useParams();
  const userId = params.userId!;

  const [graphType, setGraphType] = useState(typeGraphs[0]);
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
    []
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
    []
  );

  const handleChangeGraph = useCallback(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    (e) => {
      const optionSelect = typeGraphs.filter(
        (el: dataDropdowndataType) => el?.name === e.target.value
      )[0];
      setGraphType(optionSelect);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [typeGraphs]
  );

  const { data: teamsPerYearLog, isLoading: loadingTeamsPerYearLog } = useQuery(
    {
      queryKey: ["teamsPerYearLog", userId],
      queryFn: () => getTeamsPerYearLog(),
    }
  );

  const { data: teamsPerfectPortfolios, isLoading: loadingPerfectPortfolios } =
    useQuery({
      queryKey: ["teamsPerfectPortfolios", userId],
      queryFn: () => getTeamsPerfectPortfolios(),
    });

  const { data: teamsHistoricAllRounds, isLoading: loadingHistoryAllRounds } =
    useQuery({
      queryKey: ["teamsHistoricAllRounds", orderHistorySelected],
      queryFn: () => getTeamsHistoricAllRounds(orderHistorySelected.value),
    });

  const handleChange = useCallback(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    (e) => {
      if (e.target.name === "dataDropdowndata") {
        const optionSelect = dataDropdowndata.find(
          (el) => el.name === e.target.value
        ) || { name: "", id: "" };
        setSelectedScore(optionSelect);
      }
    },
    [dataDropdowndata]
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
        (el) => el.name === e.target.value
      );
      setOrderHistorySelected(select || { name: "", id: "", value: "" });
      console.log(select?.value);
    },
    [orderHistoricalData]
  );

  if (
    // isLoading ||
    loadingTeamsPerYearLog ||
    loadingPerfectPortfolios ||
    loadingHistoryAllRounds
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
              <Grid size={{ xs: 6, sm: 4, md: 4 }}></Grid>
            </Grid>
            <Grid
              container
              className={classes.subBoxHistory}
              flexWrap={"nowrap"}
            >
              <Grid
                container
                size={{ xs: 12, lg: 6 }}
              >
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
                {selectedScore.id === "1" && (
                  <Grid size={12}>
                    <span>OrderBy:</span>
                    <div className={classes.containerDrop}>
                      <DescriptionIcon />
                      <DropDownHistory
                        name={"orderBy"}
                        label={"Order By"}
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
                <TableHistoryAllRounds
                  arrHistory={teamsHistoricAllRounds}
                  score={selectedScore.name}
                />
              </Grid>
            </Zoom>
          )}

          {selectedScore.id === "2" && graphType.name === "Table" && (
            <Zoom
              in={true}
              style={{ marginBottom: "20px" }}
            >
              <Grid size={{ xs: 10, lg: 6 }}>
                <TableHistoryPerfectPortfolios
                  arrHistory={teamsPerfectPortfolios}
                  score={selectedScore.name}
                />
              </Grid>
            </Zoom>
          )}
          {selectedScore.id === "2" && graphType.name !== "Table" && (
            <Zoom
              in={true}
              style={{ marginBottom: "20px" }}
            >
              <Grid size={10}>
                <TeamPerfectPortfoliosGraphic
                  teamsPerYearLog={teamsPerfectPortfolios}
                  graphType={graphType.name}
                />
              </Grid>
            </Zoom>
          )}

          {selectedScore.id === "3" && graphType.name === "Table" && (
            <Zoom
              in={true}
              style={{ marginBottom: "20px" }}
            >
              <Grid size={{ xs: 10, lg: 6 }}>
                <TableHistoryTeamsPerYearLog
                  arrHistory={teamsPerYearLog}
                  score={selectedScore.name}
                />
              </Grid>
            </Zoom>
          )}
          {selectedScore.id === "3" && graphType.name !== "Table" && (
            <Zoom
              in={true}
              style={{ marginBottom: "20px" }}
            >
              <Grid size={10}>
                <TeamPerYearlogGraphic
                  teamsPerYearLog={teamsPerYearLog}
                  graphType={graphType.name}
                />
              </Grid>
            </Zoom>
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default React.memo(History);
