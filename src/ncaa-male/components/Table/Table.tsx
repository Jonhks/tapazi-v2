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

import { OtherScores, ParticipantsScores } from "@/types/index";

// ─── Dark theme helpers ───────────────────────────────────────────────────────

const headerBgColor = (index: number) =>
  index % 2 === 0 ? "#0d0d0d" : "#1a1a1a";

const cellBgColor = (colIndex: number, rowIndex: number) => {
  const isEvenCol = colIndex % 2 === 0;
  const isEvenRow = rowIndex % 2 === 0;
  if (isEvenCol) return isEvenRow ? "#0d0d0d" : "#141414";
  return isEvenRow ? "#1a1a1a" : "#212121";
};

// ─── Generic reusable table (dark theme) ─────────────────────────────────────

interface TableBaseProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  title?: string;
  maxHeight?: string;
  defaultSorting?: SortingState;
  stickyLastColumn?: boolean;
  searchWidth?: number | string;
}

export function TableBase<T>({
  data,
  columns,
  title,
  maxHeight,
  defaultSorting = [],
  stickyLastColumn = false,
  searchWidth,
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
      <div
        style={{
          width: "100%",
          backgroundColor: "rgb(13, 13, 13)",
          padding: "4px 0",
          // opacity: ".8",
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

      {/* Table */}
      <div
        className={`enable-horizontal-scroll${maxHeight ? " enable-vertical-scroll" : ""}`}
        style={{
          overflow: "auto",
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
                      position: isSticky(index, columns.length)
                        ? "sticky"
                        : "static",
                      left: index === 0 ? 0 : undefined,
                      right:
                        stickyLastColumn && index === columns.length - 1
                          ? 0
                          : undefined,
                      backgroundColor: headerBgColor(index),
                      color: "white",
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
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {{
                          asc: (
                            <ArrowUpwardIcon
                              style={{ fontSize: isMobile ? 12 : 16 }}
                            />
                          ),
                          desc: (
                            <ArrowUpwardIcon
                              style={{
                                transform: "rotate(180deg)",
                                fontSize: isMobile ? 12 : 16,
                              }}
                            />
                          ),
                        }[header.column.getIsSorted() as string] ?? (
                          <ArrowUpwardIcon
                            style={{
                              color: "gray",
                              fontSize: isMobile ? 12 : 16,
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
                {row.getVisibleCells().map((cell, index) => (
                  <td
                    key={cell.id}
                    style={{
                      position: isSticky(index, columns.length)
                        ? "sticky"
                        : "static",
                      left: index === 0 ? 0 : undefined,
                      right:
                        stickyLastColumn && index === columns.length - 1
                          ? 0
                          : undefined,
                      backgroundColor: cellBgColor(index, rowIndex),
                      color: "white",
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

// ─── Balón SVG ────────────────────────────────────────────────────────────────

export const BallSvg = () => (
  <svg
    viewBox="0 0 24 24"
    fill="#ffffff"
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
    style={{ verticalAlign: "middle", marginRight: 4, flexShrink: 0 }}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.86469 20.5828C5.44869 19.7374 4.22245 18.5294 3.33931 16.9997C2.45687 15.4713 2.02377 13.8067 1.99902 12.159L2.14358 12.1875C5.09262 12.7683 8.44759 11.7182 11.2053 10.0251C11.5679 9.8024 11.9235 9.56661 12.2695 9.31944C12.6827 9.83542 13.0527 10.3587 13.3508 10.875C13.7245 11.5223 14.0626 12.2923 14.3647 13.1149C13.8473 13.3653 13.3429 13.641 12.8569 13.9368C10.065 15.6356 7.68322 18.1135 6.86513 20.5815L6.86469 20.5828ZM16.2596 21.0475C13.6547 22.2776 10.7413 22.2853 8.22087 21.2588L8.28894 21.0535C8.95248 19.0517 11.0084 16.8174 13.6366 15.2182C14.0314 14.9779 14.4347 14.7547 14.8433 14.5507C15.0955 15.3805 15.314 16.2223 15.4984 17.0128C15.7377 18.0383 15.9153 18.9575 16.033 19.6201C16.0918 19.9512 16.1356 20.2176 16.1645 20.4004C16.179 20.4919 16.1898 20.5624 16.1969 20.6096L16.2047 20.6626L16.2066 20.6755L16.2071 20.6791L16.2596 21.0475Z"
    />
    <path d="M16.2259 13.9425C18.1134 13.2236 20.0374 12.9473 21.7027 13.3127L21.9074 13.3576C21.7856 14.2418 21.5463 15.1071 21.1961 15.9286C20.4717 17.6278 19.273 19.1396 17.6585 20.2451L17.6461 20.166C17.6158 19.9748 17.5705 19.699 17.5099 19.3578C17.3887 18.6757 17.206 17.7295 16.9592 16.672C16.7602 15.8192 16.5167 14.8803 16.2259 13.9425Z" />
    <path d="M13.4525 8.39743C15.1812 6.92819 16.5396 5.18651 17.1247 3.44818L17.1351 3.41705C18.5508 4.26242 19.7768 5.47033 20.6598 6.99972C21.5426 8.52873 21.9757 10.194 22.0001 11.8423C20.0045 11.4109 17.8139 11.7412 15.7443 12.5213C15.4235 11.6577 15.0594 10.8345 14.6498 10.125C14.3136 9.54274 13.9035 8.96194 13.4525 8.39743Z" />
    <path d="M8.31859 3.45405C8.06656 3.25473 7.86132 3.09745 7.71835 2.98945L7.69599 2.97258C9.45843 2.13001 11.3643 1.84893 13.1954 2.07088C14.0827 2.17844 14.9525 2.40412 15.7799 2.74129L15.703 2.96973C15.2258 4.38768 14.0529 5.92038 12.4746 7.26043C11.7443 6.46537 10.9739 5.7288 10.2721 5.09932C9.5149 4.42018 8.82228 3.85238 8.31859 3.45405Z" />
    <path d="M10.4204 8.74678C7.83381 10.3349 4.87005 11.1956 2.43343 10.7157L2.09084 10.6483C2.46012 7.95488 3.91943 5.43745 6.28141 3.7952L6.60935 4.03361L6.61139 4.0351L6.62073 4.04194L6.65977 4.07072C6.6946 4.09652 6.74673 4.13536 6.81423 4.18635C6.94926 4.28834 7.14566 4.43883 7.38814 4.63059C7.8735 5.01443 8.54149 5.56206 9.27055 6.21597C9.93035 6.80777 10.6282 7.47615 11.2825 8.18057C11.0033 8.37645 10.7155 8.5656 10.4204 8.74678Z" />
  </svg>
);

// ─── TableParticipants — usa TableBase con tema oscuro ────────────────────────

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
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  whiteSpace: "nowrap",
                }}
              >
                {teamName && <BallSvg />}
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
