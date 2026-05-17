import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { TableBase } from "./TableBase";
import { SportTheme } from "@/shared/theme/colors";

interface PerfectPortfolio {
  year: string | number;
  total_weight: string | number;
  total_points: string | number;
}

interface Props {
  arrHistory: PerfectPortfolio[];
  score: string;
  theme: SportTheme;
}

export default function TableHistoryPerfectPortfolios({ arrHistory, score, theme }: Props) {
  const columns = useMemo<ColumnDef<PerfectPortfolio>[]>(
    () => [
      { header: "Year", accessorKey: "year" },
      { header: "Total weight", accessorKey: "total_weight" },
      { header: "Total points", accessorKey: "total_points" },
    ],
    [],
  );

  return (
    <TableBase
      data={arrHistory ?? []}
      columns={columns}
      theme={theme}
      title={score}
    />
  );
}
