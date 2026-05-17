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
import { Input, InputAdornment, Tooltip, useMediaQuery } from "@mui/material";
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
  /** Invertir el color oscuro/claro de las columnas (pares se vuelven impares) */
  invertColorColumns?: boolean;
  /**
   * Hace que la segunda columna (índice 1) también sea sticky.
   * Requiere saber el ancho de la primera columna — ver col0Width.
   */
  stickySecondColumn?: boolean;
  /**
   * Ancho en px de la primera columna cuando stickySecondColumn=true.
   * Determina en qué punto se posiciona la segunda columna sticky.
   * Por defecto: 120.
   */
  col0Width?: number;
  /**
   * Devuelve el color de fondo de una columna concreta, o null para usar el default.
   * Útil para resaltar la semana activa en EPL.
   * Recibe el id de columna (accessorKey) y su índice.
   */
  highlightColBg?: (colId: string, colIndex: number) => string | null;
  /**
   * Devuelve el texto del tooltip del header, o null si no hay tooltip.
   * Recibe el id de columna (accessorKey) y su índice.
   */
  headerTooltip?: (colId: string, colIndex: number) => string | null;
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
  invertColorColumns: _invertColorColumns = false,
  stickySecondColumn = false,
  col0Width = 120,
  highlightColBg,
  headerTooltip,
}: TableBaseProps<T>) {
  const [sorting, setSorting] = useState<SortingState>(defaultSorting);
  const [filtered, setFiltered] = useState("");
  const deferredFiltered = useDeferredValue(filtered);
  const isMobile = useMediaQuery("(max-width:900px)");
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);
  const [hoveredCellId, setHoveredCellId] = useState<string | null>(null);

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
    index === 0 ||
    (stickySecondColumn && index === 1) ||
    (stickyLastColumn && index === totalCols - 1);

  // Posición left para columnas sticky
  const getStickyLeft = (index: number): number | string | undefined => {
    if (index === 0) return 0;
    if (stickySecondColumn && index === 1) return col0Width;
    return undefined;
  };

  // Dos colores: fuerte (header + sticky + hover) y suave (contenido)
  const strongBg = theme.headerEven;
  const softBg = theme.cellOddColOddRow;

  const firstColColor = (index: number) =>
    accentFirstColumn && index === 0 ? theme.accent : theme.text;

  return (
    <div style={{ width: "100%", height: "47vh", overflow: "scroll" }}>
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
          width: "100%",
          overflowY: maxHeight ? "scroll" : "visible",
          overflowX: "visible",
          ...(maxHeight ? { maxHeight } : {}),
        }}
      >
        <table
          style={{ width: "100%", borderCollapse: "collapse", opacity: 0.9 }}
        >
          <thead style={{ position: "sticky", top: 0, zIndex: 2 }}>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => {
                  const bg =
                    highlightColBg?.(header.id, index) ?? strongBg;
                  const tip = headerTooltip?.(header.id, index);

                  const thProps = {
                    onClick: header.column.getToggleSortingHandler(),
                    style: {
                      position: isSticky(index)
                        ? ("sticky" as const)
                        : ("static" as const),
                      left: getStickyLeft(index),
                      right:
                        stickyLastColumn && index === totalCols - 1
                          ? 0
                          : undefined,
                      minWidth:
                        stickySecondColumn && index === 0
                          ? col0Width
                          : undefined,
                      backgroundColor: bg,
                      color: firstColColor(index),
                      fontWeight: "bold" as const,
                      fontSize: isMobile ? "9px" : "10px",
                      textAlign: (index === 0 || index === totalCols - 1
                        ? "center"
                        : "left") as "center" | "left",
                      textTransform: "uppercase" as const,
                      padding: isMobile ? "8px 4px" : "14px 10px",
                      cursor: "pointer" as const,
                      zIndex: isSticky(index) ? 3 : 2,
                      whiteSpace: "pre-wrap" as const,
                    },
                  };

                  const thContent = header.isPlaceholder ? null : (
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
                  );

                  if (tip) {
                    return (
                      <Tooltip
                        key={header.id}
                        title={tip}
                        placement="top"
                      >
                        <th {...thProps}>{thContent}</th>
                      </Tooltip>
                    );
                  }

                  return (
                    <th
                      key={header.id}
                      {...thProps}
                    >
                      {thContent}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                onMouseEnter={() => setHoveredRowId(row.id)}
                onMouseLeave={() => setHoveredRowId(null)}
              >
                {row.getVisibleCells().map((cell, index) => {
                  const sticky = isSticky(index);
                  const isRowHovered = hoveredRowId === row.id;
                  const isCellHovered = !sticky && hoveredCellId === cell.id;

                  const bg = isCellHovered
                    ? strongBg
                    : isRowHovered
                      ? theme.rowHoverBg
                      : (highlightColBg?.(cell.column.id, index) ??
                        (sticky ? strongBg : softBg));

                  return (
                    <td
                      key={cell.id}
                      onClick={
                        onCellClick ? () => onCellClick(cell, index) : undefined
                      }
                      onMouseEnter={
                        !sticky
                          ? () => setHoveredCellId(cell.id)
                          : undefined
                      }
                      onMouseLeave={
                        !sticky ? () => setHoveredCellId(null) : undefined
                      }
                      style={{
                        position: sticky
                          ? ("sticky" as const)
                          : ("static" as const),
                        left: getStickyLeft(index),
                        right:
                          stickyLastColumn && index === totalCols - 1
                            ? 0
                            : undefined,
                        minWidth:
                          stickySecondColumn && index === 0
                            ? col0Width
                            : undefined,
                        backgroundColor: bg,
                        color: firstColColor(index),
                        fontWeight: "bold",
                        fontSize: isMobile ? "12px" : "11px",
                        textAlign:
                          index === 0 || index === totalCols - 1
                            ? "center"
                            : "left",
                        padding: isMobile ? "8px 4px" : "12px 10px",
                        zIndex: sticky ? 1 : 0,
                        whiteSpace: "nowrap",
                        cursor: onCellClick ? "pointer" : "default",
                        transition: "background-color 0.15s ease",
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
    </div>
  );
}
