import { useMemo, useState, useEffect } from "react";
import classes from "./StatsWorldCup.module.css";
import { Typography, Zoom, Box, Input, InputAdornment } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import SearchIcon from "@mui/icons-material/Search";
import DropDownHistory from "@/female/components/Inputs/DropdDownHistory";
import Grid from "@mui/material/Grid2";
import {
  getScoreRoundsWorldCup,
  getStatsWorldCup,
  getTournaments,
} from "@/api/worldcup/StatsAPIWorldCup";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import BallLoader from "../../components/BallLoader/BallLoader";
import { getTeamsWorldCup } from "@/api/worldcup/PortfoliosAPIWorldCup";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  SortingState,
  ColumnDef,
} from "@tanstack/react-table";

type TeamStat = {
  id: number;
  name: string;
  crest_url: string;
};

type PortfolioStat = {
  portfolio_name: string;
  teams: string;
  eliminated_teams: string;
  round_score: number;
};

type TeamWithCrest = {
  name: string;
  crest: string | null;
  eliminated: boolean;
};

type PortfolioWithCrests = {
  portfolio: string;
  round_score: number;
  teams: TeamWithCrest[];
};

const CYAN = "#00E2F6";
const HEADER_BG = "#001A1D"; // worldcup headerEven — fuerte
const CELL_BG = "#003440";   // worldcup cellOddColOddRow — suave

const TeamDisplay = ({
  name,
  crest,
  eliminated,
}: {
  name: string;
  crest: string;
  eliminated: boolean;
}) => (
  <Box
    display="flex"
    alignItems="center"
    justifyContent="start"
    gap={1}
    sx={{ opacity: eliminated ? 0.4 : 1 }}
  >
    <Box
      sx={{
        width: 24,
        height: 24,
        backgroundColor: "rgba(255,255,255,0.1)",
        backgroundImage: `url(${crest})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderRadius: "50%",
        filter: eliminated ? "grayscale(1)" : "none",
      }}
    />
    <Typography
      variant="body2"
      sx={{
        fontSize: "0.75rem",
        whiteSpace: "nowrap",
        color: eliminated ? "#888" : "inherit",
        textDecoration: eliminated ? "line-through" : "none",
      }}
    >
      {name}
    </Typography>
  </Box>
);

const StatsWorldCup = () => {
  const [tournament, setTournament] = useState("");
  const [dataType, setDataType] = useState("PORTFOLIO");
  const [roundType, setRoundType] = useState<string>(""); // número: "1", "4"…
  const [roundLabel, setRoundLabel] = useState<string>(""); // display: "GROUP ROUND 1"

  const dataTypes = [{ id: "1", name: "PORTFOLIO" }];

  const params = useParams();
  const userId = params.userId!;

  const [sorting, setSorting] = useState<SortingState>([
    { id: "round_score", desc: true },
  ]);
  const [filtered, setFiltered] = useState<string>("");
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);
  const [hoveredCellId, setHoveredCellId] = useState<string | null>(null);

  const getCellBg = (isSticky: boolean, isTeamCell: boolean, cellId: string, rowId: string) => {
    if (isTeamCell && hoveredCellId === cellId) return HEADER_BG; // equipo hovered → más oscuro
    if (hoveredRowId === rowId) return "#00292c";                  // fila hovered → ilumina todo
    return isSticky ? HEADER_BG : CELL_BG;                        // default
  };

  const { data: tournamentsWC } = useQuery({
    queryKey: ["tournamentsWorldCup", userId],
    queryFn: () => getTournaments(),
  });

  const tournamentIdStats = String(tournamentsWC?.[0]?.id ?? "");

  const { data: teamsWCStats } = useQuery({
    queryKey: ["teamsWorldCupStats", tournamentIdStats],
    queryFn: () => getTeamsWorldCup(tournamentIdStats),
    enabled: !!tournamentIdStats,
  });

  const { data: getScoreRounds } = useQuery({
    queryKey: ["getScoreRoundsWorldCup", tournamentIdStats],
    queryFn: () => getScoreRoundsWorldCup({ tournamentId: tournamentIdStats }),
    enabled: !!tournamentIdStats,
  });

  // ─── Query tabla (round numérico → API) ────────────────────────────────────
  // ENDPOINT A (activo): roundType ya es el número limpio, se manda directo.
  // ENDPOINT B (alternativo): descomentar la línea con regex y comentar la de arriba.
  const { data: statsWorldCupData, isLoading } = useQuery({
    queryKey: ["statsWorldCup", userId, roundType, tournamentIdStats],
    queryFn: () =>
      getStatsWorldCup({
        tournamentId: tournamentIdStats,
        round: roundType, // ENDPOINT A
        // round: roundType.match(/\d+/)?.[0] ?? roundType, // ENDPOINT B
      }),
    enabled: !!roundType && !!tournamentIdStats,
  });

  useEffect(() => {
    if (tournamentsWC && tournamentsWC.length > 0 && !tournament) {
      setTournament(tournamentsWC[0].name);
    }
  }, [tournamentsWC, tournament]);

  // ─── Init rounds ────────────────────────────────────────────────────────────
  // ENDPOINT A: r.round = 1 (número), r.name = "GROUP ROUND 1" (display)
  // ENDPOINT B: r.round = "GROUP ROUND 3" (string — sirve como display y como fuente del número)
  useEffect(() => {
    if (getScoreRounds && getScoreRounds.length > 0 && !roundType) {
      setRoundType(String(getScoreRounds[0].round)); // ENDPOINT A y B
      setRoundLabel(getScoreRounds[0].name); // ENDPOINT A — comentar en B
      // setRoundLabel(String(getScoreRounds[0].round)); // ENDPOINT B — descomentar en B
    }
  }, [getScoreRounds, roundType]);

  const teamsMap: Record<string, string> = useMemo(() => {
    return (
      teamsWCStats?.reduce(
        (acc: Record<string, string>, team: TeamStat) => {
          acc[team.name.toUpperCase()] = team.crest_url;
          return acc;
        },
        {} as Record<string, string>,
      ) ?? {}
    );
  }, [teamsWCStats]);

  const statsWithCrests: PortfolioWithCrests[] = useMemo(() => {
    if (!statsWorldCupData || !teamsMap) return [];

    return statsWorldCupData.map((item: PortfolioStat) => {
      const teams: string[] = JSON.parse(item.teams);
      const eliminated: boolean[] = JSON.parse(item.eliminated_teams);
      const teamsWithCrests: TeamWithCrest[] = teams.map(
        (teamName: string, i: number) => ({
          name: teamName,
          crest: teamsMap[teamName.toUpperCase()] ?? null,
          eliminated: eliminated[i] ?? false,
        }),
      );
      return {
        portfolio: item.portfolio_name,
        round_score: item.round_score,
        teams: teamsWithCrests,
      };
    });
  }, [statsWorldCupData, teamsMap]);

  const columns = useMemo<ColumnDef<PortfolioWithCrests>[]>(
    () => [
      {
        header: "Portfolio",
        accessorKey: "portfolio",
        cell: (info: any) => (
          <span style={{ color: CYAN }}>{info.getValue() as string}</span>
        ),
      },
      ...Array.from({ length: 7 }, (_, i) => ({
        header: `Team ${i + 1}`,
        accessorFn: (row: PortfolioWithCrests) => row.teams?.[i]?.name || "",
        id: `team_${i}`,
        cell: (info: any) => {
          const teamName = info.getValue() as string;
          const fullTeam = (info.row.original as PortfolioWithCrests).teams?.[
            i
          ];
          if (!teamName || !fullTeam) return null;
          return (
            <TeamDisplay
              name={teamName}
              crest={fullTeam.crest || ""}
              eliminated={fullTeam.eliminated}
            />
          );
        },
      })),
      {
        header: () => (
          <Box sx={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
            {/* <span>R</span> */}
            <span>SCORE</span>
          </Box>
        ),
        accessorKey: "round_score",
      },
    ],
    [],
  );

  const table = useReactTable({
    data: statsWithCrests,
    columns,
    state: { sorting, globalFilter: filtered },
    onSortingChange: setSorting,
    onGlobalFilterChange: setFiltered,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  if (isLoading) return <BallLoader />;

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
        size={12}
        spacing={1}
        display={"flex"}
        justifyContent={"center"}
        alignContent={"center"}
        flexWrap={"nowrap"}
        className="subboxes-wrapper"
        sx={{ width: "100%", maxWidth: "100%" }}
      >
        <div className={`${classes.boxHistory} ${classes.active}`}>
          <div
            className={classes.titleBox}
            style={{ justifyContent: "center" }}
          >
            STATS
          </div>
          <div className={classes.subBoxHistory}>
            <Grid
              container
              spacing={4}
            >
              <Grid size={{ xs: 12, md: 10 }}>
                <Grid
                  container
                  spacing={2}
                  alignItems="center"
                >
                  <Grid size={4}>
                    <Typography
                      sx={{ color: "white", textAlign: "right", pr: 2 }}
                    >
                      Tournament:
                    </Typography>
                  </Grid>
                  <Grid size={8}>
                    <DropDownHistory
                      name="tournament"
                      label=""
                      className={classes.DropDownHistory}
                      value={tournament}
                      handleChange={(e) =>
                        setTournament(e.target.value as string)
                      }
                      options={tournamentsWC}
                    />
                  </Grid>

                  <Grid size={4}>
                    <Typography
                      sx={{ color: "white", textAlign: "right", pr: 2 }}
                    >
                      Data:
                    </Typography>
                  </Grid>
                  <Grid size={8}>
                    <DropDownHistory
                      name="data"
                      label=""
                      className={classes.DropDownHistory}
                      value={dataType}
                      handleChange={(e) =>
                        setDataType(e.target.value as string)
                      }
                      options={dataTypes}
                    />
                  </Grid>

                  <Grid size={4}>
                    <Typography
                      sx={{ color: "white", textAlign: "right", pr: 2 }}
                    >
                      Round:
                    </Typography>
                  </Grid>
                  <Grid size={8}>
                    {/* ── Round dropdown ─────────────────────────────────────
                        ENDPOINT A (activo):
                          options → name: r.name  |  find por r.name
                          roundType = String(r.round) (número limpio)
                        ENDPOINT B (alternativo — descomentar bloque B):
                          options → name: r.round  |  find por r.round
                          roundType = r.round (string con el nombre, extraer número en queryFn)
                    ─────────────────────────────────────────────────────── */}

                    {/* ENDPOINT A: */}
                    <DropDownHistory
                      name="round"
                      label=""
                      className={classes.DropDownHistory}
                      value={roundLabel || ""}
                      handleChange={(e) => {
                        const selected = getScoreRounds?.find(
                          (r: any) => r.name === e.target.value,
                        );
                        if (selected) {
                          setRoundType(String(selected.round));
                          setRoundLabel(selected.name);
                        }
                      }}
                      options={getScoreRounds?.map((r: any) => ({
                        id: String(r.round),
                        name: r.name,
                      }))}
                    />

                    {/* ENDPOINT B (descomentar y comentar bloque A):
                    <DropDownHistory
                      name="round"
                      label=""
                      className={classes.DropDownHistory}
                      value={roundLabel || ""}
                      handleChange={(e) => {
                        setRoundType(e.target.value as string);
                        setRoundLabel(e.target.value as string);
                      }}
                      options={getScoreRounds?.map((r: any) => ({
                        id: String(r.round),
                        name: r.round,
                      }))}
                    />
                    */}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </div>
        </div>
      </Grid>

      <Grid
        container
        spacing={2}
        display={"flex"}
        justifyContent={"center"}
        alignContent={"center"}
        mt={2}
        mb={3}
      >
        <Zoom in={true}>
          <Grid size={11.5}>
            <Box sx={{ width: "100%", textAlign: "center", mb: 2 }}>
              <Typography
                variant="h5"
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              >
                Portfolios - Round: {roundLabel || roundType}
              </Typography>
            </Box>
            <Box sx={{ width: "100%", borderRadius: "4px" }}>
              <div
                style={{
                  position: "sticky",
                  left: 0,
                  top: 0,
                  zIndex: 3,
                  backgroundColor: "#d6cfcfff",
                  color: "black",
                  width: 200,
                  borderRadius: 5,
                  margin: "0 0 10px 0",
                  padding: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Input
                  type={"search"}
                  sx={{ width: "100%", padding: "0" }}
                  placeholder="Search..."
                  color={"warning"}
                  value={filtered ?? ""}
                  onChange={(e) => setFiltered(String(e.target.value))}
                  startAdornment={
                    <InputAdornment
                      position="start"
                      sx={{ pl: 1 }}
                    >
                      <SearchIcon color="inherit" />
                    </InputAdornment>
                  }
                  inputProps={{
                    style: { textTransform: "lowercase", padding: "5px" },
                    autoCapitalize: "none",
                  }}
                />
              </div>
              <div style={{ width: "100%", overflowX: "scroll" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    minWidth: "max-content",
                  }}
                >
                  <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header, index) => (
                          <th
                            key={header.id}
                            onClick={header.column.getToggleSortingHandler()}
                            style={{
                              position:
                                index === 0 || index === columns.length - 1
                                  ? "sticky"
                                  : "static",
                              left: index === 0 ? 0 : undefined,
                              right:
                                index === columns.length - 1 ? 0 : undefined,
                              backgroundColor: HEADER_BG,
                              zIndex:
                                index === 0 || index === columns.length - 1
                                  ? 4
                                  : 2,
                              color: "white",
                              fontWeight: "bold",
                              fontSize: "14px",
                              textAlign: "center",
                              padding: "12px",
                              cursor: "pointer",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {header.isPlaceholder ? null : (
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <div>
                                  {flexRender(
                                    header.column.columnDef.header,
                                    header.getContext(),
                                  )}
                                </div>
                                <span
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  {{
                                    asc: (
                                      <ArrowUpwardIcon
                                        style={{
                                          fontSize: "20px",
                                          marginLeft: "4px",
                                        }}
                                      />
                                    ),
                                    desc: (
                                      <ArrowUpwardIcon
                                        style={{
                                          transform: "rotate(180deg)",
                                          fontSize: "20px",
                                          marginLeft: "4px",
                                        }}
                                      />
                                    ),
                                  }[header.column.getIsSorted() as string] ?? (
                                    <ArrowUpwardIcon
                                      style={{
                                        color: "gray",
                                        fontSize: "18px",
                                        marginLeft: "4px",
                                      }}
                                    />
                                  )}
                                </span>
                              </div>
                            )}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody>
                    {table.getRowModel().rows.map((row) => (
                      <tr
                        key={row.id}
                        onMouseEnter={() => setHoveredRowId(row.id)}
                        onMouseLeave={() => setHoveredRowId(null)}
                      >
                        {row.getVisibleCells().map((cell, index) => {
                          const isSticky = index === 0 || index === columns.length - 1;
                          const isTeamCell = index >= 1 && index <= columns.length - 2;
                          return (
                            <td
                              key={cell.id}
                              onMouseEnter={() => isTeamCell && setHoveredCellId(cell.id)}
                              onMouseLeave={() => isTeamCell && setHoveredCellId(null)}
                              style={{
                                position: isSticky ? "sticky" : "static",
                                left: index === 0 ? 0 : undefined,
                                right: index === columns.length - 1 ? 0 : undefined,
                                backgroundColor: getCellBg(isSticky, isTeamCell, cell.id, row.id),
                                zIndex: isSticky ? 3 : 1,
                                color: "white",
                                fontWeight: "bold",
                                fontSize: "12px",
                                textAlign: "center",
                                padding: "8px",
                                whiteSpace: "nowrap",
                                transition: "background-color 0.15s ease",
                              }}
                            >
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Box>
          </Grid>
        </Zoom>
      </Grid>
    </Grid>
  );
};

export default StatsWorldCup;
