// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useDeferredValue, useMemo, useState } from "react";
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
import { Input, InputAdornment, useMediaQuery } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import classes from "./Table.module.css";
import { sportThemes } from "@/shared/theme/colors";
import { OtherScores, ParticipantsScores } from "@/types/index";

const theme = sportThemes.worldcup;

// ─── Color helpers — tema teal/cyan ──────────────────────────────────────────

const headerBgColor = (index: number) =>
  index % 2 === 0 ? theme.headerEven : theme.headerOdd;

const cellBgColor = (colIndex: number, rowIndex: number) => {
  const isEvenCol = colIndex % 2 === 0;
  const isEvenRow = rowIndex % 2 === 0;
  if (isEvenCol) return isEvenRow ? theme.cellEvenColEvenRow : theme.cellEvenColOddRow;
  return isEvenRow ? theme.cellOddColEvenRow : theme.cellOddColOddRow;
};

// ─── TableBase genérica ───────────────────────────────────────────────────────

interface TableBaseProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  title?: string;
  maxHeight?: string;
  defaultSorting?: SortingState;
  stickyLastColumn?: boolean;
  searchWidth?: number | string;
  hideSearch?: boolean;
}

export function TableBase<T>({
  data,
  columns,
  title,
  maxHeight,
  defaultSorting = [],
  stickyLastColumn = false,
  searchWidth,
  hideSearch = false,
}: TableBaseProps<T>) {
  const [sorting, setSorting] = useState<SortingState>(defaultSorting);
  const [filtered, setFiltered] = useState("");
  const deferredFiltered = useDeferredValue(filtered);
  const isMobile = useMediaQuery("(max-width:900px)");

  const table = useReactTable({
    data: data ?? [],
    columns,
    state: { sorting, globalFilter: deferredFiltered },
    onSortingChange: setSorting,
    onGlobalFilterChange: setFiltered,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const isSticky = (index: number, total: number) =>
    index === 0 || (stickyLastColumn && index === total - 1);

  return (
    <div style={{ width: "100%" }}>
      {title && (
        <div className={`${classes.firstTableRow} ${classes.fixed}`}>
          {title}
        </div>
      )}

      {/* Search */}
      {!hideSearch && (
        <div
          style={{
            width: "100%",
            backgroundColor: theme.headerEven,
            padding: "4px 0",
          }}
        >
          <div
            style={{
              position: "sticky",
              left: 0,
              top: 0,
              zIndex: 3,
              backgroundColor: "#d6cfcfff",
              color: "black",
              width: searchWidth ?? (isMobile ? 150 : 250),
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
        </div>
      )}

      {/* Table */}
      <div
        className={`enable-horizontal-scroll${maxHeight ? " enable-vertical-scroll" : ""}`}
        style={{
          overflowX: "scroll",
          overflowY: maxHeight ? "scroll" : "visible",
          ...(maxHeight ? { maxHeight } : {}),
        }}
      >
        <table
          style={{ width: "100%", borderCollapse: "collapse", opacity: 0.9 }}
        >
          <thead style={{ position: "sticky", top: 0, zIndex: 2 }}>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    style={{
                      position: isSticky(index, columns.length) ? "sticky" : "static",
                      left: index === 0 ? 0 : undefined,
                      right: stickyLastColumn && index === columns.length - 1 ? 0 : undefined,
                      backgroundColor: headerBgColor(index),
                      color: index === 0 ? theme.accent : theme.text,
                      fontWeight: "bold",
                      fontSize: isMobile ? "9px" : "10px",
                      textAlign: (index === 0 || index === columns.length - 1) ? "center" : "left",
                      textTransform: "uppercase",
                      padding: isMobile ? "8px 4px" : "14px 10px",
                      cursor: "pointer",
                      zIndex: isSticky(index, columns.length) ? 3 : 2,
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: (index === 0 || index === columns.length - 1) ? "center" : "flex-start",
                          gap: 4,
                        }}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{
                          asc: <ArrowUpwardIcon style={{ fontSize: isMobile ? 12 : 16 }} />,
                          desc: (
                            <ArrowUpwardIcon
                              style={{ transform: "rotate(180deg)", fontSize: isMobile ? 12 : 16 }}
                            />
                          ),
                        }[header.column.getIsSorted() as string] ?? (
                          <ArrowUpwardIcon style={{ color: "gray", fontSize: isMobile ? 12 : 16 }} />
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
                      position: isSticky(index, columns.length) ? "sticky" : "static",
                      left: index === 0 ? 0 : undefined,
                      right: stickyLastColumn && index === columns.length - 1 ? 0 : undefined,
                      backgroundColor: cellBgColor(index, rowIndex),
                      color: index === 0 ? theme.accent : theme.text,
                      fontWeight: "bold",
                      fontSize: isMobile ? "12px" : "11px",
                      textAlign: (index === 0 || index === columns.length - 1) ? "center" : "left",
                      padding: isMobile ? "8px 4px" : "12px 10px",
                      zIndex: isSticky(index, columns.length) ? 1 : 0,
                      whiteSpace: "nowrap",
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
}

// ─── Ícono balón de fútbol SVG ────────────────────────────────────────────────

export const SoccerBallSvg = () => (
  <svg
    viewBox="0 0 24 24"
    fill="#ffffff"
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
    style={{ verticalAlign: "middle", marginRight: 4, flexShrink: 0 }}
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.93V15l-3-3 1-4 3-1 3 1 1 4-3 3v1.93C9.39 17.72 7 15.06 7 12c0-.34.03-.67.08-1H9l2 2v-1l-1-3h4l-1 3v1l2-2h1.92c.05.33.08.66.08 1 0 3.06-2.39 5.72-5 5.93z"/>
  </svg>
);

// ─── TableParticipants — usa TableBase con tema worldcup ──────────────────────

interface Props {
  participantScore: ParticipantsScores;
  othersParticipants: OtherScores[];
}

const TableParticipants = ({ participantScore, othersParticipants }: Props) => {
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
      { header: "Portfolio Entry", accessorKey: "portfolio_name" },
      { header: "Portfolio Weight", accessorKey: "portfolio_weight" },
      ...[1, 2, 3, 4, 5, 6, 7, 8].map(
        (n): ColumnDef<OtherScores> => ({
          header: `Team ${n}`,
          accessorKey: `team${n}_name`,
          cell: ({ row }) => {
            const teamName = row.original[`team${n}_name` as keyof OtherScores];
            return (
              <span style={{ display: "inline-flex", alignItems: "center", whiteSpace: "nowrap" }}>
                {teamName && <SoccerBallSvg />}
                {teamName}
              </span>
            );
          },
        }),
      ),
      { header: "Score", accessorKey: "score" },
      {
        header: "Championship Game Point",
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

  return (
    <TableBase
      data={mergedData}
      columns={columns}
      maxHeight="600px"
      stickyLastColumn
    />
  );
};

export default TableParticipants;
