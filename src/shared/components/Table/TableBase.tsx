import { useDeferredValue, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
  ColumnDef,
  Cell,
} from "@tanstack/react-table";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { Input, InputAdornment, useMediaQuery } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { SportTheme } from "@/shared/theme/colors";

// ─── Props ────────────────────────────────────────────────────────────────────

export interface TableBaseProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  /** Tema de color del deporte. Viene de sportThemes en shared/theme/colors.ts */
  theme: SportTheme;
  title?: string;
  maxHeight?: string;
  defaultSorting?: SortingState;
  stickyLastColumn?: boolean;
  searchWidth?: number | string;
  /** Oculta el buscador. Por defecto: false */
  hideSearch?: boolean;
  /**
   * Cuando es true, la primera columna (nombre/portfolio) usa theme.accent como color.
   * Útil para female (magenta) y worldcup (cyan). Por defecto: false
   */
  accentFirstColumn?: boolean;
  /**
   * Callback opcional para click en celda. Cuando está presente las celdas
   * muestran cursor:pointer. Úsalo para el patrón click-to-fetch de EPL.
   * Columnas a ignorar (ej. sticky) deben filtrarse en el callback del consumidor.
   */
  onCellClick?: (cell: Cell<T, unknown>, columnIndex: number) => void;
}

// ─── TableBase genérica ───────────────────────────────────────────────────────

export function TableBase<T>({
  data,
  columns,
  theme,
  title,
  maxHeight,
  defaultSorting = [],
  stickyLastColumn = false,
  searchWidth,
  hideSearch = false,
  accentFirstColumn = false,
  onCellClick,
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

  const totalCols = columns.length;

  const isSticky = (index: number) =>
    index === 0 || (stickyLastColumn && index === totalCols - 1);

  const headerBg = (index: number) =>
    index % 2 === 0 ? theme.headerEven : theme.headerOdd;

  const cellBg = (colIndex: number, rowIndex: number) => {
    const isEvenCol = colIndex % 2 === 0;
    const isEvenRow = rowIndex % 2 === 0;
    if (isEvenCol)
      return isEvenRow ? theme.cellEvenColEvenRow : theme.cellEvenColOddRow;
    return isEvenRow ? theme.cellOddColEvenRow : theme.cellOddColOddRow;
  };

  const firstColColor = (index: number) =>
    accentFirstColumn && index === 0 ? theme.accent : theme.text;

  return (
    <div style={{ width: "100%", height: "50vh", overflowY: "scroll", overflowX: "scroll" }}>
      {/* Título sticky opcional */}
      {title && (
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
          {title}
        </div>
      )}

      {/* Buscador */}
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
              backgroundColor: theme.searchBg,
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

      {/* Tabla */}
      <div
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
                      position: isSticky(index) ? "sticky" : "static",
                      left: index === 0 ? 0 : undefined,
                      right:
                        stickyLastColumn && index === totalCols - 1
                          ? 0
                          : undefined,
                      backgroundColor: headerBg(index),
                      color: firstColColor(index),
                      fontWeight: "bold",
                      fontSize: isMobile ? "9px" : "10px",
                      textAlign:
                        index === 0 || index === totalCols - 1
                          ? "center"
                          : "left",
                      textTransform: "uppercase",
                      padding: isMobile ? "8px 4px" : "14px 10px",
                      cursor: "pointer",
                      zIndex: isSticky(index) ? 3 : 2,
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent:
                            index === 0 || index === totalCols - 1
                              ? "center"
                              : "flex-start",
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
                    onClick={
                      onCellClick ? () => onCellClick(cell, index) : undefined
                    }
                    style={{
                      position: isSticky(index) ? "sticky" : "static",
                      left: index === 0 ? 0 : undefined,
                      right:
                        stickyLastColumn && index === totalCols - 1
                          ? 0
                          : undefined,
                      backgroundColor: cellBg(index, rowIndex),
                      color: firstColColor(index),
                      fontWeight: "bold",
                      fontSize: isMobile ? "12px" : "11px",
                      textAlign:
                        index === 0 || index === totalCols - 1
                          ? "center"
                          : "left",
                      padding: isMobile ? "8px 4px" : "12px 10px",
                      zIndex: isSticky(index) ? 1 : 0,
                      whiteSpace: "nowrap",
                      cursor: onCellClick ? "pointer" : "default",
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
