import { useMemo, useState, useEffect } from "react";
import classes from "./StatsNfl.module.css";
import {
  Typography,
  Zoom,
  Box,
  IconButton,
  Input,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import SearchIcon from "@mui/icons-material/Search";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import DropDownHistory from "../../components/Inputs/DropdDownHistory";
import Grid from "@mui/material/Grid2";
import { downloadTableAsCsv } from "@/utils/exportCsv";
import {
  getScoreWeeksNfl,
  getScoreSeedWeeksNfl,
  getSchedulePerWeekNfl,
  getSeedPerWeekNfl,
  getStatsNfl,
} from "@/api/nfl/StatsNflAPI";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../components/NFLBallLoader/NFLBallLoader";
import { getTeamsNfl } from "@/api/nfl/PortfoliosNflAPI";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  SortingState,
  ColumnDef,
  CellContext,
  Table,
} from "@tanstack/react-table";
import { getTournaments } from "@/api/nfl/HistoryNFLAPI";

type TeamStat = {
  id: number;
  name: string;
  description: string;
  key: string;
  seed: number;
  crest_url: string;
};

type PortfolioStat = {
  portfolio: string;
  teams: string;
  week_score: number;
};

type TeamWithCrest = {
  name: string;
  crest: string | null;
};

type PortfolioWithCrests = {
  portfolio: string;
  week_score: number;
  teams: TeamWithCrest[];
};

type ScheduleMatch = {
  home_team: string;
  away_team: string;
  match_date: string | null;
  match_time: string | null;
};

type ScheduleWithCrests = ScheduleMatch & {
  home_crest: string | null;
  away_crest: string | null;
};

type SeedTeamStat = {
  id: number;
  name: string;
  seed: number;
  bye_team_current_week: boolean;
};

type SeedTeamWithCrest = SeedTeamStat & {
  crest: string | null;
};

const TeamDisplay = ({ name, crest }: { name: string; crest: string }) => (
  <Box
    display="flex"
    alignItems="center"
    justifyContent="start"
    gap={1}
    sx={{ width: "100%" }}
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
      }}
    />
    <Typography
      variant="body2"
      sx={{ fontSize: "0.75rem", whiteSpace: "nowrap" }}
    >
      {name}
    </Typography>
  </Box>
);

function ScoreTable<TData>({
  table,
  columnsLength,
  hoveredRowId,
  setHoveredRowId,
  hoveredCellId,
  setHoveredCellId,
}: {
  table: Table<TData>;
  columnsLength: number;
  hoveredRowId: string | null;
  setHoveredRowId: (id: string | null) => void;
  hoveredCellId: string | null;
  setHoveredCellId: (id: string | null) => void;
}) {
  return (
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
              {headerGroup.headers.map((header, index) => {
                const align = header.column.columnDef.meta?.align ?? "center";
                return (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  style={{
                    position:
                      index === 0 || index === columnsLength - 1
                        ? "sticky"
                        : "static",
                    left: index === 0 ? 0 : undefined,
                    right: index === columnsLength - 1 ? 0 : undefined,
                    backgroundColor: "#1c1c1c",
                    zIndex: index === 0 || index === columnsLength - 1 ? 4 : 2,
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "14px",
                    textAlign: align,
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
                        justifyContent:
                          align === "left" ? "flex-start" : "center",
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
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            const isRowHovered = hoveredRowId === row.id;
            return (
              <tr
                key={row.id}
                onMouseEnter={() => setHoveredRowId(row.id)}
                onMouseLeave={() => setHoveredRowId(null)}
              >
                {row.getVisibleCells().map((cell, index) => {
                  const isSticky = index === 0 || index === columnsLength - 1;
                  const isCellHovered = !isSticky && hoveredCellId === cell.id;
                  const align = cell.column.columnDef.meta?.align ?? "center";
                  const bg = isCellHovered
                    ? "#1c1c1c"
                    : isRowHovered
                      ? "#262626"
                      : isSticky
                        ? "#1c1c1c"
                        : "#141414";
                  return (
                    <td
                      key={cell.id}
                      onMouseEnter={
                        !isSticky ? () => setHoveredCellId(cell.id) : undefined
                      }
                      onMouseLeave={
                        !isSticky ? () => setHoveredCellId(null) : undefined
                      }
                      style={{
                        position: isSticky ? "sticky" : "static",
                        left: index === 0 ? 0 : undefined,
                        right: index === columnsLength - 1 ? 0 : undefined,
                        backgroundColor: bg,
                        zIndex: isSticky ? 3 : 1,
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "12px",
                        textAlign: align,
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
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const StatsNfl = () => {
  const [tournament, setTournament] = useState<string>("");
  const [dataType, setDataType] = useState("PORTFOLIO");
  const [weekType, setWeekType] = useState<string>("");

  const dataTypes = [
    { id: "1", name: "PORTFOLIO" },
    { id: "2", name: "SCHEDULE" },
    { id: "3", name: "SEED" },
  ];

  const params = useParams();
  const userId = params.userId!;
  const sportId = params.sportId!;

  const [sorting, setSorting] = useState<SortingState>([
    { id: "week_score", desc: true },
  ]);
  const [filtered, setFiltered] = useState<string>("");
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);
  const [hoveredCellId, setHoveredCellId] = useState<string | null>(null);

  const { data: tournamentsNfl } = useQuery({
    queryKey: ["tournamentsNfl", userId],
    queryFn: () => getTournaments(sportId),
    enabled: Boolean(sportId),
  });

  const tournamentIdStats = String(tournamentsNfl?.[0]?.id ?? "");

  const { data: statsNflData, isLoading } = useQuery({
    queryKey: ["statsNfl", userId, tournamentIdStats, weekType],
    queryFn: () => getStatsNfl({ tournamentId: tournamentIdStats, week: weekType }),
    enabled: dataType === "PORTFOLIO" && !!weekType && !!tournamentIdStats,
  });

  const { data: scheduleNflData, isLoading: isLoadingSchedule } = useQuery({
    queryKey: ["scheduleNfl", userId, sportId, tournamentIdStats, weekType],
    queryFn: () =>
      getSchedulePerWeekNfl({
        sportId,
        tournamentId: tournamentIdStats,
        week: weekType,
      }),
    enabled: dataType === "SCHEDULE" && !!weekType && !!tournamentIdStats,
  });

  const { data: seedPerWeekNflData, isLoading: isLoadingSeed } = useQuery({
    queryKey: ["seedPerWeekNfl", userId, sportId, tournamentIdStats, weekType],
    queryFn: () =>
      getSeedPerWeekNfl({
        sportId,
        tournamentId: tournamentIdStats,
        week: weekType,
      }),
    enabled: dataType === "SEED" && !!weekType && !!tournamentIdStats,
  });

  const { data: teamsNflStats } = useQuery({
    queryKey: ["teamsNflStats", tournamentIdStats],
    queryFn: () => getTeamsNfl(sportId, tournamentIdStats),
    enabled: !!tournamentIdStats,
  });

  // PORTFOLIO usa un WS de semanas propio (tournaments/:id/score/weeks);
  // SCHEDULE y SEED comparten el WS genérico tournaments/:id/score/seed/weeks.
  const { data: getScoreWeeks } = useQuery({
    queryKey: ["getScoreWeeksNfl", userId, tournamentIdStats, dataType],
    queryFn: () =>
      dataType === "PORTFOLIO"
        ? getScoreWeeksNfl({ tournamentId: tournamentIdStats })
        : getScoreSeedWeeksNfl({ tournamentId: tournamentIdStats }),
    enabled: !!tournamentIdStats,
  });

  useEffect(() => {
    // al cambiar de Data, la lista de semanas cambia de fuente — se limpia
    // la semana elegida para que el efecto de abajo tome la primera de la
    // nueva lista en vez de arrastrar una semana que puede no existir ahí.
    setWeekType("");
  }, [dataType]);

  useEffect(() => {
    // Si tenemos semanas cargadas y el tipo de score (semana) no está definido
    if (getScoreWeeks && getScoreWeeks.length > 0 && !weekType) {
      // Tomamos la primera semana por defecto (el valor del value del option)
      setWeekType(String(getScoreWeeks[0].week));
    }
  }, [getScoreWeeks, weekType]);

  useEffect(() => {
    // Selecciona el primer torneo por defecto (mismo patrón que weekType arriba)
    if (tournamentsNfl && tournamentsNfl.length > 0 && !tournament) {
      setTournament(tournamentsNfl[0].name);
    }
  }, [tournamentsNfl, tournament]);

  useEffect(() => {
    // las columnas de cada Data no comparten ids — se reinicia el
    // orden/búsqueda para no arrastrar un sort que no aplica a la otra tabla
    if (dataType === "SCHEDULE") {
      setSorting([{ id: "match_date", desc: false }]);
    } else if (dataType === "SEED") {
      setSorting([{ id: "seed", desc: false }]);
    } else {
      setSorting([{ id: "week_score", desc: true }]);
    }
    setFiltered("");
  }, [dataType]);

  const teamsMap: Record<string, string> = useMemo(() => {
    return (
      teamsNflStats?.reduce(
        (acc: Record<string, string>, team: TeamStat) => {
          acc[team.name.toUpperCase()] = team.crest_url;
          return acc;
        },
        {} as Record<string, string>,
      ) ?? {}
    );
  }, [teamsNflStats]);

  const statsWithCrests: PortfolioWithCrests[] = useMemo(() => {
    if (!statsNflData || !teamsMap) return [];

    return statsNflData.map((item: PortfolioStat) => {
      const teams: string[] = JSON.parse(item.teams);

      const teamsWithCrests: TeamWithCrest[] = teams.map(
        (teamName: string) => ({
          name: teamName,
          crest: teamsMap[teamName.toUpperCase()] ?? null,
        }),
      );

      return {
        portfolio: item.portfolio,
        week_score: item.week_score,
        teams: teamsWithCrests,
      };
    });
  }, [statsNflData, teamsMap]);

  const scheduleWithCrests: ScheduleWithCrests[] = useMemo(() => {
    if (!Array.isArray(scheduleNflData)) return [];

    return scheduleNflData.map((item: ScheduleMatch) => ({
      ...item,
      home_crest: teamsMap[item.home_team?.toUpperCase()] ?? null,
      away_crest: teamsMap[item.away_team?.toUpperCase()] ?? null,
    }));
  }, [scheduleNflData, teamsMap]);

  const scheduleColumns = useMemo<ColumnDef<ScheduleWithCrests>[]>(
    () => [
      {
        header: "Home",
        accessorKey: "home_team",
        meta: { align: "left" },
        cell: (info: CellContext<ScheduleWithCrests, unknown>) => (
          <TeamDisplay
            name={info.getValue() as string}
            crest={info.row.original.home_crest || ""}
          />
        ),
      },
      {
        header: "Away",
        accessorKey: "away_team",
        meta: { align: "left" },
        cell: (info: CellContext<ScheduleWithCrests, unknown>) => (
          <TeamDisplay
            name={info.getValue() as string}
            crest={info.row.original.away_crest || ""}
          />
        ),
      },
      {
        header: "Date",
        accessorKey: "match_date",
        cell: (info: CellContext<ScheduleWithCrests, unknown>) =>
          (info.getValue() as string | null) || "—",
      },
      {
        header: "Time",
        accessorKey: "match_time",
        cell: (info: CellContext<ScheduleWithCrests, unknown>) =>
          (info.getValue() as string | null) || "—",
      },
    ],
    [],
  );

  const seedRows: SeedTeamWithCrest[] = useMemo(() => {
    if (!Array.isArray(seedPerWeekNflData)) return [];
    return seedPerWeekNflData.map((item: SeedTeamStat) => ({
      ...item,
      crest: teamsMap[item.name?.toUpperCase()] ?? null,
    }));
  }, [seedPerWeekNflData, teamsMap]);

  const seedColumns = useMemo<ColumnDef<SeedTeamWithCrest>[]>(
    () => [
      {
        header: "Team",
        accessorKey: "name",
        meta: { align: "left" },
        cell: (info: CellContext<SeedTeamWithCrest, unknown>) => (
          <TeamDisplay
            name={info.getValue() as string}
            crest={info.row.original.crest || ""}
          />
        ),
      },
      {
        header: "Seed",
        accessorKey: "seed",
      },
      {
        header: "Bye Week",
        accessorKey: "bye_team_current_week",
        cell: (info: CellContext<SeedTeamWithCrest, unknown>) =>
          info.getValue() ? "Yes" : "No",
      },
    ],
    [],
  );

  const columns = useMemo<ColumnDef<PortfolioWithCrests>[]>(
    () => [
      {
        header: "Portfolio",
        accessorKey: "portfolio",
        meta: { align: "left" },
        cell: (info: CellContext<PortfolioWithCrests, unknown>) => (
          <span style={{ color: "#05fa87" }}>{info.getValue() as string}</span>
        ),
      },
      ...Array.from({ length: 7 }, (_, i) => ({
        header: `Team ${i + 1}`,
        accessorFn: (row: PortfolioWithCrests) => row.teams?.[i]?.name || "",
        id: `team_${i}`,
        meta: { align: "left" as const },
        cell: (info: CellContext<PortfolioWithCrests, unknown>) => {
          const teamName = info.getValue() as string;
          const originalRow = info.row.original as PortfolioWithCrests;
          const fullTeam = originalRow.teams?.[i];

          return teamName && fullTeam ? (
            <TeamDisplay
              name={teamName}
              crest={fullTeam.crest || ""}
            />
          ) : null;
        },
      })),
      {
        header: () => (
          <Box sx={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
            <span>W</span>
            <span>SCORE</span>
          </Box>
        ),
        accessorKey: "week_score",
      },
    ],
    [],
  );

  const table = useReactTable({
    data: statsWithCrests,
    columns,
    state: {
      sorting,
      globalFilter: filtered,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setFiltered,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const scheduleTable = useReactTable({
    data: scheduleWithCrests,
    columns: scheduleColumns,
    state: {
      sorting,
      globalFilter: filtered,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setFiltered,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const seedTable = useReactTable({
    data: seedRows,
    columns: seedColumns,
    state: {
      sorting,
      globalFilter: filtered,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setFiltered,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const isSchedule = dataType === "SCHEDULE";
  const isSeed = dataType === "SEED";
  const isNarrowTable = isSchedule || isSeed;

  if (isLoading || isLoadingSchedule || isLoadingSeed) return <Loader />;

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
              {/* Left Column: Dropdowns */}
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
                      options={tournamentsNfl}
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
                      Week:
                    </Typography>
                  </Grid>
                  <Grid size={8}>
                    <DropDownHistory
                      name="week"
                      label=""
                      className={classes.DropDownHistory}
                      value={weekType || ""}
                      handleChange={(e) =>
                        setWeekType(e.target.value as string)
                      }
                      options={getScoreWeeks?.map((week: { week: number; label: string }) => {
                        return {
                          ...week,
                          name: week.label,
                          value: String(week.week),
                        };
                      })}
                    />
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
                {isSchedule ? "Schedule" : isSeed ? "Seed" : "Portfolios"} - Week:{" "}
                {weekType}
              </Typography>
            </Box>
            <Box
              sx={{
                width: isNarrowTable ? { xs: "100%", md: "50%" } : "100%",
                mx: isNarrowTable ? "auto" : 0,
                borderRadius: "4px",
                position: "relative",
              }}
            >
              <Tooltip title="Descargar CSV">
                <IconButton
                  onClick={() => {
                    const label = isSchedule
                      ? "Schedule"
                      : isSeed
                        ? "Seed"
                        : "Portfolios";
                    const filename = `Stats NFL - ${label} - Week ${weekType}`;
                    if (isSchedule) downloadTableAsCsv(filename, scheduleTable);
                    else if (isSeed) downloadTableAsCsv(filename, seedTable);
                    else downloadTableAsCsv(filename, table);
                  }}
                  sx={{
                    color: "white",
                    position: "absolute",
                    right: 0,
                    top: 0,
                  }}
                >
                  <FileDownloadOutlinedIcon />
                </IconButton>
              </Tooltip>
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
              {isSchedule ? (
                <ScoreTable
                  table={scheduleTable}
                  columnsLength={scheduleColumns.length}
                  hoveredRowId={hoveredRowId}
                  setHoveredRowId={setHoveredRowId}
                  hoveredCellId={hoveredCellId}
                  setHoveredCellId={setHoveredCellId}
                />
              ) : isSeed ? (
                <ScoreTable
                  table={seedTable}
                  columnsLength={seedColumns.length}
                  hoveredRowId={hoveredRowId}
                  setHoveredRowId={setHoveredRowId}
                  hoveredCellId={hoveredCellId}
                  setHoveredCellId={setHoveredCellId}
                />
              ) : (
                <ScoreTable
                  table={table}
                  columnsLength={columns.length}
                  hoveredRowId={hoveredRowId}
                  setHoveredRowId={setHoveredRowId}
                  hoveredCellId={hoveredCellId}
                  setHoveredCellId={setHoveredCellId}
                />
              )}
            </Box>
          </Grid>
        </Zoom>
      </Grid>
    </Grid>
  );
};

export default StatsNfl;
