import { useMemo, useState, useEffect } from "react";
import classes from "./StatsEpl.module.css";
import {
  // FormControl,
  // FormControlLabel,
  // Radio,
  // RadioGroup,
  Typography,
  Zoom,
  Box,
  Input,
  InputAdornment,
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import SearchIcon from "@mui/icons-material/Search";
import DropDownHistory from "../../components/Inputs/DropdDownHistory";
import Grid from "@mui/material/Grid2";
import { getScoreWeeksEpl, getStatsEpl } from "@/api/epl/StatsEplAPI";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Loader from "../../components/EPLBallLoader/EPLBallLoader";
import { getTeamsEpl } from "@/api/epl/PortfoliosEplAPI";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  SortingState,
  ColumnDef,
} from "@tanstack/react-table";
import { getTournaments } from "@/api/epl/HistoryEPLAPI";

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

const TeamDisplay = ({ name, crest }: { name: string; crest: string }) => (
  <Box
    display="flex"
    alignItems="center"
    justifyContent="start"
    gap={1}
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

const StatsEpl = () => {
  const [tournament, setTournament] = useState("EPL TOURNAMENT 2025");
  const [dataType, setDataType] = useState("PORTFOLIO");
  const [weekType, setWeekType] = useState<string>("");

  // const [sortOrder, setSortOrder] = useState("Score (Desc)");

  const dataTypes = [{ id: "1", name: "PORTFOLIO" }];
  // const weekTypes = [{ id: "1", name: "WEEK" }];

  const params = useParams();
  const userId = params.userId!;

  // ✅ FIX 1: SortingState inicializado con el valor por defecto correcto
  // ANTES: useState([]) — la tabla no sabía que debía ordenar por score al inicio
  const [sorting, setSorting] = useState<SortingState>([
    { id: "week_score", desc: true },
  ]);
  const [filtered, setFiltered] = useState<string>("");

  const { data: statsEplData, isLoading } = useQuery({
    queryKey: ["statsEpl", userId, weekType],
    queryFn: () => getStatsEpl({ week: weekType }),
    enabled: !!weekType,
  });

  const { data: teamsEplStats } = useQuery({
    queryKey: ["teamsEplStats", userId],
    queryFn: () => getTeamsEpl("2"),
  });

  const { data: tournamentsEpl } = useQuery({
    queryKey: ["tournamentsEpl", userId],
    queryFn: () => getTournaments("2"),
  });

  const { data: getScoreWeeks } = useQuery({
    queryKey: ["getScoreWeeksEpl", userId],
    queryFn: () => getScoreWeeksEpl({ tournamentId: "3" }),
    enabled: !!tournamentsEpl,
  });

  useEffect(() => {
    // Si tenemos semanas cargadas y el tipo de score (semana) no está definido
    if (getScoreWeeks && getScoreWeeks.length > 0 && !weekType) {
      // Tomamos la primera semana por defecto (el valor del value del option)
      setWeekType(String(getScoreWeeks[0].week));
    }
  }, [getScoreWeeks, weekType]);

  // ✅ FIX 2: teamsMap con useMemo
  // ANTES: se recalculaba en cada render → nuevo objeto en memoria → re-render → loop infinito
  // AHORA: solo se recalcula cuando cambia teamsEplStats (dato real de la API)
  const teamsMap: Record<string, string> = useMemo(() => {
    return (
      teamsEplStats?.reduce(
        (acc: Record<string, string>, team: TeamStat) => {
          acc[team.name] = team.crest_url;
          return acc;
        },
        {} as Record<string, string>,
      ) ?? {}
    );
  }, [teamsEplStats]);
  // ⚠️ Sin useMemo: cada render crea un {} nuevo → React lo detecta como cambio
  //    → vuelve a renderizar → {} nuevo → render → {} nuevo → LOOP SILENCIOSO

  // ✅ FIX 3: statsWithCrests con useMemo
  // ANTES: se calculaba directamente en el cuerpo del componente
  //        → nuevo array en cada render → useReactTable detecta nueva data
  //        → re-render → nuevo array → re-render → LOOP INFINITO
  // AHORA: solo se recalcula cuando cambian los datos reales de la API
  const statsWithCrests: PortfolioWithCrests[] = useMemo(() => {
    if (!statsEplData || !teamsMap) return [];

    return statsEplData.map((item: PortfolioStat) => {
      const teams: string[] = JSON.parse(item.teams);

      const teamsWithCrests: TeamWithCrest[] = teams.map(
        (teamName: string) => ({
          name: teamName,
          crest: teamsMap[teamName] ?? null,
        }),
      );

      return {
        portfolio: item.portfolio,
        week_score: item.week_score,
        teams: teamsWithCrests,
      };
    });
  }, [statsEplData, teamsMap]);
  // ⚠️ Nota: usamos teamsMap (ya memoizado) como dependencia, NO teamsEplStats directamente
  //    Si usáramos teamsEplStats aquí y no estuviera memoizado el teamsMap,
  //    igualmente tendríamos el problema

  // ✅ FIX 4: columns con useMemo (ya estaba, pero era incompleto)
  // ANTES: useMemo sin dependencias [] está bien para columnas estáticas
  // AHORA: igual, sin cambios necesarios aquí
  const columns = useMemo<ColumnDef<PortfolioWithCrests>[]>(
    () => [
      {
        header: "Portfolio",
        accessorKey: "portfolio",
        cell: (info: any) => (
          <span style={{ color: "#05fa87" }}>{info.getValue() as string}</span>
        ),
      },
      ...Array.from({ length: 7 }, (_, i) => ({
        header: `Team ${i + 1}`,
        accessorFn: (row: PortfolioWithCrests) => row.teams?.[i]?.name || "",
        id: `team_${i}`,
        cell: (info: any) => {
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

  // ✅ FIX 5: handleSortChange conectado al sorting de useReactTable
  // ANTES: solo actualizaba sortOrder (estado local del radio button)
  //        pero NUNCA llamaba a setSorting → la tabla nunca ordenaba nada
  //        Había DOS sistemas de sorting completamente desconectados entre sí
  // AHORA: sortOrder controla la UI del radio, setSorting controla la tabla
  // const handleSortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const value = event.target.value;
  //   // setSortOrder(value);

  //   // Conectamos el radio button con el sorting real de TanStack Table
  //   if (value === "Score (Desc)") {
  //     setSorting([{ id: "week_score", desc: true }]);
  //   } else if (value === "gap (Asc)") {
  //     // "Portfolio (Asc)" en la UI
  //     setSorting([{ id: "portfolio", desc: false }]);
  //   } else if (value === "Weight (Desc)") {
  //     setSorting([{ id: "week_score", desc: true }]);
  //   } else if (value === "Weight (Asc)") {
  //     setSorting([{ id: "week_score", desc: false }]);
  //   }
  // };

  const table = useReactTable({
    data: statsWithCrests, // ✅ Ahora es estable gracias a useMemo
    columns, // ✅ Ya era estable
    state: {
      sorting, // ✅ Ahora sorting se actualiza desde los radio buttons
      globalFilter: filtered,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setFiltered,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  if (isLoading) return <Loader />;

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
                      options={tournamentsEpl}
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
                      options={getScoreWeeks?.map((week: any) => {
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

              {/* Right Column: Radio Buttons */}
              {/* <Grid
                size={{ xs: 12, md: 5 }}
                display="flex"
                justifyContent="center"
              >
                <FormControl>
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    name="radio-buttons-group"
                    value={sortOrder}
                    onChange={handleSortChange} // ✅ Ahora sí actualiza la tabla
                  >
                    <FormControlLabel
                      value="Score (Desc)"
                      control={
                        <Radio
                          sx={{
                            color: "white",
                            "&.Mui-checked": { color: "#05fa87" },
                          }}
                        />
                      }
                      label={
                        <Typography color="white">Score (Desc)</Typography>
                      }
                    />
                    <FormControlLabel
                      value="gap (Asc)"
                      control={
                        <Radio
                          sx={{
                            color: "white",
                            "&.Mui-checked": { color: "#05fa87" },
                          }}
                        />
                      }
                      label={
                        <Typography color="white">Portfolio (Asc)</Typography>
                      }
                    />
                    <FormControlLabel
                      value="Weight (Desc)"
                      control={
                        <Radio
                          sx={{
                            color: "white",
                            "&.Mui-checked": { color: "#05fa87" },
                          }}
                        />
                      }
                      label={
                        <Typography color="white">Weight (Desc)</Typography>
                      }
                    />
                    <FormControlLabel
                      value="Weight (Asc)"
                      control={
                        <Radio
                          sx={{
                            color: "white",
                            "&.Mui-checked": { color: "#05fa87" },
                          }}
                        />
                      }
                      label={
                        <Typography color="white">Weight (Asc)</Typography>
                      }
                    />
                  </RadioGroup>
                </FormControl>
              </Grid> */}
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
                Portfolios - Week: {weekType}
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
              <div style={{ width: "100%", overflowX: "auto" }}>
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
                              backgroundColor: "#200930",
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
                        className={classes.tableRow}
                      >
                        {row.getVisibleCells().map((cell, index) => (
                          <td
                            key={cell.id}
                            className={
                              index !== 0 && index !== columns.length - 1
                                ? classes.cell
                                : undefined
                            }
                            style={{
                              position:
                                index === 0 || index === columns.length - 1
                                  ? "sticky"
                                  : "static",
                              left: index === 0 ? 0 : undefined,
                              right:
                                index === columns.length - 1 ? 0 : undefined,
                              backgroundColor:
                                index === 0 || index === columns.length - 1
                                  ? "#200930"
                                  : "#380f51",
                              zIndex:
                                index === 0 || index === columns.length - 1
                                  ? 3
                                  : 1,
                              color: "white",
                              fontWeight: "bold",
                              fontSize: "12px",
                              textAlign: "center",
                              padding: "8px",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </td>
                        ))}
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

export default StatsEpl;
