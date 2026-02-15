import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
  ColumnDef,
} from "@tanstack/react-table";

import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { Input, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import classes from "./Table.module.css";
import useMediaQuery from "@mui/material/useMediaQuery";
import { OtherScores, ParticipantsScores } from "@/types/index";

interface Props {
  participantScore: ParticipantsScores;
  othersParticipants: OtherScores[];
}

const TableParticipants = ({ participantScore, othersParticipants }: Props) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filtered, setFiltered] = useState("");
  const isMobile = useMediaQuery("(max-width: 600px)");

  // 🔥 Merge de data como en tu primera tabla
  const mergedData: OtherScores[] = useMemo(() => {
    const participantArray = Array.isArray(participantScore)
      ? (participantScore as OtherScores[])
      : [];

    const othersArray = Array.isArray(othersParticipants)
      ? othersParticipants
      : [];

    return [...participantArray, ...othersArray];
  }, [participantScore, othersParticipants]);

  const columns = useMemo<ColumnDef<OtherScores>[]>(
    () => [
      {
        header: "Portfolio Name",
        accessorKey: "portfolio_name",
      },
      {
        header: "Portfolio Weight",
        accessorKey: "portfolio_weight",
      },
      {
        header: "Team 1",
        accessorKey: "team1_name",
      },
      {
        header: "Team 2",
        accessorKey: "team2_name",
      },
      {
        header: "Team 3",
        accessorKey: "team3_name",
      },
      {
        header: "Team 4",
        accessorKey: "team4_name",
      },
      {
        header: "Team 5",
        accessorKey: "team5_name",
      },
      {
        header: "Team 6",
        accessorKey: "team6_name",
      },
      {
        header: "Team 7",
        accessorKey: "team7_name",
      },
      {
        header: "Team 8",
        accessorKey: "team8_name",
      },
      {
        header: "Score",
        accessorKey: "score",
      },
      {
        header: "Championship Points",
        accessorKey: "championship_points",
        cell: ({ row }) => {
          const { paid, championship_points } = row.original;

          return (
            <span className={paid ? classes.green : classes.red}>
              {championship_points}
            </span>
          );
        },
      },
    ],
    [],
  );

  const table = useReactTable({
    data: mergedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      globalFilter: filtered,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setFiltered,
  });

  return (
    <>
      {/* 🔍 Search */}
      <div
        style={{
          position: "sticky",
          left: 0,
          top: 0,
          zIndex: 3,
          backgroundColor: "#d6cfcfff",
          color: "black",
          width: isMobile ? 150 : 250,
          borderRadius: 5,
          display: "flex",
          alignItems: "center",
          padding: "4px",
          height: isMobile ? 20 : 30,
        }}
      >
        <Input
          type="search"
          fullWidth
          placeholder="Search..."
          value={filtered ?? ""}
          onChange={(e) => setFiltered(String(e.target.value))}
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          }
          inputProps={{
            style: { textTransform: "lowercase" },
            autoCapitalize: "none",
          }}
        />
      </div>

      {/* 📊 Table */}
      <div style={{ overflow: "auto", maxHeight: "600px" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead style={{ position: "sticky", top: 0, zIndex: 2 }}>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    style={{
                      position:
                        index === 0 ||
                        (!isMobile && index === 1) ||
                        index === columns.length - 1
                          ? "sticky"
                          : "static",
                      left: index === 0 ? 0 : index === 1 ? 50 : undefined,
                      right: index === columns.length - 1 ? 0 : undefined,
                      backgroundColor: index % 2 === 0 ? "black" : "#6e6e6e",
                      color: index === 0 ? "05fa87" : "white",
                      fontWeight: "bold",
                      fontSize: isMobile ? "10px" : "12px",
                      textAlign: "center",
                      padding: isMobile ? "4px" : "12px",
                      cursor: "pointer",
                      zIndex: 3,
                      opacity: 0.8,
                    }}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 4,
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {{
                          asc: <ArrowUpwardIcon style={{ fontSize: 18 }} />,
                          desc: (
                            <ArrowUpwardIcon
                              style={{
                                transform: "rotate(180deg)",
                                fontSize: 18,
                              }}
                            />
                          ),
                        }[header.column.getIsSorted() as string] ?? (
                          <ArrowUpwardIcon
                            style={{
                              color: "gray",
                              fontSize: 18,
                            }}
                          />
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.map((row, rowIndex) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell, index) => {
                  const isPortfolioName = cell.column.id === "portfolio_name";
                  const color2 = rowIndex % 2 === 0 ? "#202020" : "#8f8f8f";
                  return (
                    <td
                      key={cell.id}
                      style={{
                        position:
                          index === 0 ||
                          index === 1 ||
                          index === columns.length - 1
                            ? "sticky"
                            : "static",
                        left: index === 0 ? 0 : index === 1 ? 50 : undefined,
                        right: index === columns.length - 1 ? 0 : undefined,
                        backgroundColor: index % 2 === 0 ? "black" : color2,
                        color: isPortfolioName ? "#05fa87" : "white",
                        fontWeight: "bold",
                        fontSize: isMobile ? "10px" : "12px",
                        textAlign: "center",
                        padding: isMobile ? "4px" : "8px",
                        zIndex: 1,
                        opacity: 0.8,
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default TableParticipants;
