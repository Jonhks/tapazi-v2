// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useMemo, useState } from "react";
import { Box, Typography, Input, InputAdornment } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import SearchIcon from "@mui/icons-material/Search";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";

type TeamStat = {
  id: number;
  name: string;
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
        flexShrink: 0,
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

export default function TablePortfolioWeekStats({
  statsData,
  teamsData,
  weekLabel,
}: {
  statsData: PortfolioStat[];
  teamsData: TeamStat[];
  weekLabel: string;
}) {
  const [sorting, setSorting] = useState([{ id: "week_score", desc: true }]);
  const [filtered, setFiltered] = useState("");

  const teamsMap: Record<string, string> = useMemo(() => {
    return (
      teamsData?.reduce((acc, team) => {
        acc[team.name] = team.crest_url;
        return acc;
      }, {}) ?? {}
    );
  }, [teamsData]);

  const statsWithCrests: PortfolioWithCrests[] = useMemo(() => {
    if (!statsData || !teamsMap) return [];
    return statsData.map((item) => {
      const teams: string[] = JSON.parse(item.teams);
      return {
        portfolio: item.portfolio,
        week_score: item.week_score,
        teams: teams.map((teamName) => ({
          name: teamName,
          crest: teamsMap[teamName] ?? null,
        })),
      };
    });
  }, [statsData, teamsMap]);

  const maxTeams = useMemo(
    () => Math.max(...statsWithCrests.map((r) => r.teams.length), 0),
    [statsWithCrests],
  );

  const columns = useMemo(
    () => [
      {
        header: "Portfolio",
        accessorKey: "portfolio",
        cell: (info) => (
          <span style={{ color: "#eaad2b" }}>{info.getValue()}</span>
        ),
      },
      ...Array.from({ length: maxTeams }, (_, i) => ({
        header: `Team ${i + 1}`,
        accessorFn: (row) => row.teams?.[i]?.name || "",
        id: `team_${i}`,
        cell: (info) => {
          const teamName = info.getValue();
          const fullTeam = info.row.original.teams?.[i];
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
    [maxTeams],
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

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ width: "100%", textAlign: "center", mb: 2 }}>
        <Typography
          variant="h5"
          sx={{
            color: "white",
            fontWeight: "bold",
            textTransform: "uppercase",
          }}
        >
          Portfolios - {weekLabel}
        </Typography>
      </Box>

      <div
        style={{
          position: "sticky",
          left: 0,
          backgroundColor: "black",
          color: "white",
          width: 200,
          borderRadius: 5,
          padding: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: 0.7,
        }}
      >
        <Input
          type="search"
          sx={{ width: "100%", padding: "0", color: "white" }}
          placeholder="Search..."
          value={filtered ?? ""}
          onChange={(e) => setFiltered(String(e.target.value))}
          startAdornment={
            <InputAdornment
              position="start"
              sx={{ pl: 1 }}
            >
              <SearchIcon sx={{ color: "white" }} />
            </InputAdornment>
          }
          inputProps={{
            style: {
              textTransform: "lowercase",
              padding: "5px",
              color: "white",
            },
            autoCapitalize: "none",
          }}
        />
      </div>

      <div className="enable-horizontal-scroll" style={{ width: "100%", overflowX: "auto" }}>
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
                      right: index === columns.length - 1 ? 0 : undefined,
                      backgroundColor: "black",
                      zIndex:
                        index === 0 || index === columns.length - 1 ? 4 : 2,
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "12px",
                      textAlign: "center",
                      padding: "10px",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      border: "2px solid #eaad2b",
                      opacity: 0.8,
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
                        <span style={{ display: "flex", alignItems: "center" }}>
                          {{
                            asc: (
                              <ArrowUpwardIcon
                                style={{ fontSize: "16px", marginLeft: "4px" }}
                              />
                            ),
                            desc: (
                              <ArrowUpwardIcon
                                style={{
                                  transform: "rotate(180deg)",
                                  fontSize: "16px",
                                  marginLeft: "4px",
                                }}
                              />
                            ),
                          }[header.column.getIsSorted()] ?? (
                            <ArrowUpwardIcon
                              style={{
                                color: "#eaad2b",
                                fontSize: "14px",
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
            {table.getRowModel().rows.map((row, rowIndex) => (
              <tr
                key={row.id}
                style={{
                  backgroundColor: rowIndex % 2 === 0 ? "#874607" : "#e27d25",
                  opacity: 0.8,
                }}
              >
                {row.getVisibleCells().map((cell, index) => (
                  <td
                    key={cell.id}
                    style={{
                      position:
                        index === 0 || index === columns.length - 1
                          ? "sticky"
                          : "static",
                      left: index === 0 ? 0 : undefined,
                      right: index === columns.length - 1 ? 0 : undefined,
                      backgroundColor:
                        index === 0 || index === columns.length - 1
                          ? "#572d03"
                          : rowIndex % 2 === 0
                            ? "#874607"
                            : "#e27d25",
                      zIndex:
                        index === 0 || index === columns.length - 1 ? 3 : 1,
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "11px",
                      textAlign: "center",
                      padding: "7px 10px",
                      whiteSpace: "nowrap",
                      border: "2px solid #eaad2b",
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Box>
  );
}
