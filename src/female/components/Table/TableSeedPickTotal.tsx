import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { TableBase } from "./Table";

const numeration = [
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
];

type SeedRow = { seed: string; number: number; percentage: number };

export default function TableSeedPickTotal({
  arrHistory,
  score,
}: {
  arrHistory: Record<string, number>[];
  score: string;
}) {
  const tableData = useMemo<SeedRow[]>(() => {
    if (!arrHistory?.[0]) return [];
    return numeration.map((seed, i) => ({
      seed,
      number: arrHistory[0][`teams_seed${i + 1}`],
      percentage: parseFloat(String(arrHistory[0][`prnct_teams_seed${i + 1}`])),
    }));
  }, [arrHistory]);

  const columns = useMemo<ColumnDef<SeedRow>[]>(
    () => [
      { header: "Seed", accessorKey: "seed" },
      { header: "Number", accessorKey: "number" },
      {
        header: "Percentage",
        accessorKey: "percentage",
        cell: ({ getValue }) => <span>{getValue() as number}%</span>,
      },
    ],
    [],
  );

  return (
    <TableBase
      data={tableData}
      columns={columns}
      title={score}
      maxHeight="400px"
      stickyLastColumn
    />
  );
}
