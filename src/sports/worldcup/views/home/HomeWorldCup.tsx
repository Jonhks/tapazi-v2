import { useState, useMemo } from "react";
import Grid from "@mui/material/Grid2";
import { Zoom } from "@mui/material";
import classes from "./Home.module.css";
import TableHomeWC from "../../components/Table/Table";
import BallLoader from "../../components/BallLoader/BallLoader";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import {
  gatPayout,
  getHOINFO,
  getHomePortfolioTeams,
  getParticipants,
  getPopona,
  getPortfoliosCount,
  getScores,
  getTournamentWorldCup,
} from "@/api/worldcup/HomeAPIWorldCup";
import { getTeamsWorldCup } from "@/api/worldcup/PortfoliosAPIWorldCup";
import { getParameter } from "@/api/shared/TournamentsAPI";
import useMediaQuery from "@mui/material/useMediaQuery";
import { HomeScoreWC, PayOut } from "@/types/index";

const HomeWorldCup = () => {
  const isMobile = useMediaQuery("(max-width:900px)");
  const params = useParams();
  const userId = params.userId!;
  const sportId = params.sportId!;

  const [selected, setSelected] = useState("first");

  const { data: tournament, isLoading: isLoadingTournament } = useQuery({
    queryKey: ["tournamentWorldCup", userId, sportId],
    queryFn: () => getTournamentWorldCup(sportId),
    enabled: !!sportId,
  });
  const tournamentId = tournament?.[0]?.id;
  // const tournamentId = "4";
  //
  // console.log(tournamentId);
  const { data: dataScores, isLoading: isLoadingScores } = useQuery({
    queryKey: ["scoresWorldCup", userId, tournamentId],
    queryFn: () => getScores(String(tournamentId), userId),
    enabled: !!tournamentId,
    retry: 1,
  });

  // round "1" = GROUP ROUND 1; sirve para obtener composición de equipos por portfolio.
  const { data: teamsData } = useQuery({
    queryKey: ["homePortfolioTeamsWC", tournamentId],
    queryFn: () => getHomePortfolioTeams(String(tournamentId), "1"),
    enabled: !!tournamentId,
  });

  const { data: allTeams } = useQuery({
    queryKey: ["teamsWCHome", tournamentId],
    queryFn: () => getTeamsWorldCup(String(tournamentId)),
    enabled: !!tournamentId,
  });

  const { data: DataPopona, isLoading: isLoadingPopona } = useQuery({
    queryKey: ["poponaWorldCup", userId, tournamentId],
    queryFn: () => getPopona(tournamentId),
    enabled: !!tournamentId,
  });

  const { data: dataHOINFO, isLoading: isLoadingHOINFO } = useQuery({
    queryKey: ["HOINFOWorldCup", userId, tournamentId],
    queryFn: () => getHOINFO(tournamentId),
    enabled: !!tournamentId,
  });

  const { data: participants, isLoading: isLoadingParticipants } = useQuery({
    queryKey: ["participantsWorldCup", userId, tournamentId],
    queryFn: () => getParticipants(tournamentId),
    enabled: !!tournamentId,
  });

  const { data: portfoliosHome, isLoading: isLoadingPortfoliosHome } = useQuery(
    {
      queryKey: ["portfoliosHomeWorldCup", userId, tournamentId],
      queryFn: () => getPortfoliosCount(tournamentId),
      enabled: !!tournamentId,
    },
  );

  const { data: payout, isLoading: isLoadingPayout } = useQuery({
    queryKey: ["payoutWorldCup", userId, tournamentId],
    queryFn: () => gatPayout(tournamentId),
    retry: true,
    enabled: !!tournamentId,
  });

  const { data: datTou } = useQuery({
    queryKey: ["datTouWC", tournamentId],
    queryFn: () => getParameter(String(tournamentId), "DATTOU"),
    enabled: !!tournamentId,
    staleTime: 1000 * 60 * 5,
  });

  const { data: houTou } = useQuery({
    queryKey: ["houTouWC", tournamentId],
    queryFn: () => getParameter(String(tournamentId), "HOUTOU"),
    enabled: !!tournamentId,
    staleTime: 1000 * 60 * 5,
  });

  const tableVisible = useMemo(() => {
    if (!datTou || !houTou) return false;
    return new Date() >= new Date(`${datTou}T${houTou}`);
  }, [datTou, houTou]);

  const renderDescription = (dataHOINFO: string) => {
    return dataHOINFO.split("\n").map((line, index) => (
      <p
        key={index}
        style={{ margin: 8, textTransform: "capitalize", fontSize: 12 }}
      >
        {line}
      </p>
    ));
  };

  const tableData = useMemo<HomeScoreWC[]>(() => {
    const allScores = Array.isArray(dataScores?.score) ? dataScores.score : [];
    if (!allScores.length) return [];

    const teamsLookup = new Map<number, Record<string, unknown>>(
      (teamsData ?? []).map((t: Record<string, unknown>) => [
        t.portfolio_id as number,
        t,
      ]),
    );

    const crestMap = new Map<number, string>(
      (allTeams ?? []).map((t: Record<string, unknown>) => [
        t.id as number,
        t.crest_url as string,
      ]),
    );

    return allScores.map((row: Record<string, unknown>): HomeScoreWC => {
      const teamRow = teamsLookup.get(row.portfolio_id as number);
      let teamNames: string[] = [];
      let teamIds: number[] = [];
      let eliminated: boolean[] = [];
      if (teamRow?.teams) {
        try {
          teamNames = JSON.parse(teamRow.teams as string);
        } catch {
          /* empty */
        }
      }
      if (teamRow?.teams_ids) {
        try {
          teamIds = JSON.parse(teamRow.teams_ids as string);
        } catch {
          /* empty */
        }
      }
      if (teamRow?.eliminated_teams) {
        try {
          eliminated = JSON.parse(teamRow.eliminated_teams as string);
        } catch {
          /* empty */
        }
      }
      return {
        portfolio_name: String(row.name ?? ""),
        portfolio_id: Number(row.portfolio_id ?? 0),
        team1_name: teamNames[0] ?? "",
        team1_crest: crestMap.get(teamIds[0]) ?? null,
        team1_eliminated: eliminated[0] ?? false,
        team2_name: teamNames[1] ?? "",
        team2_crest: crestMap.get(teamIds[1]) ?? null,
        team2_eliminated: eliminated[1] ?? false,
        team3_name: teamNames[2] ?? "",
        team3_crest: crestMap.get(teamIds[2]) ?? null,
        team3_eliminated: eliminated[2] ?? false,
        team4_name: teamNames[3] ?? "",
        team4_crest: crestMap.get(teamIds[3]) ?? null,
        team4_eliminated: eliminated[3] ?? false,
        team5_name: teamNames[4] ?? "",
        team5_crest: crestMap.get(teamIds[4]) ?? null,
        team5_eliminated: eliminated[4] ?? false,
        team6_name: teamNames[5] ?? "",
        team6_crest: crestMap.get(teamIds[5]) ?? null,
        team6_eliminated: eliminated[5] ?? false,
        team7_name: teamNames[6] ?? "",
        team7_crest: crestMap.get(teamIds[6]) ?? null,
        team7_eliminated: eliminated[6] ?? false,
        group_round_1: (row.score_group_round1 as number) ?? null,
        group_round_2: (row.score_group_round2 as number) ?? null,
        group_round_3: (row.score_group_round3 as number) ?? null,
        round_of_32: (row.score_round_of_32 as number) ?? null,
        round_of_16: (row.score_round_of_16 as number) ?? null,
        quarter_finals: (row.score_round_quarter_finals as number) ?? null,
        semi_finals: (row.score_round_semi_finals as number) ?? null,
        third_place_playoff:
          (row.score_round_thrid_place_play_off as number) ?? null,
        final: (row.score_final_round as number) ?? null,
        score: Number(row.score ?? 0),
      };
    });
  }, [dataScores, teamsData, allTeams]);

  const isLoading =
    isLoadingScores ||
    isLoadingTournament ||
    isLoadingPopona ||
    isLoadingHOINFO ||
    isLoadingParticipants ||
    isLoadingPortfoliosHome ||
    isLoadingPayout;

  return (
    <>
      {isLoading ? (
        <BallLoader />
      ) : (
        <Grid
          container
          justifyContent={"center"}
          alignContent={"start"}
          size={12}
          style={{
            minHeight: "700px",
            height: "calc(100vh - 56px)",
            overflowY: "scroll",
            overflowX: "hidden",
          }}
          className={`${classes.gridInstructions}`}
        >
          <Grid
            size={11}
            display={"flex"}
            flexWrap={isMobile ? "wrap" : "nowrap"}
            justifyContent={"space-around"}
            flexDirection={"row"}
            height={"auto"}
            mb={1}
            className="subboxes-wrapper"
          >
            <Grid
              size={{ xs: 12, md: 5 }}
              m={1}
              className={`${classes.boxHome} ${selected === "first" && classes.active}`}
              onClick={() => setSelected("first")}
            >
              <p className={classes.titleBox}>
                {DataPopona?.toUpperCase()} IS HERE!!!
              </p>
              <div
                className={`${classes.subBox}`}
                style={{
                  display: "flex",
                  alignItems: "center", // Centra verticalmente
                  justifyContent: "center", // Centra horizontalmente el contenedor
                  height: "100%", // Opcional, para ocupar todo el alto
                }}
              >
                <div
                  style={{
                    margin: 0,
                    whiteSpace: "pre-wrap", // Permite que el texto se ajuste al ancho
                    wordBreak: "break-word",
                    textAlign: "center",
                  }}
                >
                  {dataHOINFO && renderDescription(dataHOINFO)}
                </div>
              </div>
            </Grid>

            <Grid
              size={{ xs: 11.4, md: 3 }}
              m={1}
              className={`${classes.boxHome} ${selected === "second" && classes.active}`}
              onClick={() => setSelected("second")}
            >
              <p className={classes.titleBox}>Payouts</p>
              <div className={classes.subBoxTwo}>
                <p>Total Contestants: {participants?.participants}</p>
                <p>Total Entries: {portfoliosHome?.portfolios}</p>
                <br />
                {payout?.map((pay: PayOut, i: number) => (
                  <p key={i}>
                    Place {pay?.place}: <span>{pay?.percentage}%</span>
                  </p>
                ))}
              </div>
            </Grid>

            <Grid
              size={{ xs: 11.4, md: 3 }}
              m={1}
              className={`${classes.boxHome} ${selected === "third" && classes.active}`}
              onClick={() => setSelected("third")}
            >
              <p className={classes.titleBox}>Payment Methods</p>
              <div className={classes.subBoxTwo}>
                <p>Paypal</p>
                <p>adingo8yourbaby@gmail.com</p>
                <p>
                  <a
                    href="https://www.paypal.com/mx/home"
                    target="blank"
                    rel="noopener noreferrer"
                    style={{ color: "#00E2F6" }}
                  >
                    www.paypal.com
                  </a>
                </p>
                <p>Venmo name:</p>
                <p>Paul-Tapaszi</p>
              </div>
            </Grid>
          </Grid>
          <Grid
            container
            spacing={2}
            mb={3}
            justifyContent="center"
          >
            <Zoom in={true}>
              <Grid
                size={11}
                className="subboxes-wrapper"
              >
                {tableVisible ? (
                  <TableHomeWC data={tableData} />
                ) : (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "2.5rem 1rem",
                      color: "#00E2F6",
                      border: "1px solid rgba(0, 226, 246, 0.25)",
                      borderRadius: 8,
                      background: "rgba(0, 41, 44, 0.6)",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "1rem",
                        marginBottom: 8,
                        opacity: 0.7,
                      }}
                    >
                      Scores available from
                    </p>
                    <p style={{ fontSize: "1.4rem", fontWeight: "bold" }}>
                      {datTou} · {houTou?.slice(0, 5)}
                    </p>
                  </div>
                )}
              </Grid>
            </Zoom>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default HomeWorldCup;
