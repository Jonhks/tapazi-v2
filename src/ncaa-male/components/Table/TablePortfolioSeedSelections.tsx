// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useMemo } from "react";
import { TableBase } from "./Table";

const NUMERALS = [
  "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight",
  "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
];

export default function TablePortfolioSeedSelections({ arrHistory, score }) {
  const data = useMemo(() => {
    if (!arrHistory?.[0]) return [];
    return NUMERALS.map((seed, i) => ({
      seed,
      number: arrHistory[0][`seed${i + 1}`],
      percentage: arrHistory[0][`prcnt_seed${i + 1}`],
    }));
  }, [arrHistory]);

  const columns = useMemo(
    () => [
      { header: "Seed", accessorKey: "seed" },
      { header: "Times", accessorKey: "number" },
      {
        header: "% Portfolio",
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
