// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useMemo } from "react";
import { TableBase } from "./Table";

const NUMERALS = [
  "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight",
  "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
];

export default function TableSeedPickTotal({ arrHistory, score }) {
  const data = useMemo(() => {
    if (!arrHistory?.[0]) return [];
    return NUMERALS.map((seed, i) => ({
      seed,
      number: arrHistory[0][`teams_seed${i + 1}`],
      percentage: arrHistory[0][`prcnt_teams_seed${i + 1}`],
    }));
  }, [arrHistory]);

  const columns = useMemo(
    () => [
      { header: "Seed", accessorKey: "seed" },
      { header: "Number", accessorKey: "number" },
      {
        header: "Percentage",
        accessorKey: "percentage",
        cell: (info) => `${info.getValue()}%`,
      },
    ],
    [],
  );

  return (
    <TableBase data={data} columns={columns} title={score} maxHeight="50vh" />
  );
}
