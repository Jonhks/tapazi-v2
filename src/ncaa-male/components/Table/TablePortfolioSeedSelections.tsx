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
    const item = Array.isArray(arrHistory) ? arrHistory[0] : arrHistory;
    if (!item) return [];
    return NUMERALS.map((seed, i) => ({
      seed,
      number: item[`seed${i + 1}`],
      percentage: parseFloat(item[`prnct_seed${i + 1}`]),
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
    <TableBase data={data} columns={columns} title={score} maxHeight="50vh" searchWidth="100%" />
  );
}
