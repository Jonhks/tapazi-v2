import { useMemo, useRef } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useMediaQuery } from "@mui/material";
import { SportTheme } from "@/shared/theme/colors";

const EXCLUDED_KEYS = [
  "tournament_name",
  "consecutive",
  "round5_place",
  "round5_eliminated_teams",
  "round4_place",
  "round4_eliminated_teams",
  "round3_place",
  "round3_eliminated_teams",
  "round2_place",
  "round2_eliminated_teams",
  "round1_place",
  "round1_eliminated_teams",
];

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const ROW_HEIGHT = 40;

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  arrHistory: any[];
  score: string;
  isFetching?: boolean;
  theme: SportTheme;
}

const TableHistoryAllRounds = ({
  arrHistory,
  score,
  isFetching = false,
  theme,
}: Props) => {
  const isMobile = useMediaQuery("(max-width:900px)");
  const scrollRef = useRef<HTMLDivElement>(null);

  const headerBgColor = (index: number) =>
    index % 2 === 0 ? theme.headerEven : theme.headerOdd;

  const cellBgColor = (colIndex: number, rowIndex: number) => {
    const isEvenCol = colIndex % 2 === 0;
    const isEvenRow = rowIndex % 2 === 0;
    if (isEvenCol)
      return isEvenRow ? theme.cellEvenColEvenRow : theme.cellEvenColOddRow;
    return isEvenRow ? theme.cellOddColEvenRow : theme.cellOddColOddRow;
  };

  const columns = useMemo(() => {
    if (!arrHistory?.[0]) return [];
    return Object.keys(arrHistory[0])
      .filter((key) => !EXCLUDED_KEYS.includes(key))
      .map((key) => ({
        header: capitalize(key.replace(/_/g, " ")),
        accessorKey: key,
      }));
  }, [arrHistory]);

  const table = useReactTable({
    data: arrHistory ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualSorting: true,
  });

  const rows = table.getRowModel().rows;

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 10,
  });

  const virtualRows = virtualizer.getVirtualItems();
  const totalHeight = virtualizer.getTotalSize();
  const paddingTop = virtualRows.length > 0 ? virtualRows[0].start : 0;
  const paddingBottom =
    virtualRows.length > 0
      ? totalHeight - virtualRows[virtualRows.length - 1].end
      : 0;

  if (!arrHistory) return null;

  return (
    <div style={{ width: "100%", position: "relative" }}>
      {/* Título sticky */}
      <div
        style={{
          width: "100%",
          backgroundColor: theme.headerEven,
          color: theme.accent,
          fontSize: "1.6rem",
          opacity: 0.8,
          textAlign: "center",
          borderBottom: `2px solid ${theme.accent}`,
          padding: "12px 5px",
          maxHeight: 56,
          overflow: "scroll",
          position: "sticky",
          left: 0,
          zIndex: 2,
        }}
      >
        {score}
      </div>

      {/* Overlay de carga */}
      {isFetching && (
        <div
          style={{
            position: "absolute",
            top: 56,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.4)",
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: theme.text,
            fontSize: 14,
            fontWeight: "bold",
            letterSpacing: 1,
          }}
        >
          Cargando...
        </div>
      )}

      {/* Contenedor con scroll y virtualización */}
      <div
        ref={scrollRef}
        style={{ overflowX: "scroll", overflowY: "scroll", maxHeight: "48vh" }}
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
                    style={{
                      position: index === 0 ? "sticky" : "static",
                      left: index === 0 ? 0 : undefined,
                      backgroundColor: headerBgColor(index),
                      color: index === 0 ? theme.accent : theme.text,
                      fontWeight: "bold",
                      fontSize: isMobile ? "9px" : "10px",
                      textAlign: index === 0 ? "center" : "left",
                      textTransform: "uppercase",
                      padding: isMobile ? "8px 4px" : "14px 10px",
                      zIndex: index === 0 ? 3 : 2,
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {paddingTop > 0 && (
              <tr>
                <td style={{ height: paddingTop, padding: 0 }} />
              </tr>
            )}
            {virtualRows.map((virtualRow) => {
              const row = rows[virtualRow.index];
              return (
                <tr
                  key={row.id}
                  style={{ height: ROW_HEIGHT }}
                >
                  {row.getVisibleCells().map((cell, index) => (
                    <td
                      key={cell.id}
                      style={{
                        position: index === 0 ? "sticky" : "static",
                        left: index === 0 ? 0 : undefined,
                        backgroundColor: cellBgColor(index, virtualRow.index),
                        color: index === 0 ? theme.accent : theme.text,
                        fontWeight: "bold",
                        fontSize: isMobile ? "12px" : "11px",
                        textAlign: index === 0 ? "center" : "left",
                        padding: isMobile ? "8px 4px" : "12px 10px",
                        zIndex: index === 0 ? 1 : 0,
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
              );
            })}
            {paddingBottom > 0 && (
              <tr>
                <td style={{ height: paddingBottom, padding: 0 }} />
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableHistoryAllRounds;
