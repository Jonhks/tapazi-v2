import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
} from "@tanstack/react-table";

import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

const TableHomeEpl = ({ data }) => {
  const [sorting, setSorting] = useState<SortingState>([]);

  console.log(data);

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
      header: "Week 1 Score",
      accessorKey: "score_week1",
    },
    {
      header: "Week 2 Score",
      accessorKey: "score_week2",
    },
    {
      header: "Week 3 Score",
      accessorKey: "score_week3",
    },
    {
      header: "Week 4 Score",
      accessorKey: "score_week4",
    },
    {
      header: "Week 5 Score",
      accessorKey: "score_week5",
    },
    {
      header: "Week 6 Score",
      accessorKey: "score_week6",
    },
    {
      header: "Week 7 Score",
      accessorKey: "score_week7",
    },
    {
      header: "Week 8 Score",
      accessorKey: "score_week8",
    },
    {
      header: "Week 9 Score",
      accessorKey: "score_week9",
    },
    {
      header: "Week 10 Score",
      accessorKey: "score_week10",
    },
    {
      header: "Week 11 Score",
      accessorKey: "score_week11",
    },
    {
      header: "Week 12 Score",
      accessorKey: "score_week12",
    },
    {
      header: "Week 13 Score",
      accessorKey: "score_week13",
    },
    {
      header: "Week 14 Score",
      accessorKey: "score_week14",
    },
    {
      header: "Week 15 Score",
      accessorKey: "score_week15",
    },
    {
      header: "Week 16 Score",
      accessorKey: "score_week16",
    },
    {
      header: "Week 17 Score",
      accessorKey: "score_week17",
    },
    {
      header: "Week 18 Score",
      accessorKey: "score_week18",
    },
    {
      header: "Week 19 Score",
      accessorKey: "score_week19",
    },
    {
      header: "Week 20 Score",
      accessorKey: "score_week20",
    },
    {
      header: "Week 21 Score",
      accessorKey: "score_week21",
    },
    {
      header: "Week 22 Score",
      accessorKey: "score_week22",
    },
    {
      header: "Week 23 Score",
      accessorKey: "score_week23",
    },
    {
      header: "Week 24 Score",
      accessorKey: "score_week24",
    },
    {
      header: "Week 25 Score",
      accessorKey: "score_week25",
    },
    {
      header: "Week 26 Score",
      accessorKey: "score_week26",
    },
    {
      header: "Week 27 Score",
      accessorKey: "score_week27",
    },
    {
      header: "Week 28 Score",
      accessorKey: "score_week28",
    },
    {
      header: "Week 29 Score",
      accessorKey: "score_week29",
    },
    {
      header: "Week 30 Score",
      accessorKey: "score_week30",
    },
    {
      header: "Week 31 Score",
      accessorKey: "score_week31",
    },
    {
      header: "Week 32 Score",
      accessorKey: "score_week32",
    },
    {
      header: "Week 33 Score",
      accessorKey: "score_week33",
    },
    {
      header: "Week 34 Score",
      accessorKey: "score_week34",
    },
    {
      header: "Week 35 Score",
      accessorKey: "score_week35",
    },
    {
      header: "Week 36 Score",
      accessorKey: "score_week36",
    },
    {
      header: "Week 37 Score",
      accessorKey: "score_week37",
    },
    {
      header: "Score Week 38",
      accessorKey: "score_week38",
    },
    {
      header: "Score",
      accessorKey: "score",
    },
  ];
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
    },
    onSortingChange: setSorting,
  });

  return (
    <>
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {header.isPlaceholder ? null : (
                    <div>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: <ArrowUpwardIcon />,
                        desc: (
                          <ArrowUpwardIcon
                            style={{ transform: "rotate(180deg)" }}
                          />
                        ),
                      }[header.column.getIsSorted() as string] || null}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
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
