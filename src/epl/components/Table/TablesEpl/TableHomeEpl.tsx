import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
  // RowSelectionState,
} from "@tanstack/react-table";

import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { Input, InputAdornment, Tooltip } from "@mui/material";
import { NewPortfolio, ScoresEplHome, Tournament } from "@/types/index";
import SearchIcon from "@mui/icons-material/Search";
import classes from "../Table.module.css";
import ModalTableHome from "../../Modal/Modal";
import { extractWeekNumber } from "@/utils/formulas";

const TableHomeEpl = ({
  data,
  // portfolio,
  tournament,
}: {
  data: ScoresEplHome;
  // portfolio: NewPortfolio;
  tournament: Tournament;
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filtered, setFiltered] = useState<string>("");
  const [openModal, setOpenModal] = useState(false);
  const [week, setWeek] = useState<string>("1");
  const [portfolioId, setPortfolioId] = useState<string>("1");
  const [portfolio, setPortfolio] = useState<NewPortfolio>({} as NewPortfolio);
  // console.log(portfolioId);

  const columns = [
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Portfolio ID",
      accessorKey: "portfolio_id",
    },
    {
      header: "Week 1",
      accessorKey: "score_week1",
    },
    {
      header: "Week 2",
      accessorKey: "score_week2",
    },
    {
      header: "Week 3",
      accessorKey: "score_week3",
    },
    {
      header: "Week 4",
      accessorKey: "score_week4",
    },
    {
      header: "Week 5",
      accessorKey: "score_week5",
    },
    {
      header: "Week 6",
      accessorKey: "score_week6",
    },
    {
      header: "Week 7",
      accessorKey: "score_week7",
    },
    {
      header: "Week 8",
      accessorKey: "score_week8",
    },
    {
      header: "Week 9",
      accessorKey: "score_week9",
    },
    {
      header: "Week 10",
      accessorKey: "score_week10",
    },
    {
      header: "Week 11",
      accessorKey: "score_week11",
    },
    {
      header: "Week 12",
      accessorKey: "score_week12",
    },
    {
      header: "Week 13",
      accessorKey: "score_week13",
    },
    {
      header: "Week 14",
      accessorKey: "score_week14",
    },
    {
      header: "Week 15",
      accessorKey: "score_week15",
    },
    {
      header: "Week 16",
      accessorKey: "score_week16",
    },
    {
      header: "Week 17",
      accessorKey: "score_week17",
    },
    {
      header: "Week 18",
      accessorKey: "score_week18",
    },
    {
      header: "Week 19",
      accessorKey: "score_week19",
    },
    {
      header: "Week 20",
      accessorKey: "score_week20",
    },
    {
      header: "Week 21",
      accessorKey: "score_week21",
    },
    {
      header: "Week 22",
      accessorKey: "score_week22",
    },
    {
      header: "Week 23",
      accessorKey: "score_week23",
    },
    {
      header: "Week 24",
      accessorKey: "score_week24",
    },
    {
      header: "Week 25",
      accessorKey: "score_week25",
    },
    {
      header: "Week 26",
      accessorKey: "score_week26",
    },
    {
      header: "Week 27",
      accessorKey: "score_week27",
    },
    {
      header: "Week 28",
      accessorKey: "score_week28",
    },
    {
      header: "Week 29",
      accessorKey: "score_week29",
    },
    {
      header: "Week 30",
      accessorKey: "score_week30",
    },
    {
      header: "Week 31",
      accessorKey: "score_week31",
    },
    {
      header: "Week 32",
      accessorKey: "score_week32",
    },
    {
      header: "Week 33",
      accessorKey: "score_week33",
    },
    {
      header: "Week 34",
      accessorKey: "score_week34",
    },
    {
      header: "Week 35",
      accessorKey: "score_week35",
    },
    {
      header: "Week 36",
      accessorKey: "score_week36",
    },
    {
      header: "Week 37",
      accessorKey: "score_week37",
    },
    {
      header: "Week 38",
      accessorKey: "score_week38",
    },
    {
      header: "Score",
      accessorKey: "score",
    },
  ];

  const table = useReactTable({
    data: Array.isArray(data) ? data : [data],
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
          margin: 0,
          padding: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ModalTableHome
          openModal={openModal}
          setOpenModal={setOpenModal}
          week={week}
          portfolioId={portfolioId}
          portfolio={portfolio}
        />
        <Input
          type={"search"}
          sx={{
            width: "100%",
            height: "",
            padding: "0",
          }}
          placeholder="Search..."
          color={"warning"}
          value={filtered ?? ""}
          onChange={(e) => setFiltered(String(e.target.value))}
          startAdornment={
            <InputAdornment position="end">
              <SearchIcon color="inherit" />
            </InputAdornment>
          }
          inputProps={{
            style: { textTransform: "lowercase" },
            autoCapitalize: "none",
          }}
        />
      </div>
      <table
        style={{
          width: "100%", // Asegura que la tabla ocupe el ancho completo del contenedor
          borderCollapse: "collapse",
          overflow: "hideden",
        }}
      >
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header, index) => (
                <Tooltip
                  key={header.id}
                  placement="top"
                  title={`${
                    extractWeekNumber(header.id) ===
                    String(tournament.current_round)
                      ? "Current Round"
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )
                  }`}
                >
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    style={{
                      position:
                        index === 0 || index === columns.length - 1
                          ? "sticky"
                          : "static", // Fija la primera y última columna
                      left: index === 0 ? 0 : undefined, // Fija la primera columna a la izquierda
                      right: index === columns.length - 1 ? 0 : undefined, // Fija la última columna a la derecha
                      backgroundColor:
                        extractWeekNumber(header.id) ===
                        String(tournament.current_round)
                          ? "var(--verde)" // Fondo para las columnas fijas, // Fondo para las columnas fijas
                          : "#200930",
                      zIndex: 2, // Asegura que las columnas fijas estén por encima de las demás
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "14px",
                      textAlign: "center",
                      padding: "12px",
                      cursor: "pointer",
                    }}
                  >
                    {/* {console.log(extractWeekNumber(header.id))} */}
                    {header.isPlaceholder ? null : (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <p>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                        </p>
                        {{
                          asc: <ArrowUpwardIcon style={{ fontSize: "20px" }} />,
                          desc: (
                            <ArrowUpwardIcon
                              style={{
                                transform: "rotate(180deg)",
                                fontSize: "20px",
                              }}
                            />
                          ),
                          undefined: (
                            <div>
                              <ArrowUpwardIcon
                                style={{
                                  color: "gray", // Color neutro para indicar que no está ordenado
                                  fontSize: "20px",
                                }}
                              />
                            </div>
                          ),
                        }[header.column.getIsSorted() as string] || (
                          <ArrowUpwardIcon
                            style={{
                              color: "gray", // Color neutro para indicar que no está ordenado
                              fontSize: "18px",
                            }}
                          />
                        )}
                      </div>
                    )}
                  </th>
                </Tooltip>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell, index) => (
                <td
                  key={cell.id}
                  onClick={() => {
                    if (
                      index === 0 ||
                      index === 1 ||
                      index === columns.length - 1
                    )
                      return;
                    setPortfolioId(cell.row.original.portfolio_id);
                    setWeek(extractWeekNumber(cell.id)?.toString() || "1");
                    setOpenModal(true);
                    setPortfolio(cell.row.original);
                  }}
                  className={`${
                    index !== 0 &&
                    index !== 1 &&
                    index !== columns.length - 1 &&
                    classes.cell
                  }`}
                  style={{
                    position:
                      index === 0 || index === columns.length - 1
                        ? "sticky"
                        : "static", // Fija la primera y última columna
                    left: index === 0 ? 0 : undefined, // Fija la primera columna a la izquierda
                    right: index === columns.length - 1 ? 0 : undefined, // Fija la última columna a la derecha
                    backgroundColor:
                      index === 0 || index === 1 || index === columns.length - 1
                        ? "#200930"
                        : "#380f51", // Fondo para las columnas fijas, // Fondo para las columnas fijas
                    transition: "background-color 0.3s ease", // Transición suave
                    zIndex: 1, // Asegura que las columnas fijas estén por encima de las demás
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "12px",
                    textAlign: "center",
                    padding: "8px",
                  }}
                  // style={{ backgroundColor: "red" }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default TableHomeEpl;
