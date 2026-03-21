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

type TeamPickedRow = {
  portfolioName: string;
  portfolioWeight: string;
  team1Name: string;
  team2Name: string;
  team3Name: string;
  team4Name: string;
  team5Name: string;
  team6Name: string;
  team7Name: string;
  team8Name: string;
  wins: number;
  score: string;
  eliminatedTeams: number;
};

export default function TableTeamsPicked({
  arrHistory,
  weekLabel,
}: {
  arrHistory: TeamPickedRow[];
  weekLabel?: string;
}) {
  const [sorting, setSorting] = useState([{ id: "score", desc: true }]);
  const [filtered, setFiltered] = useState("");

  const columns = useMemo(
    () => [
      {
        header: "Portfolio",
        accessorKey: "portfolioName",
        cell: (info) => (
          <span style={{ color: "#eaad2b" }}>{info.getValue()}</span>
        ),
      },
      {
        header: "Weight",
        accessorKey: "portfolioWeight",
        cell: (info) => {
          const val = parseFloat(info.getValue());
          return <span>{isNaN(val) ? info.getValue() : val.toFixed(2)}</span>;
        },
      },
      {
        header: "Team 1",
        accessorKey: "team1Name",
      },
      {
        header: "Team 2",
        accessorKey: "team2Name",
      },
      {
        header: "Team 3",
        accessorKey: "team3Name",
      },
      {
        header: "Team 4",
        accessorKey: "team4Name",
      },
      {
        header: "Team 5",
        accessorKey: "team5Name",
      },
      {
        header: "Team 6",
        accessorKey: "team6Name",
      },
      {
        header: "Team 7",
        accessorKey: "team7Name",
      },
      {
        header: "Team 8",
        accessorKey: "team8Name",
      },
      {
        header: "Wins",
        accessorKey: "wins",
      },
      {
        header: () => (
          <Box sx={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
            <span>Elim</span>
            <span>Teams</span>
          </Box>
        ),
        accessorKey: "eliminatedTeams",
        id: "eliminatedTeams",
      },
      {
        header: "Score",
        accessorKey: "score",
        cell: (info) => {
          const val = parseFloat(info.getValue());
          return <span>{isNaN(val) ? info.getValue() : val.toFixed(2)}</span>;
        },
      },
    ],
    [],
  );

  const table = useReactTable({
    data: arrHistory ?? [],
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
          Teams Picked{weekLabel ? ` - ${weekLabel}` : ""}
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
