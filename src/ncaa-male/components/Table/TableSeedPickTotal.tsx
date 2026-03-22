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
    const item = Array.isArray(arrHistory) ? arrHistory[0] : arrHistory;
    if (!item) return [];
    return NUMERALS.map((seed, i) => ({
      seed,
      number: item[`teams_seed${i + 1}`],
      percentage: parseFloat(item[`prnct_teams_seed${i + 1}`]),
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
    <TableBase data={data} columns={columns} title={score} maxHeight="50vh" searchWidth="100%" />
  );
}
