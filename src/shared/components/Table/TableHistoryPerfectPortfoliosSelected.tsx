import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { TableBase } from "./TableBase";
import { SportTheme } from "@/shared/theme/colors";

interface TeamEntry {
  name: string;
  points: string | number;
}

interface Props {
  arrHistory: TeamEntry[] | string;
  score: string;
  TeamPerfectPortfoliosSelected?: string | number;
  theme: SportTheme;
}

export default function TableHistoryPerfectPortfoliosSelected({
  arrHistory,
  score,
  TeamPerfectPortfoliosSelected,
  theme,
}: Props) {
  if (typeof arrHistory === "string") return null;

  const columns = useMemo<ColumnDef<TeamEntry>[]>(
    () => [
      { header: "Name", accessorKey: "name" },
      { header: "Points", accessorKey: "points" },
    ],
    [],
  );

  const title = TeamPerfectPortfoliosSelected
    ? `${score} Year: ${TeamPerfectPortfoliosSelected}`
    : score;

  return (
    <TableBase
      data={arrHistory ?? []}
      columns={columns}
      theme={theme}
      title={title}
    />
  );
}
