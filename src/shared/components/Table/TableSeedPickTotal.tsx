import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { TableBase } from "./TableBase";
import { SportTheme } from "@/shared/theme/colors";

const NUMERALS = [
  "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight",
  "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
];

interface SeedRow {
  seed: string;
  number: number;
  percentage: number;
}

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  arrHistory: any;
  score: string;
  theme: SportTheme;
}

export default function TableSeedPickTotal({ arrHistory, score, theme }: Props) {
  const data = useMemo<SeedRow[]>(() => {
    const item = Array.isArray(arrHistory) ? arrHistory[0] : arrHistory;
    if (!item) return [];
    return NUMERALS.map((seed, i) => ({
      seed,
      number: item[`teams_seed${i + 1}`],
      percentage: parseFloat(item[`prnct_teams_seed${i + 1}`]),
    }));
  }, [arrHistory]);

  const columns = useMemo<ColumnDef<SeedRow>[]>(
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
    <TableBase
      data={data}
      columns={columns}
      theme={theme}
      title={score}
      maxHeight="50vh"
      searchWidth="100%"
    />
  );
}
