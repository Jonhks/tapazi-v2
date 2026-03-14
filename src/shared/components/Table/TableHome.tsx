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
import useMediaQuery from "@mui/material/useMediaQuery";
import { OtherScores, ParticipantsScores } from "@/types/index";

const TeamCell = ({
  value,
  isMobile,
}: {
  value: string;
  isMobile: boolean;
}) => (
  <span style={{ fontSize: isMobile ? "12px" : "11px", letterSpacing: "0.5px" }}>
    {value ? String(value).toUpperCase() : "—"}
  </span>
);

interface Props {
  participantScore: ParticipantsScores;
  othersParticipants: OtherScores[];
  accentColor?: string;
}

const GREEN = "#00e676";
const RED = "#ff5252";
const HDR_EVEN = "#1a1a2e";
const HDR_ODD = "#2d2d44";
const ROW_EVEN_DARK = "#111120";
const ROW_EVEN_LIGHT = "#252538";
const ROW_ODD_DARK = "#1c1c2e";
const ROW_ODD_LIGHT = "#303048";

const TableHome = ({
  participantScore,
  othersParticipants,
  accentColor = "#e040fb",
}: Props) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filtered, setFiltered] = useState("");
  const isMobile = useMediaQuery("(max-width: 600px)");

  const mergedData: OtherScores[] = useMemo(() => {
    const participantArray = Array.isArray(participantScore)
      ? (participantScore as OtherScores[])
      : [];
    const othersArray = Array.isArray(othersParticipants)
      ? othersParticipants
      : [];
    return [...participantArray, ...othersArray];
  }, [participantScore, othersParticipants]);

  const teamKeys = [
    "team1_name",
    "team2_name",
    "team3_name",
    "team4_name",
    "team5_name",
    "team6_name",
    "team7_name",
    "team8_name",
  ];
  const teamHeaders = [
    "TEAM 1",
    "TEAM 2",
    "TEAM 3",
    "TEAM 4",
    "TEAM 5",
    "TEAM 6",
    "TEAM 7",
    "TEAM 8",
  ];

  const columns = useMemo<ColumnDef<OtherScores>[]>(
    () => [
      {
        header: "PORTFOLIO ENTRY",
        accessorKey: "portfolio_name",
        cell: ({ getValue }) => (
          <span
            style={{
              color: accentColor,
              fontWeight: 600,
              fontSize: isMobile ? "12px" : "13px",
              letterSpacing: "1px",
            }}
          >
            {String(getValue() ?? "")}
          </span>
        ),
      },
      {
        header: "PORTFOLIO WEIGHT",
        accessorKey: "portfolio_weight",
      },
      ...teamKeys.map((key, i) => ({
        header: teamHeaders[i],
        accessorKey: key,
        cell: ({ getValue }: { getValue: () => unknown }) => (
          <TeamCell
            value={String(getValue() ?? "")}
            isMobile={isMobile}
          />
        ),
      })),
      {
        header: "SCORE",
        accessorKey: "score",
      },
      {
        header: "CHAMPIONSHIP GAME POINT",
        accessorKey: "championship_points",
        cell: ({ row }) => {
          const { paid, championship_points } = row.original;
          return (
            <span
              style={{
                color: paid ? GREEN : RED,
                fontWeight: 600,
                fontSize: "14px",
              }}
            >
              {championship_points}
            </span>
          );
        },
      },
    ],
    [isMobile, accentColor],
  );

  const table = useReactTable({
    data: mergedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { sorting, globalFilter: filtered },
    onSortingChange: setSorting,
    onGlobalFilterChange: setFiltered,
  });

  const totalCols = columns.length;
  const isFirst = (i: number) => i === 0;
  const isSecond = (i: number) => i === 1;
  const isLast = (i: number) => i === totalCols - 1;
  const isSticky = (i: number) =>
    isFirst(i) || (!isMobile && isSecond(i)) || isLast(i);
  const secondColLeft = isMobile ? 80 : 100;

  const getHeaderBg = (i: number) => {
    if (isFirst(i)) return "#0d0d1a";
    if (isLast(i)) return HDR_ODD;
    return i % 2 === 0 ? HDR_EVEN : HDR_ODD;
  };

  const getCellBg = (colIndex: number, rowIndex: number) => {
    const isDarkCol = colIndex % 2 === 0;
    const isEvenRow = rowIndex % 2 === 0;
    if (isDarkCol) return isEvenRow ? ROW_EVEN_DARK : ROW_ODD_DARK;
    return isEvenRow ? ROW_EVEN_LIGHT : ROW_ODD_LIGHT;
  };

  return (
    <div style={{ borderRadius: 8, minHeight: 300 }}>
      {/* ── Search ── */}
      <div
        style={{
          position: "sticky",
          left: 0,
          top: 0,
          zIndex: 3,
          backgroundColor: "#1e1e3a",
          color: "white",
          width: isMobile ? 150 : 250,
          borderRadius: 5,
          display: "flex",
          alignItems: "center",
          padding: "4px 8px",
          height: isMobile ? 28 : 36,
          marginBottom: 8,
          border: "1px solid #3a3a5c",
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
              <SearchIcon style={{ color: accentColor, fontSize: 18 }} />
            </InputAdornment>
          }
          inputProps={{
            style: {
              textTransform: "lowercase",
              color: "white",
              fontSize: isMobile ? 11 : 13,
            },
            autoCapitalize: "none",
          }}
          disableUnderline
          sx={{ "& input::placeholder": { color: "#666" } }}
        />
      </div>

      {/* ── Table ── */}
      <div
        style={{ overflow: "auto", maxHeight: "600px" }}
        className="enable-horizontal-scroll"
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "separate",
            borderSpacing: "2px",
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
                      position: isSticky(index) ? "sticky" : "static",
                      left: isFirst(index)
                        ? 0
                        : isSecond(index)
                          ? secondColLeft
                          : undefined,
                      right: isLast(index) ? 0 : undefined,
                      backgroundColor: getHeaderBg(index),
                      color: isFirst(index) ? accentColor : "white",
                      fontWeight: 900,
                      fontSize: "10px",
                      textAlign: "center",
                      padding: isMobile ? "6px 4px" : "12px 10px",
                      cursor: "pointer",
                      zIndex: 3,
                      letterSpacing: "0.5px",
                      whiteSpace: "pre-wrap",
                      borderBottom: `2px solid ${accentColor}`,
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
                          asc: (
                            <ArrowUpwardIcon
                              style={{ fontSize: isMobile ? 10 : 14 }}
                            />
                          ),
                          desc: (
                            <ArrowUpwardIcon
                              style={{
                                transform: "rotate(180deg)",
                                fontSize: isMobile ? 10 : 14,
                              }}
                            />
                          ),
                        }[header.column.getIsSorted() as string] ?? (
                          <ArrowUpwardIcon
                            style={{ color: "#555", fontSize: isMobile ? 10 : 12 }}
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
                {row.getVisibleCells().map((cell, index) => (
                  <td
                    key={cell.id}
                    style={{
                      position: isSticky(index) ? "sticky" : "static",
                      left: isFirst(index)
                        ? 0
                        : isSecond(index) && !isMobile
                          ? secondColLeft
                          : undefined,
                      right: isLast(index) ? 0 : undefined,
                      backgroundColor: getCellBg(index, rowIndex),
                      color: "white",
                      fontWeight: 400,
                      fontSize: "12px",
                      textAlign: "center",
                      padding: isMobile ? "8px 4px" : "10px 10px",
                      zIndex: 1,
                      whiteSpace: "pre-wrap",
                      borderBottom: "1px solid #1a1a30",
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
    </div>
  );
};

export default TableHome;
